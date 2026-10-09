import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production' || process.env.VITE_PROD === 'true';

// Initialize Gemini SDK securely using process.env
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("Peringatan: GEMINI_API_KEY belum dikonfigurasi. Generator AI akan menggunakan fallback lokal di sisi klien.");
}

// Helper to call Gemini models with resilient fallback (gemini-3.8-flash -> gemini-3.1-flash-lite)
async function callGeminiWithFallback(aiInstance: GoogleGenAI, requestPayload: any) {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;
  for (const model of models) {
    try {
      const response = await aiInstance.models.generateContent({
        ...requestPayload,
        model: model
      });
      return { response, usedModel: model };
    } catch (err: any) {
      lastError = err;
      console.warn(`Panggilan model ${model} mengalami kendala (${err.message || 'Error'}). Mencoba model cadangan...`);
      // Brief pause to allow temporary demand spike to ease
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  throw lastError;
}

// API endpoint to verify real-time API connection status
app.get('/api/api-status', (req: express.Request, res: express.Response) => {
  if (!apiKey || !ai) {
    return res.json({
      status: 'offline',
      connected: false,
      message: 'Kunci API (GEMINI_API_KEY) belum terpasang di environment server.'
    });
  }

  return res.json({
    status: 'online',
    connected: true,
    model: 'gemini-3.8-flash',
    message: 'Koneksi Google Gemini API aktif dan siap digunakan secara langsung!'
  });
});

// API endpoint for generating prompts using Gemini 3.8 Flash (with 3.1 Flash Lite fallback)
app.post('/api/generate-prompts', async (req: express.Request, res: express.Response) => {
  const { topic, ageGroup, pages, layout, visualStyle, detailLevel, language, mascot } = req.body;

  if (!topic || !ageGroup || !pages || !Array.isArray(pages)) {
    return res.status(400).json({ error: 'Data input tidak lengkap. Harap isi topik, target usia, dan daftar halaman.' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'Layanan AI belum siap karena kunci API (GEMINI_API_KEY) belum dikonfigurasi pada setelan server. Silakan hubungkan API Key Anda.'
    });
  }

  try {
    const pageListStr = pages.map((p: string, i: number) => `Halaman ${i + 1}: ${p}`).join('\n');
    const mascotText = mascot.type === 'none' 
      ? 'Tanpa Maskot (Fokus murni diagram edukatif bersih)' 
      : mascot.type === 'custom' && mascot.imageName
        ? `Karakter Kustom Berdasarkan Foto Unggahan Guru ("${mascot.imageName}"). Deskripsi: ${mascot.description || 'Karakter pendamping tutor ramah yang konsisten dengan foto referensi'}. Pastikan konsistensi ciri visual karakter di setiap slide.`
        : `Jenis Maskot: ${mascot.type}. Deskripsi Maskot: ${mascot.description || 'Karakter pendamping edukatif yang lucu dan ramah (tutor cilik/hewan pintar/guru kartun).'}`;

    const effectiveDetail = detailLevel || 'clean-minimalis';

    const systemInstruction = `Anda adalah Senior Educational UI/UX Designer, Instructional Designer, dan AI Image Prompt Engineer terkemuka.
Tugas Anda adalah merancang teks prompt gambar (AI Image Prompt) yang SANGAT BERSIH (ULTRA-CLEAN), RAPI, dan PROFESIONAL seperti slide media pembelajaran interaktif modern (layout 16:9 landscape atau 9:16 portrait).

Input Desain:
- Topik: "${topic}"
- Target Usia Siswa: ${ageGroup}
- Struktur Halaman yang diminta:
${pageListStr}
- Tata Letak: ${layout === 'portrait' ? '9:16 (Portrait)' : '16:9 (Landscape)'}
- Gaya Visual & Estetika: ${visualStyle}
- Tingkat Detail Visual: ${effectiveDetail === 'clean-minimalis' ? 'Clean Minimalis (Latar sederhana, sedikit ornamen, ikon jelas, kartu rounded bersih, whitespace lega, fokus pada keterbacaan)' : effectiveDetail === '3d-premium' ? '3D Premium (Karakter 3D berkilau, pencahayaan lembut studio, kartu translucent modern)' : effectiveDetail === '3d-detail-tinggi' ? '3D Detail Tinggi (Tekstur terperinci, karakter ekspresif, tetap rapi)' : 'Adaptif Otomatis'}
- Bahasa Pengantar: ${language}
- Karakter/Maskot: ${mascotText}

STANDAR KOMPOSISI VISUAL BERSIH (SESUAI GAMBAR CONTOH / USER REFERENCE):
1. CLEAN PROMPT (Teks Prompt Bahasa Inggris Murni Tanpa Label Form):
   - WAJIB dalam bahasa Inggris yang mengalir alami dan siap langsung ditempel ke Canva Magic Media, Midjourney v6, DALL-E 3, atau Imagen 3.
   - DILARANG menyertakan label form administratif seperti "Ukuran:", "Style:", "Background Environment:", "Center Subject / Graphic:", "Header Text:", dsb. karena label teks tersebut akan merusak hasil generator AI dan membuat gambar menjadi acak-acakan.
   - Komposisi wajib mengikuti prinsip UI slide presentasi bersih:
     * Rasio: ${layout === 'portrait' ? '9:16 portrait ratio' : '16:9 landscape ratio'}
     * Karakter pendamping: di sisi kiri atau sudut, berpose ramah, tersenyum, menyapa atau menunjuk ke arah materi.
     * Kartu konten utama: kartu putih bersih dengan sudut melengkung lembut (large clean white rounded card container, subtle soft drop shadow) dengan whitespace/ruang kosong yang lapang.
     * Latar pemandangan/lingkungan: latar lembut yang tenang (seperti perbukitan hijau kartun lembut, langit cerah dengan awan 3D clay halus, dan sentuhan elemen sesuai topik "${topic}").
     * Tombol interaktif: tombol taktil melengkung mengilap di bagian bawah (glossy rounded action button).
     * Estetika: uncluttered, minimalist composition, ample negative space, high legibility, soft studio ambient lighting, 8k resolution, UI/UX educational presentation slide mockup.

2. MIDJOURNEY PROMPT:
   - Teks cleanPrompt yang diakhiri parameter rasio: "--ar ${layout === 'portrait' ? '9:16' : '16:9'} --v 6.0 --style raw"

3. DESKRIPSI SPESIFIKASI MANUAL (illustrationDesc):
   - Panduan bahasa Indonesia terstruktur yang rapi untuk guru yang ingin merakit slide secara manual di Canva atau PowerPoint:
     Layout: ... | Karakter: ... | Kartu Konten: ... | Tombol: ... | Palet Warna: ...

4. QUIZ DATA:
   - Jika halaman adalah kuis (Kuis 1-4), sertakan soal pilihan ganda relevan lengkap dengan 4 opsi, kunci jawaban (A/B/C/D), dan penjelasan mendidik.

Kembalikan dalam struktur JSON ARRAY objek:
- pageTitle (string)
- headerText (string)
- cleanPrompt (string: prompt bahasa Inggris murni siap paste ke AI image generator)
- midjourneyPrompt (string: cleanPrompt + parameter Midjourney)
- illustrationDesc (string: panduan spesifikasi tata letak manual bahasa Indonesia)
- canvaKeywords (string: 3-5 kata kunci pencarian Canva bahasa Inggris)
- navigationButtons (string)
- estimatedTime (string)
- educationalObjective (string)
- quizData (opsional: objek kuis pilihan ganda)`;

    const contents = `Tolong buatkan visual prompt ultra-clean siap pakai untuk media pembelajaran "${topic}".
Daftar halaman:
${pageListStr}

Pastikan teks cleanPrompt sangat bersih dan menghasilkan estetika presentasi slide UI dengan whitespace lega dan kartu rounded rapi.
Harap berikan respons dalam bentuk JSON Array valid.`;

    const { response, usedModel } = await callGeminiWithFallback(ai, {
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              pageTitle: { type: Type.STRING },
              headerText: { type: Type.STRING },
              cleanPrompt: { type: Type.STRING, description: "Prompt bahasa Inggris murni ultra-clean siap pakai untuk Canva AI / Midjourney / DALL-E" },
              midjourneyPrompt: { type: Type.STRING, description: "Prompt Midjourney lengkap dengan flag parameter" },
              illustrationDesc: { type: Type.STRING, description: "Panduan spesifikasi layout terstruktur bahasa Indonesia" },
              canvaKeywords: { type: Type.STRING, description: "Kata kunci pencarian aset di Canva" },
              navigationButtons: { type: Type.STRING },
              estimatedTime: { type: Type.STRING },
              educationalObjective: { type: Type.STRING },
              quizData: {
                type: Type.OBJECT,
                description: "Objek kuis pilihan ganda untuk halaman kuis.",
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            },
            required: ["pageTitle", "headerText", "cleanPrompt", "illustrationDesc", "navigationButtons", "estimatedTime", "educationalObjective"]
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Gagal mendapatkan respon teks dari Gemini API.');
    }

    const parsedPrompts = JSON.parse(textOutput.trim());
    return res.json({ prompts: parsedPrompts, usedModel: usedModel });

  } catch (err: any) {
    console.error('Error generating prompts via Gemini:', err);
    return res.status(500).json({ 
      error: `Gagal membuat prompt via AI: ${err.message || 'Kesalahan sistem internal.'}. Anda tetap bisa menggunakan mode generator manual gratis kami.`
    });
  }
});

// API endpoint for analyzing uploaded teaching material documents (TXT, PDF/DOCX base64, notes)
app.post('/api/analyze-material', async (req: express.Request, res: express.Response) => {
  const { textContent, base64Data, mimeType, fileName } = req.body;

  if (!textContent && !base64Data) {
    return res.status(400).json({ error: 'Tidak ada teks atau dokumen materi yang dikirimkan.' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'Layanan AI belum siap (GEMINI_API_KEY belum terpasang). Silakan pasang API key pada menu Settings > Secrets.'
    });
  }

  try {
    const systemInstruction = `Anda adalah seorang Ahli Kurikulum Pendidikan dan Pengembang Media Pembelajaran Interaktif EduSmart Lab.
Tugas Anda adalah menganalisis dokumen/naskah materi pembelajaran yang diunggah oleh guru (nama file: "${fileName || 'materi.pdf'}").

ATURAN UTAMA:
1. JUDUL/TOPIK: Ekstrak JUDUL PERSIS yang tertulis pada dokumen naskah (judul utama, bab, atau topik pembelajaran di baris-baris pertama dokumen). Jangan mengarang judul yang melenceng dari apa yang tertulis di dalam file!
2. TARGET USIA: Tentukan target usia yang paling cocok: 'PAUD (3-5 tahun)', 'SD Kelas Rendah (6-8 tahun)', 'SD Kelas Tinggi (9-11 tahun)', 'SMP (12-14 tahun)', atau 'SMA/Umum (15+ tahun)'.
3. STRUKTUR 13 HALAMAN STANDAR INTERAKTIF:
   Susun alur tepat 13 slide standar EduSmart Lab dengan menyesuaikan sub-topik dan 4 pertanyaan kuis dengan isi naskah dokumen:
   1. Cover: [Judul Topik Dokumen]
   2. Navigasi (Tujuan Pembelajaran, Kuis)
   3. Tujuan Pembelajaran
   4. Apersepsi
   5. Peta Perjalanan Kuis (4 titik kuis)
   6. Kuis 1: [Pertanyaan pilihan ganda 1 berdasarkan isi dokumen]
   7. Kuis 2: [Pertanyaan pilihan ganda 2 berdasarkan isi dokumen]
   8. Kuis 3: [Pertanyaan pilihan ganda 3 berdasarkan isi dokumen]
   9. Kuis 4: [Pertanyaan pilihan ganda 4 berdasarkan isi dokumen]
   10. Respon Benar
   11. Respon Salah
   12. Rangkuman/Summary
   13. Penutup
4. RANGKUMAN: Buat ringkasan ramah guru 2-3 kalimat yang membuktikan bahwa materi dokumen benar-benar dibaca dan dipahami secara akurat.

Hasilkan JSON dengan format:
{
  "extractedTopic": "Judul persis dari isi dokumen (maksimal 6-8 kata)",
  "recommendedAgeGroup": "Kategori usia",
  "suggestedPages": [
    "Cover",
    "Navigasi (Tujuan Pembelajaran, Kuis)",
    "Tujuan Pembelajaran",
    "Apersepsi",
    "Peta Perjalanan Kuis (4 titik kuis)",
    "Kuis 1: ...",
    "Kuis 2: ...",
    "Kuis 3: ...",
    "Kuis 4: ...",
    "Respon Benar",
    "Respon Salah",
    "Rangkuman/Summary",
    "Penutup"
  ],
  "summary": "Ringkasan akurat isi naskah dokumen."
}`;

    let contentsPayload: any;
    if (base64Data && mimeType && (mimeType.includes('pdf') || mimeType.includes('image'))) {
      contentsPayload = [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        },
        {
          text: `Tolong analisis dokumen materi pembelajaran "${fileName}" di atas. Ekstrak judul utama paling akurat dari dokumen, target usia, dan susun 6-8 daftar judul slide.`
        }
      ];
    } else {
      contentsPayload = `Berikut adalah naskah dokumen materi pembelajaran yang diunggah (${fileName}):\n\n${(textContent || '').slice(0, 15000)}`;
    }

    const { response, usedModel } = await callGeminiWithFallback(ai, {
      contents: contentsPayload,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedTopic: { type: Type.STRING },
            recommendedAgeGroup: { type: Type.STRING },
            suggestedPages: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summary: { type: Type.STRING }
          },
          required: ["extractedTopic", "recommendedAgeGroup", "suggestedPages", "summary"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Gagal mendapatkan respon teks dari Gemini API.');
    }

    const parsedResult = JSON.parse(textOutput.trim());
    return res.json(parsedResult);

  } catch (err: any) {
    console.error('Error analyzing material:', err);
    return res.status(500).json({ error: err.message || 'Gagal menganalisis dokumen materi.' });
  }
});

// Serve frontend build or mount Vite dev middleware
if (!IS_PROD) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  
  app.use(vite.middlewares);
  
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const rawHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
      let template = await vite.transformIndexHtml(url, rawHtml);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server EduSmart Lab berjalan di http://localhost:${PORT}`);
});
