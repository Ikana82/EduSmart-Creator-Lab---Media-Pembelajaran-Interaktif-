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

// Server-side fallback prompt generator strictly following Master Prompt rules
function generateServerFallbackPrompts(payload: any) {
  const { subject = 'IPAS / Sains', topic, ageGroup, pages, layout, visualStyle = 'Clean 2D Vector / Flat Cartoon', detailLevel = 'clean-minimalis', mascot } = payload;
  const theme = getAdaptiveSubjectTheme(subject, topic);
  const aspect = layout === 'portrait' ? '9:16 vertical portrait' : '16:9 landscape';

  let characterClause = "Left side features a friendly, smiling tutor character gesturing politely towards the content";
  if (mascot?.type === 'none') {
    characterClause = "Minimalist presentation slide UI focused purely on core diagrams and lesson content without mascot characters";
  } else if (mascot?.type === 'custom' && mascot?.imageName) {
    characterClause = `Left side features a friendly tutor character inspired by the reference photo ("${mascot.imageName}", ${mascot?.description || 'tutor companion'}), smiling and gesturing towards the slide content without obstructing text`;
  } else if (mascot?.description) {
    characterClause = `Left side features a friendly educational companion (${mascot.description}) smiling politely and gesturing towards the lesson content`;
  }

  const detailClause = "Ultra-clean minimalist composition, generous negative space (ample whitespace), zero visual clutter, neat rounded white card container with subtle soft drop shadow, high text contrast, no floating confetti or glitter particles, content-first layout";

  return pages.map((pageTitle: string, index: number) => {
    const titleLower = pageTitle.toLowerCase();
    let headerText = pageTitle;
    let slideSpecific = "";
    let quizData: any = undefined;

    if (titleLower.includes('cover') || titleLower.includes('sampul')) {
      headerText = topic || "Media Pembelajaran Interaktif";
      slideSpecific = `Center displays a clean, prominent title banner reading "${topic}" with subtitle "${subject} - ${ageGroup}". Background features ${theme.bg}. Bottom center has a clean, tactile rounded action button "MULAI BELAJAR". Content-first layout with balanced margins.`;
    } else if (titleLower.includes('navigasi') || titleLower.includes('menu')) {
      headerText = "Pilih Menu Belajar";
      slideSpecific = `Main menu navigation board. Displays six neat, modular white rounded card buttons organized in a balanced grid layout with clean matching icons: "1. Tujuan Pembelajaran" (icon: target), "2. Apersepsi" (icon: lightbulb), "3. Peta Pembelajaran" (icon: map), "4. Materi Inti" (icon: book), "5. Video Pembelajaran" (icon: play), and "6. Kuis Interaktif" (icon: game controller). Outstanding spacious layout, high contrast readability, clean typography. Highlighting 'Menu Navigasi' as the current active step in this lesson journey. Background features ${theme.bg}.`;
    } else if (titleLower.includes('tujuan') || titleLower.includes('indikator')) {
      headerText = "Tujuan Pembelajaran";
      slideSpecific = `Right side features a large clean white rounded card container with 3 neatly organized checklist items explaining learning goals for "${topic}". Ample negative space, high contrast typography. Background features ${theme.bg}.`;
    } else if (titleLower.includes('apersepsi') || titleLower.includes('pengantar') || titleLower.includes('motivasi')) {
      headerText = "Tahukah Kamu? Mari Mengamati";
      slideSpecific = `Center displays a clean educational focal visual representing "${topic}" on a neat pedestal. Tutor character points thoughtfully with an encouraging expression. Background features ${theme.bg}.`;
    } else if (titleLower.includes('peta') || titleLower.includes('perjalanan') || titleLower.includes('titik kuis')) {
      headerText = "Peta Petualangan 4 Titik Kuis";
      slideSpecific = `Features a neat, minimalist progress trail connecting 4 clean numbered checkpoint badges (1, 2, 3, 4) across the screen. Clutter-free design with clear visual hierarchy. Background features ${theme.bg}.`;
    } else if (titleLower.includes('kuis 1') || titleLower.includes('penyerbukan') || index === 5) {
      headerText = `Kuis 1: Konsep Dasar ${topic}`;
      quizData = {
        question: `Pertanyaan pemahaman konsep inti pertama mengenai materi ${topic}?`,
        options: ["A. Opsi konsep yang tepat dan logis", "B. Opsi pengecoh pertama", "C. Opsi pengecoh kedua", "D. Opsi pengecoh ketiga"],
        correctAnswer: "A",
        explanation: `Pemahaman mendasar materi ${topic} sangat penting sebagai fondasi kognitif siswa.`
      };
      slideSpecific = `Right side features a large clean white rounded card container displaying the question clearly and 4 neat horizontal option cards with circular letter badges (A, B, C, D). Left side features ${characterClause}. Background features ${theme.bg}.`;
    } else if (titleLower.includes('kuis 2') || index === 6) {
      headerText = `Kuis 2: Karakteristik & Ciri Khusus`;
      quizData = {
        question: `Manakah karakteristik yang paling sesuai dengan prinsip ${topic}?`,
        options: ["A. Karakteristik umum", "B. Karakteristik spesifik dan tepat", "C. Karakteristik acak", "D. Karakteristik tidak relevan"],
        correctAnswer: "B",
        explanation: `Karakteristik spesifik menjelaskan fenomena atau aturan dalam topik ini dengan tepat.`
      };
      slideSpecific = `Right side features a large clean white rounded card container with question header and 4 clean horizontal option pills with letter badges (A, B, C, D). Left side features ${characterClause}. Background features ${theme.bg}.`;
    } else if (titleLower.includes('kuis 3') || index === 7) {
      headerText = `Kuis 3: Analisis & Penerapan`;
      quizData = {
        question: `Bagaimana penerapan konsep ${topic} dalam kehidupan sehari-hari?`,
        options: ["A. Penerapan relevan dan benar", "B. Penerapan yang kurang tepat", "C. Tidak ada kaitan", "D. Hanya teori"],
        correctAnswer: "A",
        explanation: `Penerapan konsep membantu siswa menghubungkan materi kelas dengan realitas dunia nyata.`
      };
      slideSpecific = `Right side features a large clean white rounded card container with question and 4 neat multiple-choice cards (A, B, C, D). Clean grid layout, high legibility. Background features ${theme.bg}.`;
    } else if (titleLower.includes('kuis 4') || index === 8) {
      headerText = `Kuis 4: Evaluasi & Kesimpulan`;
      quizData = {
        question: `Apa kesimpulan utama yang dapat ditarik dari topik ${topic}?`,
        options: ["A. Kesimpulan parsial", "B. Kesimpulan komprehensif yang tepat", "C. Hipotesis yang belum terbukti", "D. Fakta di luar topik"],
        correctAnswer: "B",
        explanation: `Evaluasi menyeluruh memantapkan pemahaman siswa terhadap keseluruhan topik.`
      };
      slideSpecific = `Right side features a large clean white rounded card container with question and 4 tidy option cards with circular badges (A, B, C, D). Background features ${theme.bg}.`;
    } else if (titleLower.includes('respon benar') || titleLower.includes('benar')) {
      headerText = "Luar Biasa! Jawabanmu Benar Sekali ⭐⭐⭐";
      slideSpecific = `Center displays three clean golden achievement stars and a tidy green success badge "JAWABAN TEPAT!". Tutor character gives a cheerful thumbs up. Bottom features a tactile rounded button "Lanjut ke Soal Berikutnya". No messy confetti, clean uncluttered layout. Background features ${theme.bg}.`;
    } else if (titleLower.includes('respon salah') || titleLower.includes('salah')) {
      headerText = "Hampir Tepat! Yuk Pikirkan Lagi 💡";
      slideSpecific = `Tutor character with a warm encouraging smile holding a clean glowing lightbulb motif, with a friendly clean speech bubble "Ayo Coba Lagi, Kamu Pasti Bisa!". Clean white rounded card offering buttons "Lihat Petunjuk" dan "Ulangi Soal". Background features ${theme.bg}.`;
    } else if (titleLower.includes('rangkuman') || titleLower.includes('summary')) {
      headerText = "Rangkuman / Intisari Materi";
      slideSpecific = `Center displays a large clean white rounded board container organized into 3-4 structured modular cards highlighting core takeaways of "${topic}". Clean typography, clear visual hierarchy. Background features ${theme.bg}.`;
    } else if (titleLower.includes('penutup') || titleLower.includes('selesai')) {
      headerText = "Selamat! Misi Belajar Selesai 🎓";
      slideSpecific = `Center displays a cheerful, elegant congratulations card celebrating completion of "${topic}". Tutor waving politely next to a neat diploma badge. Prominent clean rounded action button "SELESAI & ULANGI". Background features ${theme.bg}.`;
    } else {
      slideSpecific = `Right side features a large clean white rounded card container with generous whitespace displaying key concepts of "${pageTitle}". Left side has ${characterClause}. Background features ${theme.bg}.`;
    }

    // Determine active progress tracker label based on slide type (navigasi lokasi)
    let trackerLabel = "Materi";
    if (titleLower.includes('cover') || titleLower.includes('sampul')) trackerLabel = "Cover";
    else if (titleLower.includes('navigasi') || titleLower.includes('menu')) trackerLabel = "Menu";
    else if (titleLower.includes('kuis') || titleLower.includes('benar') || titleLower.includes('salah')) trackerLabel = "Kuis";
    else if (titleLower.includes('penutup') || titleLower.includes('selesai') || titleLower.includes('rangkuman')) trackerLabel = "Selesai";

    const progressTrackerClause = `Top edge of the slide features a subtle, minimalist progress bar breadcrumb tracker: [Cover ➔ Navigasi ➔ Materi ➔ Kuis ➔ Selesai], with the active section "${trackerLabel}" beautifully highlighted in a clean colored rounded badge pill`;

    const cleanPrompt = `Clean educational presentation slide UI, ${aspect} aspect ratio. Style: ${visualStyle}. ${progressTrackerClause}. ${characterClause}. ${slideSpecific}. ${detailClause}. Soft ambient studio lighting, sharp focus, 8k resolution, UI/UX educational presentation mockup.`;
    const midjourneyPrompt = `${cleanPrompt} --ar ${layout === 'portrait' ? '9:16' : '16:9'} --v 6.0 --style raw`;

    const structuredSpec = `📐 Layout: ${layout === 'portrait' ? '9:16 Portrait (1080x1920 px)' : '16:9 Landscape (1920x1080 px)'}
📚 Mata Pelajaran: ${subject} | Materi: "${topic}"
✨ Tingkat Detail: ${detailLevel} (Clean, Minimal, Anti-Clutter)
🎨 Gaya Visual: ${visualStyle}
🌿 Latar Belakang: ${theme.bg}
🧑‍🎓 Karakter: ${characterClause}
📄 Kartu Konten: Kontainer kartu putih rounded bersih dengan drop shadow lembut dan whitespace lega (Content-First Design).
🔘 Tombol: Tombol taktil rounded kontras di bagian bawah slide.
🎨 Palet Warna: ${theme.palette}
🔍 Kata Kunci Canva: ${theme.canvaKeywords}`;

    return {
      pageTitle: `Halaman ${index + 1}: ${pageTitle}`,
      headerText: headerText,
      cleanPrompt: cleanPrompt,
      midjourneyPrompt: midjourneyPrompt,
      illustrationDesc: structuredSpec,
      canvaKeywords: theme.canvaKeywords,
      navigationButtons: index === 0 ? "MULAI BELAJAR!" : index === pages.length - 1 ? "SELESAI & ULANGI" : "LANJUT",
      estimatedTime: "1-2 Menit",
      educationalObjective: `Menyajikan konten esensial untuk sub-materi "${pageTitle}" dengan visual clean dan keterbacaan tinggi.`,
      quizData: quizData
    };
  });
}

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
    const pageListStr = pages.map((p: string, i: number) => `Halaman ${i + 1}: ${p}`).join('\n');
    const mascotText = mascot?.type === 'none' 
      ? 'Tanpa Maskot (Fokus murni diagram edukatif bersih)' 
      : mascot?.type === 'custom' && mascot?.imageName
        ? `Karakter Kustom Berdasarkan Foto Unggahan Guru ("${mascot.imageName}"). Deskripsi: ${mascot.description || 'Karakter pendamping tutor ramah yang konsisten dengan foto referensi'}. Pastikan konsistensi ciri visual karakter di setiap slide tanpa menutupi kartu materi.`
        : `Jenis Maskot: ${mascot?.type || 'tutor'}. Deskripsi: ${mascot?.description || 'Karakter pendamping edukatif yang ramah dan sopan'}.`;

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
   - Dekorasi seminimal mungkin! DILARANG confetti, daun beterbangan, bunga berulang, taburan bintang, kilauan liar (glitter sparkles), garis gerak komik, atau ornamen melayang tanpa makna.
   - Maksimal 3 ornamen kecil fungsional per slide.
4. Komposisi & Card Container:
   - Panel kartu konten utama: kontainer kartu putih rounded bersih (clean white rounded modular card container, subtle soft shadow, ample whitespace).
   - Penempatan karakter: di sisi tepi/kiri, berpose ramah menyapa atau menunjuk materi, TIDAK MENUTUPI materi atau kartu konten.
   - Tombol: tombol aksi taktil rounded dengan kontras jelas di bagian bawah.
5. Progress Tracker & Navigasi Lokasi (Breadcrumbs):
   - Setiap slide wajib mencantumkan indikator lokasi visual di bagian atas berupa breadcrumb tipis: "[Cover ➔ Navigasi ➔ Materi ➔ Kuis ➔ Selesai]" dengan bagian yang sedang aktif disorot dengan badge kontras, menandakan dengan jelas navigasi saat ini sedang berada di bagian mana.

OUTPUT FORMAT UNTUK SETIAP SLIDE:
1. cleanPrompt: Prompt bahasa Inggris murni yang mengalir alami, siap paste langsung ke Midjourney v6, Canva Magic Media, Imagen 3, atau DALL-E 3.
   - DILARANG mencantumkan label administratif seperti "Style:", "Layout:", "Background:", "Header Text:".
   - Wajib menyertakan aspek rasio: ${layout === 'portrait' ? '9:16 portrait ratio' : '16:9 landscape ratio'}.
2. midjourneyPrompt: cleanPrompt + " --ar ${layout === 'portrait' ? '9:16' : '16:9'} --v 6.0 --style raw"
3. illustrationDesc: Panduan spesifikasi tata letak manual bahasa Indonesia (Layout, Latar, Kartu Konten, Karakter, Tombol, Palet Warna).
4. canvaKeywords: 3-5 kata kunci pencarian aset Canva bahasa Inggris relevan.
5. navigationButtons, estimatedTime, educationalObjective, dan quizData (jika halaman kuis).`;

    const contents = `Tolong rancang prompt visual ultra-clean edukatif untuk media pembelajaran mata pelajaran "${subject}", materi "${topic}".
Daftar halaman:
${pageListStr}

Pastikan teks cleanPrompt sangat rapi, mengutamakan whitespace, kartu modular bersih, dan bebas dari dekorasi berlebih (no clutter, no confetti).
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
