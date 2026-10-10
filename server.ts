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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// Helper to determine clean adaptive theme based on subject & topic
function getAdaptiveSubjectTheme(subject: string = '', topic: string = '') {
  const text = `${subject} ${topic}`.toLowerCase();
  if (text.includes('matematika') || text.includes('math') || text.includes('hitung') || text.includes('aljabar') || text.includes('geometri') || text.includes('pecahan')) {
    return {
      bg: "clean minimalist backdrop with subtle pale geometric grid lines and soft neutral slate tint",
      elements: "crisp geometric shapes, mathematical symbols (+, -, ×, ÷), neatly formatted formulas, and clean coordinate diagrams",
      palette: "slate navy, soft cobalt blue, and clean white with subtle warm amber accents",
      canvaKeywords: "math education, clean geometry, minimalist mathematics, vector math icons"
    };
  }
  if (text.includes('bahasa') || text.includes('literasi') || text.includes('indonesia') || text.includes('english') || text.includes('inggris') || text.includes('puisi') || text.includes('cerita')) {
    return {
      bg: "clean contemporary educational backdrop with soft beige-to-cream subtle gradient and warm study nook aesthetic",
      elements: "clean open book icon, readable typography cards, and crisp speech dialogue bubbles",
      palette: "warm terracotta, soft ivory, navy, and muted sage green",
      canvaKeywords: "reading literacy, clean book illustration, language education, minimalist classroom"
    };
  }
  if (text.includes('ips') || text.includes('sejarah') || text.includes('geografi') || text.includes('sosial') || text.includes('peta') || text.includes('budaya')) {
    return {
      bg: "clean minimalist backdrop with subtle pale topographic map lines and warm neutral tones",
      elements: "clean stylized thematic map, navigational compass icon, and cultural heritage infographic cards",
      palette: "warm sand, olive, deep indigo, and burnt orange",
      canvaKeywords: "social studies, clean geography map, history infographic, cultural heritage"
    };
  }
  if (text.includes('pai') || text.includes('agama') || text.includes('moral') || text.includes('akhlak')) {
    return {
      bg: "serene peaceful backdrop with soft subtle mint-teal gradient and clean architectural arch lines",
      elements: "neatly arranged values chart, book stand motif, and calm educational symbols",
      palette: "emerald green, warm gold, clean white, and soft teal",
      canvaKeywords: "islamic education, serene clean background, moral values, peaceful classroom"
    };
  }
  if (text.includes('informatika') || text.includes('komputer') || text.includes('coding') || text.includes('tik') || text.includes('teknologi')) {
    return {
      bg: "clean modern tech backdrop with subtle pale cyan gradient and minimalist circuit node lines",
      elements: "stylized clean monitor card, binary flow diagram, and crisp digital UI elements",
      palette: "clean slate, electric cyan, white, and deep charcoal",
      canvaKeywords: "computer science, coding education, tech UI, clean infographic"
    };
  }
  if (text.includes('paud') || text.includes('tk') || text.includes('balita')) {
    return {
      bg: "clean cheerful soft pastel gradient with very simple rounded cloud shapes and ample negative space",
      elements: "large concrete friendly shapes, colorful alphabet blocks, and high contrast items",
      palette: "soft butter yellow, sky blue, peach, and crisp white",
      canvaKeywords: "preschool education, cute simple shapes, kindergarten pastel, clean learning"
    };
  }
  // Default IPAS / Science or general topic
  return {
    bg: `clean minimalist background with soft gentle gradient and subtle contextual atmospheric cues tailored to "${topic}"`,
    elements: `clear educational diagrams and thematic visual references for "${topic}"`,
    palette: "forest green, pastel sky blue, sunny gold, and crisp white",
    canvaKeywords: `${topic.toLowerCase()}, science education, clean vector illustration, presentation slide`
  };
}

// Helper to strip any breadcrumb or navigation progress indicator chain (e.g. Cover ➔ Navigasi ...)
function sanitizeHeaderText(text: string): string {
  if (!text) return "";
  let cleaned = text;
  
  // 1. Remove specific breadcrumb sequences with various delimiters
  const breadcrumbWords = /(?:Cover|Navigasi|Tujuan|Apersepsi|Peta|Mapping|Materi|Video|Kuis|Selesai|Selesai\s*🎓)/gi;
  const delimiters = /(?:\s*(?:➔|->|→|=>|>|•|&bull;)\s*)/g;
  
  // Matches things like: [Cover ➔ Navigasi ➔ Materi ➔ Kuis ➔ Selesai] or Cover -> Navigasi
  const chainRegex = /\[?(?:(?:Cover|Navigasi|Tujuan|Apersepsi|Peta|Mapping|Materi|Video|Kuis|Selesai|Selesai\s*🎓)\s*(?:➔|->|→|=>|>|•|&bull;)\s*)+(?:Cover|Navigasi|Tujuan|Apersepsi|Peta|Mapping|Materi|Video|Kuis|Selesai|Selesai\s*🎓)\]?/gi;
  cleaned = cleaned.replace(chainRegex, "");

  // 2. Also match generic sequences of 2 or more words separated by arrows, e.g., A ➔ B ➔ C
  const genericChainRegex = /\[?[A-Za-z0-9\s/&]+(?:\s*(?:➔|->|→|=>|>|•)\s*[A-Za-z0-9\s/&]+){2,}\]?/g;
  cleaned = cleaned.replace(genericChainRegex, "");

  // 3. Remove standalone occurrences of bracketed cover->navigation chains
  const looseRegexes = [
    /\[\s*Cover\s*➔\s*Navigasi\s*➔\s*Materi\s*➔\s*Kuis\s*➔\s*Selesai\s*\]/gi,
    /Cover\s*➔\s*Navigasi\s*➔\s*Materi\s*➔\s*Kuis\s*➔\s*Selesai/gi,
    /\[\s*Cover\s*➔\s*Navigasi\s*➔\s*Kuis\s*➔\s*Selesai\s*\]/gi
  ];
  for (const regex of looseRegexes) {
    cleaned = cleaned.replace(regex, "");
  }

  // 4. Remove loose trailing or leading arrows and brackets
  cleaned = cleaned.replace(/^\s*(➔|->|→|=>|>|•)\s*/, "");
  cleaned = cleaned.replace(/\s*(➔|->|→|=>|>|•)\s*$/, "");
  cleaned = cleaned.replace(/\[\s*\]/g, "");
  cleaned = cleaned.replace(/\(\s*\)/g, "");
  
  return cleaned.trim();
}

// Helper to parse data URL into mimeType and pure base64 string
function parseDataUrl(dataUrl: string) {
  if (!dataUrl) return null;
  const matches = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!matches) return null;
  return {
    mimeType: matches[1],
    base64Data: matches[2]
  };
}

import { buildSlideIdentity, getSubjectAdaptiveDetails, compileAuthoritativeSlidePrompt } from './src/utils/slidePromptEngine.js';

// Server-side fallback prompt generator strictly following Master Prompt rules
function generateServerFallbackPrompts(payload: any) {
  const { subject = 'IPAS / Sains', topic = 'Ekosistem & Rantai Makanan', ageGroup = 'SD Kelas Tinggi (9-11 tahun)', pages = [], layout = 'landscape', visualStyle = 'Flat Cartoon / 2D Vector Education', detailLevel = 'clean-minimalis', mascot } = payload;

  return pages.map((pageTitle: string, index: number) => {
    return buildSlideIdentity(pageTitle, index, pages.length, {
      subject,
      topic,
      ageGroup,
      pages,
      layout,
      visualStyle,
      detailLevel,
      mascot
    });
  });
}

// API endpoint to analyze a custom mascot image in real-time
app.post('/api/analyze-mascot', async (req: express.Request, res: express.Response) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'Tidak ada data gambar yang dikirimkan.' });
  }

  if (!ai) {
    return res.json({ 
      description: 'Karakter tutor kustom sesuai foto referensi dengan ekspresi ramah, menggemaskan, dan mendidik.' 
    });
  }

  try {
    const parsedImg = parseDataUrl(image);
    if (!parsedImg) {
      return res.status(400).json({ error: 'Format data gambar tidak valid.' });
    }

    const mascotAnalysisPrompt = `This is a reference photo for a custom educational mascot or teacher character. 
Describe this character's visual appearance in 1-2 extremely concise sentences in English.
Focus ONLY on:
1. What species/type of character it is (e.g. a friendly young female teacher with dark brown hair wearing blue spectacles and a neat beige blazer, or a cute white fluffy rabbit with long ears).
2. Its primary colors (e.g. orange coat, pastel mint vest).
3. Distinctive features and facial expression (e.g. big shiny warm eyes, welcoming smile).
Keep it short so we can use it as a highly consistent character description across all slide visual prompts.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: parsedImg.mimeType,
            data: parsedImg.base64Data
          }
        },
        {
          text: mascotAnalysisPrompt
        }
      ]
    });

    const description = response.text?.trim() || '';
    return res.json({ description });
  } catch (err: any) {
    console.error('Error in /api/analyze-mascot:', err);
    return res.json({ 
      description: 'Karakter tutor kustom sesuai foto referensi dengan ekspresi ramah, menggemaskan, dan mendidik.' 
    });
  }
});

// API endpoint for generating prompts using Gemini 3.8 Flash (with safe local fallback)
app.post('/api/generate-prompts', async (req: express.Request, res: express.Response) => {
  const { subject = 'IPAS / Sains', topic, ageGroup, learningObjective, pages, layout, visualStyle, detailLevel, language, mascot } = req.body;

  if (!topic || !ageGroup || !pages || !Array.isArray(pages)) {
    return res.status(400).json({ error: 'Data input tidak lengkap. Harap isi topik, target usia, dan daftar halaman.' });
  }

  // If Gemini API is not configured, generate ultra-clean prompts with the server-side engine
  if (!ai) {
    const fallbackPrompts = generateServerFallbackPrompts(req.body);
    return res.json({ 
      prompts: fallbackPrompts, 
      usedModel: 'edusmart-clean-engine',
      isLocalFallback: true,
      notice: 'Prompts dirumuskan menggunakan Mesin Generator EduSmart Clean & Minimalis.' 
    });
  }

  try {
    // 1. Analyze custom mascot image with Gemini 3.8 Flash if provided and upload active
    let analyzedMascotDesc = "";
    if (mascot?.type === 'custom' && mascot?.image) {
      const parsedImg = parseDataUrl(mascot.image);
      if (parsedImg) {
        try {
          console.log("Analyzing custom mascot photo with Gemini...");
          const mascotAnalysisPrompt = `This is a reference photo for a custom educational mascot or teacher character. 
Describe this character's visual appearance in 1-2 extremely concise sentences in English.
Focus ONLY on:
1. What species/type of character it is (e.g. a friendly young female teacher with dark brown hair wearing blue spectacles and a neat beige blazer, or a cute white fluffy rabbit with long ears).
2. Its primary colors (e.g. orange coat, pastel mint vest).
3. Distinctive features and facial expression (e.g. big shiny warm eyes, welcoming smile).
Keep it short so we can use it as a highly consistent character description across all slide visual prompts.`;

          const analysisResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              {
                inlineData: {
                  mimeType: parsedImg.mimeType,
                  data: parsedImg.base64Data
                }
              },
              {
                text: mascotAnalysisPrompt
              }
            ]
          });
          
          if (analysisResponse.text) {
            analyzedMascotDesc = analysisResponse.text.trim();
            console.log("Mascot analysis output:", analyzedMascotDesc);
          }
        } catch (e: any) {
          console.warn("Failed to analyze custom mascot image, using fallback text description:", e?.message || e);
        }
      }
    }

    const pageListStr = pages.map((p: string, i: number) => `Halaman ${i + 1}: ${p}`).join('\n');
    const has2ndChar = mascot?.type === 'custom' && mascot?.hasSecondaryCharacter && mascot?.secondaryDescription;
    let mascotText = "";
    if (mascot?.type === 'none') {
      mascotText = 'Tanpa Maskot (Fokus murni diagram edukatif bersih, TANPA robot dan TANPA karakter)';
    } else if (mascot?.type === 'custom') {
      const primaryDesc = analyzedMascotDesc || mascot.description || (mascot.imageName ? `Karakter dari foto "${mascot.imageName}"` : 'Karakter tutor kustom');
      if (has2ndChar) {
        mascotText = `Dua Karakter Kustom: Karakter Utama (${primaryDesc}) didampingi Karakter Pendamping Kedua (${mascot.secondaryDescription}${mascot.characterRelationship ? `, relasi: ${mascot.characterRelationship}` : ''}). JANGAN MENAMBAHKAN KARAKTER ROBOT KECUALI PENGGUNA EKSPLISIT MEMINTA ROBOT! Pastikan kedua karakter konsisten di setiap slide pada posisi tepi tanpa menutupi materi.`;
      } else {
        mascotText = `Karakter Kustom Tunggal: ${primaryDesc}. JANGAN MENAMBAHKAN KARAKTER LAIN DAN JANGAN MENAMBAHKAN KARAKTER ROBOT KECUALI PENGGUNA EKSPLISIT MEMINTA ROBOT! Pastikan ciri fisik, pakaian, spesies, dan warna karakter ini digambarkan secara konsisten dan identik di setiap slide di posisi tepi tanpa menutupi konten.`;
      }
    } else {
      const lowerTopic = `${topic} ${subject}`.toLowerCase();
      const isRobotics = lowerTopic.includes('robot') || lowerTopic.includes('ai') || lowerTopic.includes('kecerdasan buatan') || lowerTopic.includes('robotika');
      const defaultDesc = isRobotics ? 'Robot sains ramah' : `Siswa/tutor pendamping ceria berbusana sekolah rapi sesuai mata pelajaran ${subject}`;
      mascotText = `Rekomendasi AI: ${defaultDesc}. JANGAN MENAMBAHKAN KARAKTER ROBOT KECUALI JIKA MATERI SPESIFIK TENTANG ROBOTIKA/AI ATAU PENGGUNA MEMINTANYA!`;
    }

    const effectiveDetail = detailLevel || 'clean-minimalis';

    const systemInstruction = `Anda adalah Senior Educational UI/UX Designer, Instructional Designer, dan Visual Designer yang ahli merancang media pembelajaran digital interaktif yang clean, rapi, profesional, menarik, dan mudah dipahami siswa.

Tugas Anda adalah merancang teks prompt gambar (AI Image Prompt) untuk setiap slide media pembelajaran interaktif berdasarkan mata pelajaran, topik materi, jenjang pendidikan, tujuan pembelajaran, dan preferensi pengguna.

PRINSIP UTAMA: CLEAN DESIGN OVER DECORATION.
Setiap elemen visual harus mempunyai fungsi yang jelas. Jangan menambahkan dekorasi hanya untuk mengisi ruang kosong. Konten pembelajaran adalah fokus utama (Content-First Design).

INPUT DESAIN:
- Mata Pelajaran: "${subject}"
- Judul & Topik: "${topic}"
- Jenjang Pendidikan & Target Usia: ${ageGroup}
- Tujuan Pembelajaran: ${learningObjective || `Memahami konsep inti materi ${topic}`}
- Struktur Halaman:
${pageListStr}
- Tata Letak: ${layout === 'portrait' ? '9:16 (Portrait)' : '16:9 (Landscape)'}
- Gaya Visual yang dipilih: ${visualStyle}
- Tingkat Detail Visual: ${effectiveDetail}
- Bahasa Pengantar: ${language}
- Karakter/Maskot: ${mascotText}

ATURAN ANTI-ROBOT & KARAKTER KUSTOM (SANGAT KETAT):
1. DILARANG KERAS MENAMBAHKAN KARAKTER ROBOT TANPA DIMINTA! Robot hanya boleh digunakan jika pengguna secara eksplisit meminta robot atau jika topik spesifik tentang robotika/AI.
2. Jika pengguna memilih Tanpa Maskot, DILARANG memunculkan robot atau karakter apa pun.
3. Jika pengguna memilih Karakter Kustom, gunakan karakter yang dipilih pengguna (dan karakter kedua jika diminta). JANGAN mengubahnya menjadi robot!

ATURAN ADAPTASI MATA PELAJARAN DAN TEMA (SANGAT KETAT):
1. Seluruh desain WAJIB menyesuaikan materi yang dimasukkan pengguna.
2. DILARANG menggunakan latar hutan, bunga, matahari, atau awan clay secara otomatis jika mata pelajaran atau materinya tidak relevan (misal: Matematika, Fisika, Bahasa Indonesia, Sejarah, PPKn)!
   - Matematika: angka, simbol matematika, bangun geometri, grafik, bidang koordinat, objek berhitung. Latar bersih netral atau grid bergaris halus.
   - Bahasa Indonesia: buku, teks literasi, kartu dialog, karakter cerita kontekstual. Latar sudut baca modern atau ruang literasi hangat yang tenang.
   - IPAS/IPA: fenomena alam, eksperimen lab, diagram anatomi/ekosistem sesuai spesifik materi ${topic}.
   - IPS/Sejarah: peta tematik, artefak sejarah, infografis sosial budaya, aktivitas masyarakat.
   - PAI: ilustrasi edukatif santun, ornamen nilai moral bersahaja, suasana teduh dan teratur.
   - TK/PAUD: objek konkret, bentuk sederhana, warna cerah harmonis, teks sangat singkat, maskot ramah.
   - SMP/SMA: desain lebih matang, diagram analitis, skema terstruktur, akademis, tanpa nuansa kekanak-kanakan.

ATURAN VISUAL STYLE & STRICT CLEAN LAYOUT:
1. Visual Style:
   - Clean 3D cartoon atau clean 2D illustration (sesuai pilihan: ${visualStyle}).
   - Bentuk sederhana dengan siluet jelas, warna harmonis (3-5 warna utama), pencahayaan lembut (soft ambient studio lighting), bayangan tipis dan terkendali.
   - Tekstur minimal. DILARANG efek clay berlebihan, tekstur kain kasar, outline tebal acak-acakan, bevel berlebihan, atau glossy berlebihan.
2. Background:
   - Latar sederhana dengan maksimal 2 atau 3 lapisan visual.
   - Warna solid, gradasi lembut, atau backdrop lingkungan minimalis yang tidak berebut perhatian dengan teks.
   - Kontras tinggi dengan panel kartu konten.
3. Dekorasi:
   - Dekorasi seminimal mungkin! DILARANG confetti, daun beteberan, bunga berulang, taburan bintang, kilauan liar (glitter sparkles), garis gerak komik, atau ornamen melayang tanpa makna.
   - Maksimal 3 ornamen kecil fungsional per slide.
4. Komposisi & Card Container:
   - Panel kartu konten utama: kontainer kartu putih rounded bersih (clean white rounded modular card container, subtle soft shadow, ample whitespace).
   - Penempatan karakter: di sisi tepi/kiri, berpose ramah menyapa atau menunjuk materi, TIDAK MENUTUPI materi atau kartu konten.
   - Tombol: tombol aksi taktil rounded dengan kontras jelas di bagian bawah.

STRICT SLIDE-TYPE ROUTING & VISUAL BLUEPRINT RULES:
Setiap slide HARUS mempunyai layout dan tujuan visual yang unik sesuai jenis halamannya:
1. COVER (Halaman 1):
   - Format: Landscape 16:9 / Portrait 9:16.
   - Sisi kiri:
     * Jika Tanpa Maskot: Ilustrasi konsep/diagram ilmiah minimalis yang elegan dan relevan dengan materi "${topic}" (DILARANG menambahkan karakter/robot).
     * Jika Karakter Kustom: Karakter kustom yang ditentukan pengguna (dan karakter pendamping kedua jika ada) memegang buku/properti edukatif dan menyapa ramah. DILARANG MENAMBAHKAN ROBOT jika pengguna tidak meminta robot!
     * Jika Rekomendasi AI: Karakter tutor siswa berseragam rapi yang ramah (atau robot HANYA JIKA materi berkaitan dengan robotika/AI).
   - Sisi kanan: Panel putih rounded besar dengan teks kontras tinggi. Label biru "MEDIA PEMBELAJARAN INTERAKTIF", Judul utama "${topic}" huruf besar tebal warna navy, bawah panel "${subject} - ${ageGroup}".
   - DILARANG menampilkan menu, kuis, atau breadcrumb.

2. MENU NAVIGASI:
   - Tepat 6 menu dalam grid 2x3: 1. Petunjuk, 2. Apersepsi, 3. Peta Konsep, 4. Materi, 5. Video, 6. Kuis.
   - DILARANG menu ke-7.

3. PETUNJUK:
   - Panduan cara belajar bertahap dengan ikon kecil dan poin bernomor. Bukan soal pilihan ganda!

4. APERSEPSI:
   - Visual pengantar fenomena riil seputar "${topic}" dengan pemantik rasa ingin tahu ("Tahukah Kamu?").

5. PETA KONSEP (WAJIB DIAGRAM HIERARKI / MIND MAP):
   - Diagram konsep hierarkis atau mind map dengan node utama "${topic}" di tengah/atas yang terhubung ke 4 cabang sub-konsep dengan garis konektor bersih.
   - DILARANG keras membuat peta jalur pos/game/checkpoint 1-2-3-4! Ini adalah diagram peta konsep pemikiran akademik.

6. MATERI INTI:
   - Kartu modular penjelasan esensial terstruktur dengan diagram ilmiah/materi sesuai "${topic}".

7. VIDEO PEMBELAJARAN:
   - Frame media player interaktif 16:9 dengan tombol Play besar, bar durasi, dan judul tayangan animasi materi.

8. KUIS PILIHAN GANDA:
   - Satu pertanyaan jelas di atas dan 4 kartu pilihan jawaban horizontal (A, B, C, D) dengan badge huruf bulat.

9. RESPON FEEDBACK (Benar/Salah):
   - Benar: 3 bintang emas & lencana hijau "JAWABAN BENAR!".
   - Salah: Maskot memegang bohlam ide dengan ajakan ramah "Ayo Coba Lagi!".

10. RANGKUMAN & PENUTUP:
    - 3 kartu ringkasan intisari materi dan tombol "SELESAI & ULANGI".

OUTPUT FORMAT UNTUK SETIAP SLIDE:
1. cleanPrompt: Prompt visual lengkap yang menggabungkan deskripsi visual DENGAN bagian 'EXACT TEXT TO DISPLAY (VERBATIM ON SLIDE UI)' yang memuat seluruh teks yang tampil pada preview slide:
   - Header / Title
   - Subjudul / Metadata (Mata Pelajaran & Jenjang)
   - Poin Isi Materi aktual yang ada di slide
   - Teks Tombol Aksi
   - Durasi / Estimasi Waktu
   Prompt ini siap pakai untuk Midjourney v6, Canva Magic Media, Imagen 3, atau DALL-E 3 dengan rasio ${layout === 'portrait' ? '9:16 portrait ratio' : '16:9 landscape ratio'}.
2. midjourneyPrompt: cleanPrompt + " --ar ${layout === 'portrait' ? '9:16' : '16:9'} --v 6.0 --style raw"
3. illustrationDesc: Panduan spesifikasi tata letak manual bahasa Indonesia (Layout, Latar, Kartu Konten, Karakter, Tombol, Palet Warna).
4. canvaKeywords: 3-5 kata kunci pencarian aset Canva bahasa Inggris relevan.
5. slideContent: Hasilkan 2-3 butir poin materi singkat dalam Bahasa Indonesia yang sangat relevan untuk sub-topik halaman tersebut, agar guru dapat melihat pratinjau teks yang akan dipasang di slide.
6. navigationButtons, estimatedTime, educationalObjective, dan quizData (jika halaman kuis).`;

    const contents = `Tolong rancang prompt visual ultra-clean edukatif untuk media pembelajaran mata pelajaran "${subject}", materi "${topic}".
Daftar halaman:
${pageListStr}

Pastikan teks cleanPrompt sangat rapi, mengikuti routing jenis slide (terutama Peta Konsep sebagai diagram hierarki, bukan jalur kuis!), mengutamakan whitespace, kartu modular bersih, dan bebas dari dekorasi berlebih (no clutter, no confetti).
Harap kembalikan dalam struktur JSON Array valid.`;

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
              cleanPrompt: { type: Type.STRING, description: "Prompt visual lengkap beserta bagian EXACT TEXT TO DISPLAY siap pakai untuk Canva AI / Midjourney / DALL-E" },
              midjourneyPrompt: { type: Type.STRING, description: "Prompt Midjourney lengkap dengan flag parameter" },
              illustrationDesc: { type: Type.STRING, description: "Panduan spesifikasi layout terstruktur bahasa Indonesia" },
              canvaKeywords: { type: Type.STRING, description: "Kata kunci pencarian aset di Canva" },
              slideContent: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 butir poin naskah materi/konten pembelajaran singkat (Bahasa Indonesia) yang akan dicantumkan di panel slide ini"
              },
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
            required: ["pageTitle", "headerText", "cleanPrompt", "illustrationDesc", "slideContent", "navigationButtons", "estimatedTime", "educationalObjective"]
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Gagal mendapatkan respon teks dari Gemini API.');
    }

    const parsedPrompts = JSON.parse(textOutput.trim());
    const sanitizedPrompts = parsedPrompts.map((p: any, idx: number) => {
      const pageTitle = pages[idx] || p.pageTitle || "Materi Pembelajaran";
      const blueprint = buildSlideIdentity(pageTitle, idx, pages.length, {
        subject,
        topic,
        ageGroup,
        learningObjective,
        pages,
        layout,
        visualStyle,
        detailLevel,
        mascot
      });

      const cleanHeader = sanitizeHeaderText(p.headerText) || blueprint.headerText;
      const contentList = p.slideContent && Array.isArray(p.slideContent) && p.slideContent.length > 0 
        ? p.slideContent 
        : blueprint.slideContent;
      const navBtn = p.navigationButtons || blueprint.navigationButtons;
      const estTime = p.estimatedTime || blueprint.estimatedTime;
      const qData = p.quizData || blueprint.quizData;

      const unifiedCleanPrompt = compileAuthoritativeSlidePrompt({
        slideType: blueprint.slideType,
        headerText: cleanHeader,
        topic,
        subject,
        ageGroup,
        layout,
        visualStyle,
        styleClause: visualStyle,
        characterClause: blueprint.cleanPrompt,
        slideSpecificLayoutPrompt: blueprint.headerText,
        theme: getSubjectAdaptiveDetails(subject, topic),
        slideContent: contentList,
        visibleTexts: blueprint.visibleTexts,
        navigationButtons: navBtn,
        estimatedTime: estTime,
        quizData: qData,
        conceptMapData: blueprint.conceptMapData,
        guidePoints: blueprint.guidePoints
      });

      return {
        ...blueprint,
        ...p,
        headerText: cleanHeader,
        cleanPrompt: unifiedCleanPrompt,
        midjourneyPrompt: `${unifiedCleanPrompt} --ar ${layout === 'portrait' ? '9:16' : '16:9'} --v 6.0 --style raw`,
        illustrationDesc: sanitizeHeaderText(p.illustrationDesc || blueprint.illustrationDesc),
        slideContent: contentList,
        navigationButtons: navBtn,
        estimatedTime: estTime,
        quizData: qData,
        conceptMapData: blueprint.conceptMapData,
        guidePoints: blueprint.guidePoints
      };
    });
    return res.json({ prompts: sanitizedPrompts, usedModel: usedModel });

  } catch (err: any) {
    console.warn('Gemini call fell back to server clean generator:', err?.message || err);
    // Provide seamless fallback so users never see broken errors
    const fallbackPrompts = generateServerFallbackPrompts(req.body);
    return res.json({ 
      prompts: fallbackPrompts, 
      usedModel: 'edusmart-clean-engine',
      isLocalFallback: true,
      notice: `Prompt dibuat dengan Mesin EduSmart Clean (${err.message || 'Mode Mandiri'}).` 
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
    const systemInstruction = `Anda adalah seorang Ahli Kurikulum Pendidikan dan Pengembang Media Pembelajaran Interaktif EduSmart Creator Lab.
Tugas Anda adalah menganalisis dokumen/naskah materi pembelajaran yang diunggah oleh guru (nama file: "${fileName || 'materi.pdf'}").

ATURAN UTAMA:
1. JUDUL/TOPIK: Ekstrak JUDUL PERSIS yang tertulis pada dokumen naskah (judul utama, bab, atau topik pembelajaran di baris-baris pertama dokumen). Jangan mengarang judul yang melenceng dari apa yang tertulis di dalam file!
2. TARGET USIA: Tentukan target usia yang paling cocok: 'PAUD (3-5 tahun)', 'SD Kelas Rendah (6-8 tahun)', 'SD Kelas Tinggi (9-11 tahun)', 'SMP (12-14 tahun)', atau 'SMA/Umum (15+ tahun)'.
3. STRUKTUR STANDAR 14 HALAMAN INTERAKTIF (WAJIB):
   Susun alur slide standar EduSmart Creator Lab dengan menyesuaikan sub-topik dan 4 pertanyaan kuis dengan isi naskah dokumen:
   1. Cover
   2. Navigasi (Petunjuk, Apersepsi, Peta Konsep, Materi, Video, Kuis)
   3. Petunjuk
   4. Apersepsi
   5. Peta Konsep
   6. Materi Inti
   7. Video Pembelajaran
   8. Kuis 1: [Pertanyaan pilihan ganda 1 berdasarkan isi dokumen]
   9. Kuis 2: [Pertanyaan pilihan ganda 2 berdasarkan isi dokumen]
   10. Kuis 3: [Pertanyaan pilihan ganda 3 berdasarkan isi dokumen]
   11. Kuis 4: [Pertanyaan pilihan ganda 4 berdasarkan isi dokumen]
   12. Respon Benar
   13. Respon Salah
   14. Rangkuman & Penutup
4. RANGKUMAN: Buat ringkasan ramah guru 2-3 kalimat yang membuktikan bahwa materi dokumen benar-benar dibaca dan dipahami secara akurat.

Hasilkan JSON dengan format:
{
  "extractedTopic": "Judul persis dari isi dokumen (maksimal 6-8 kata)",
  "recommendedAgeGroup": "Kategori usia",
  "suggestedPages": [
    "1. Cover",
    "2. Navigasi (Petunjuk, Apersepsi, Peta Konsep, Materi, Video, Kuis)",
    "3. Petunjuk",
    "4. Apersepsi",
    "5. Peta Konsep",
    "6. Materi Inti",
    "7. Video Pembelajaran",
    "8. Kuis 1: ...",
    "9. Kuis 2: ...",
    "10. Kuis 3: ...",
    "11. Kuis 4: ...",
    "12. Respon Benar",
    "13. Respon Salah",
    "14. Rangkuman & Penutup"
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
    if (parsedResult.extractedTopic) {
      parsedResult.extractedTopic = sanitizeHeaderText(parsedResult.extractedTopic);
    }
    if (parsedResult.suggestedPages && Array.isArray(parsedResult.suggestedPages)) {
      parsedResult.suggestedPages = parsedResult.suggestedPages.map((p: string) => sanitizeHeaderText(p));
    }
    return res.json(parsedResult);

  } catch (err: any) {
    console.error('Error analyzing material:', err);
    return res.status(500).json({ error: err.message || 'Gagal menganalisis dokumen materi.' });
  }
});

// Explicit 404 for any unhandled /api/* routes so they never return HTML
app.all('/api/*', (req, res) => {
  res.status(404).json({
    error: `Endpoint API "${req.method} ${req.path}" tidak ditemukan pada server.`
  });
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
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
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
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Endpoint API tidak ditemukan.' });
    }
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server EduSmart Lab berjalan di http://localhost:${PORT}`);
});
