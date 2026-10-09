import { SlideType, detectSlideType, ConceptMapData, QuizQuestionData, SlideIdentity } from '../types/slideTypes';

export interface PromptEngineOptions {
  subject: string;
  topic: string;
  ageGroup: string;
  learningObjective?: string;
  pages: string[];
  layout: 'landscape' | 'portrait';
  visualStyle: string;
  detailLevel: string;
  language?: string;
  mascot?: {
    type: string;
    description?: string;
    imageName?: string | null;
  };
}

export function getSubjectAdaptiveDetails(subject: string = '', topic: string = '') {
  const text = `${subject} ${topic}`.toLowerCase();
  
  if (text.includes('matematika') || text.includes('math') || text.includes('hitung') || text.includes('aljabar') || text.includes('geometri') || text.includes('pecahan')) {
    return {
      bg: "clean minimalist backdrop with subtle pale geometric grid lines and soft neutral slate tint",
      palette: "slate navy, soft cobalt blue, and clean white with subtle warm amber accents",
      canvaKeywords: "math education, clean geometry, minimalist mathematics, vector math icons",
      subjectBadge: "📐 Matematika",
      topicKeyLabel: "Konsep & Prinsip Berhitung"
    };
  }
  if (text.includes('bahasa') || text.includes('literasi') || text.includes('indonesia') || text.includes('english') || text.includes('inggris') || text.includes('puisi') || text.includes('cerita')) {
    return {
      bg: "clean contemporary educational backdrop with soft beige-to-cream subtle gradient and warm study nook aesthetic",
      palette: "warm terracotta, soft ivory, navy, and muted sage green",
      canvaKeywords: "reading literacy, clean book illustration, language education, minimalist classroom",
      subjectBadge: "📖 Bahasa & Literasi",
      topicKeyLabel: "Literasi Teks & Analisis Karakter"
    };
  }
  if (text.includes('ips') || text.includes('sejarah') || text.includes('geografi') || text.includes('sosial') || text.includes('budaya')) {
    return {
      bg: "clean minimalist backdrop with subtle pale topographic map lines and warm neutral tones",
      palette: "warm sand, olive, deep indigo, and burnt orange",
      canvaKeywords: "social studies, clean geography map, history infographic, cultural heritage",
      subjectBadge: "🗺️ IPS & Budaya",
      topicKeyLabel: "Fakta Sosial & Geografis"
    };
  }
  if (text.includes('pai') || text.includes('agama') || text.includes('moral') || text.includes('akhlak')) {
    return {
      bg: "serene peaceful backdrop with soft subtle mint-teal gradient and clean architectural arch lines",
      palette: "emerald green, warm gold, clean white, and soft teal",
      canvaKeywords: "islamic education, serene clean background, moral values, peaceful classroom",
      subjectBadge: "🕌 PAI & Budi Pekerti",
      topicKeyLabel: "Nilai Akhlak & Keteladanan"
    };
  }
  if (text.includes('informatika') || text.includes('komputer') || text.includes('coding') || text.includes('tik') || text.includes('teknologi')) {
    return {
      bg: "clean modern tech backdrop with subtle pale cyan gradient and minimalist circuit node lines",
      palette: "clean slate, electric cyan, white, and deep charcoal",
      canvaKeywords: "computer science, coding education, tech UI, clean infographic",
      subjectBadge: "💻 Informatika & TIK",
      topicKeyLabel: "Komputasi & Logika Sistem"
    };
  }
  if (text.includes('paud') || text.includes('tk') || text.includes('balita')) {
    return {
      bg: "clean cheerful soft pastel gradient with very simple rounded cloud shapes and ample negative space",
      palette: "soft butter yellow, sky blue, peach, and crisp white",
      canvaKeywords: "preschool education, cute simple shapes, kindergarten pastel, clean learning",
      subjectBadge: "🎒 TK / PAUD",
      topicKeyLabel: "Eksplorasi Konkret & Sensorik"
    };
  }
  
  // Default IPAS / Science
  return {
    bg: `clean minimalist background with soft gentle gradient and subtle contextual atmospheric cues tailored to "${topic}"`,
    palette: "forest green, pastel sky blue, sunny gold, and crisp white",
    canvaKeywords: `${topic.toLowerCase()}, science education, clean vector illustration, presentation slide`,
    subjectBadge: "🔬 IPAS / Sains",
    topicKeyLabel: "Fenomena Alam & Analisis Ilmiah"
  };
}

/**
 * Generate Concept Map structured data specifically tailored to the topic
 */
export function buildTopicConceptMapData(topic: string, subject: string): ConceptMapData {
  const tLower = `${topic} ${subject}`.toLowerCase();
  
  if (tLower.includes('ekosistem') || tLower.includes('rantai makanan')) {
    return {
      centralConcept: topic,
      subConcepts: [
        { title: "Produsen", desc: "Tumbuhan hijau penghasil energi mandiri via fotosintesis" },
        { title: "Konsumen", desc: "Herbivora, karnivora, & omnivora dalam tingkatan trofik" },
        { title: "Pengurai (Dekomposer)", desc: "Bakteri & jamur pengurai sisa organik ke tanah" },
        { title: "Faktor Abiotik", desc: "Sinar matahari, air, tanah, dan suhu penopang hidup" }
      ],
      connectingRelationships: [
        "Produsen memberi energi ke Konsumen",
        "Konsumen diuraikan oleh Dekomposer",
        "Abiotik menopang seluruh daur kehidupan"
      ]
    };
  }

  if (tLower.includes('pecahan') || tLower.includes('matematika')) {
    return {
      centralConcept: topic,
      subConcepts: [
        { title: "Pembilang", desc: "Angka bagian atas yang menunjukkan jumlah bagian terambil" },
        { title: "Penyebut", desc: "Angka bagian bawah pembagi total bagian keseluruhan" },
        { title: "Pecahan Senilai", desc: "Pecahan dengan nilai perbandingan yang sama besar" },
        { title: "Visualisasi Riil", desc: "Representasi gambar potongan kue atau balok geometri" }
      ],
      connectingRelationships: [
        "Pembilang & Penyebut membentuk nilai pecahan",
        "Perkalian/pembagian menghasilkan Pecahan Senilai",
        "Visualisasi mempermudah representasi konkret"
      ]
    };
  }

  if (tLower.includes('tata surya') || tLower.includes('planet')) {
    return {
      centralConcept: topic,
      subConcepts: [
        { title: "Matahari", desc: "Bintang pusat tata surya sebagai sumber energi utama" },
        { title: "Planet Dalam", desc: "Merkurius, Venus, Bumi, dan Mars berbatu padat" },
        { title: "Planet Luar", desc: "Yupiter, Saturnus, Uranus, & Neptunus raksasa gas" },
        { title: "Benda Langit Lain", desc: "Asteroid, komet, meteoroid, dan satelit alami" }
      ],
      connectingRelationships: [
        "Semua planet mengorbit Matahari secara teratur",
        "Sabuk asteroid memisahkan planet dalam & luar",
        "Gravitasi menjaga keharmonisan orbit"
      ]
    };
  }

  if (tLower.includes('fabel') || tLower.includes('cerita') || tLower.includes('bahasa')) {
    return {
      centralConcept: topic,
      subConcepts: [
        { title: "Tokoh Hewan", desc: "Karakter hewan yang bertingkah laku seperti manusia" },
        { title: "Alur Cerita", desc: "Rangkaian peristiwa dari pengenalan hingga penyelesaian" },
        { title: "Latar & Suasana", desc: "Tempat, waktu, dan suasana terjadinya cerita di hutan/alam" },
        { title: "Amanat Moral", desc: "Pesan kebaikan dan budi pekerti yang dapat dipetik" }
      ],
      connectingRelationships: [
        "Tokoh menggerakkan alur peristiwa",
        "Alur bermuara pada pesan amanat moral",
        "Latar membangun suasana cerita fabel"
      ]
    };
  }

  // General fallback for any topic
  return {
    centralConcept: topic,
    subConcepts: [
      { title: "Fondasi Konsep", desc: `Prinsip dasar dan pengertian inti dari materi ${topic}` },
      { title: "Komponen Utama", desc: `Unsur-unsur pembentuk dan karakteristik penting ${topic}` },
      { title: "Penerapan Riil", desc: `Contoh konkret implementasi dalam kehidupan nyata` },
      { title: "Evaluasi Konsep", desc: `Pemahaman dan keterhubungan antar bagian materi` }
    ],
    connectingRelationships: [
      `Fondasi menghubungkan seluruh cabang ${topic}`,
      `Komponen saling berinteraksi secara sistematis`,
      `Penerapan memvalidasi pemahaman konsep`
    ]
  };
}

/**
 * Generate topic-specific quiz questions
 */
export function buildTopicQuizData(topic: string, subject: string, qIndex: number): QuizQuestionData {
  const tLower = `${topic} ${subject}`.toLowerCase();

  if (tLower.includes('matematika') || tLower.includes('pecahan')) {
    const qList: QuizQuestionData[] = [
      {
        question: "Jika sebuah pizza dipotong menjadi 4 bagian sama besar dan dimakan 1 bagian, berapa sisa pecahannya?",
        options: ["A. 3/4 bagian", "B. 1/4 bagian", "C. 2/4 bagian", "D. 4/4 bagian"],
        correctAnswer: "A",
        explanation: "Sisa pizza adalah 4 bagian utuh dikurangi 1 bagian yang dimakan, yaitu 3 dari 4 bagian (3/4)."
      },
      {
        question: "Bangun datar yang memiliki 4 sisi sama panjang dan 4 sudut siku-siku (90 derajat) adalah?",
        options: ["A. Persegi panjang", "B. Persegi (Bujur sangkar)", "C. Segitiga sama sisi", "D. Trapesium"],
        correctAnswer: "B",
        explanation: "Persegi memiliki keempat sisi yang berukuran sama panjang dan keempat sudutnya siku-siku."
      },
      {
        question: "Pecahan 2/4 memiliki nilai yang sama besar (senilai) dengan pecahan?",
        options: ["A. 1/2", "B. 1/3", "C. 3/4", "D. 2/3"],
        correctAnswer: "A",
        explanation: "Jika pembilang dan penyebut 2/4 masing-masing dibagi 2, maka hasilnya adalah pecahan senilai 1/2."
      },
      {
        question: "Benda di dalam ruang kelas berikut yang permukaannya berbentuk lingkaran adalah?",
        options: ["A. Jam dinding bundar", "B. Papan tulis", "C. Buku tulis", "D. Penggaris lurus"],
        correctAnswer: "A",
        explanation: "Permukaan jam dinding bundar membentuk bangun lingkaran sempurna."
      }
    ];
    return qList[qIndex % qList.length];
  }

  if (tLower.includes('bahasa') || tLower.includes('fabel') || tLower.includes('literasi')) {
    const qList: QuizQuestionData[] = [
      {
        question: "Di mana letak ide pokok atau kalimat utama dalam sebuah paragraf deduktif?",
        options: ["A. Di awal paragraf", "B. Di akhir paragraf", "C. Di tengah paragraf", "D. Di luar teks bacaan"],
        correctAnswer: "A",
        explanation: "Paragraf deduktif adalah paragraf yang gagasan utama atau kalimat utamanya terletak di awal."
      },
      {
        question: "Tokoh yang memiliki sifat baik hati dan menjadi pusat simpati cerita disebut?",
        options: ["A. Antagonis", "B. Protagonis", "C. Figuran", "D. Tritagonis"],
        correctAnswer: "B",
        explanation: "Protagonis adalah tokoh utama yang umumnya berwatak positif, baik hati, dan membawa nilai moral."
      },
      {
        question: "Sinonim (persamaan makna kata) dari kata 'tekun' dalam belajar adalah?",
        options: ["A. Malas", "B. Rajin dan gigih", "C. Lambat", "D. Cepat lelah"],
        correctAnswer: "B",
        explanation: "Tekun memiliki makna bersungguh-sungguh, rajin, dan tidak mudah menyerah."
      },
      {
        question: "Pesan moral atau nasihat mendidik yang ingin disampaikan pengarang kepada pembaca disebut?",
        options: ["A. Alur", "B. Amanat", "C. Latar tempat", "D. Sudut pandang"],
        correctAnswer: "B",
        explanation: "Amanat adalah nilai kebaikan atau pesan moral yang dapat dipetik pembaca dari isi cerita."
      }
    ];
    return qList[qIndex % qList.length];
  }

  // Default Science / Biology / Nature
  const defaultList: QuizQuestionData[] = [
    {
      question: "Siapa yang membantu penyerbukan bunga saat mencari nektar manis?",
      options: ["A. Lebah dan kupu-kupu", "B. Ikan di sungai", "C. Cacing di tanah", "D. Katak di kolam"],
      correctAnswer: "A",
      explanation: "Lebah dan kupu-kupu hinggap pada bunga untuk menghisap nektar dan memindahkan serbuk sari."
    },
    {
      question: `Di mana habitat alami tempat organisme dalam materi "${topic}" berkembang biak?`,
      options: ["A. Di habitat ekologis yang sesuai", "B. Di tempat buatan tertutup", "C. Di tempat tanpa nutrisi", "D. Di ruang hampa udara"],
      correctAnswer: "A",
      explanation: "Setiap organisme memiliki habitat alami yang mendukung rantai kehidupannya."
    },
    {
      question: "Dalam rantai makanan ekosistem, siapakah yang berperan sebagai konsumen tingkat pertama (primer)?",
      options: ["A. Herbivora (pemakan tumbuhan)", "B. Karnivora puncak (predator)", "C. Dekomposer pengurai", "D. Tumbuhan produsen"],
      correctAnswer: "A",
      explanation: "Konsumen primer adalah hewan herbivora yang memakan produsen langsung."
    },
    {
      question: `Apakah faktor cahaya matahari, air, dan suhu termasuk komponen abiotik dalam materi "${topic}"?`,
      options: ["A. Benar, itu komponen abiotik", "B. Salah, itu komponen biotik", "C. Hanya air yang abiotik", "D. Tidak memiliki pengaruh"],
      correctAnswer: "A",
      explanation: "Komponen abiotik adalah faktor lingkungan fisik tak hidup yang menopang kehidupan."
    }
  ];
  return defaultList[qIndex % defaultList.length];
}

/**
 * Build deterministic, perfectly synchronized SlideIdentity for any slide
 */
export function buildSlideIdentity(
  pageTitle: string,
  index: number,
  totalSlides: number,
  options: PromptEngineOptions
): SlideIdentity {
  const { subject, topic, ageGroup, layout, visualStyle, detailLevel, mascot } = options;
  const slideType = detectSlideType(pageTitle, index, totalSlides);
  const theme = getSubjectAdaptiveDetails(subject, topic);
  const aspect = layout === 'portrait' ? '9:16 vertical portrait' : '16:9 landscape';
  const slideId = `slide-${index + 1}-${slideType}`;

  // Mascot clause formulation
  let characterClause = "Left side features a friendly, smiling tutor character gesturing politely towards the content without covering text";
  if (mascot?.type === 'none') {
    characterClause = "Minimalist presentation slide UI focused purely on core diagrams and lesson content without mascot characters";
  } else if (mascot?.type === 'custom' && mascot?.imageName) {
    characterClause = `Left side features a friendly tutor character inspired by reference photo ("${mascot.imageName}", ${mascot?.description || 'tutor companion'}), smiling and gesturing towards content without covering text`;
  } else if (mascot?.description) {
    characterClause = `Left side features a friendly educational companion (${mascot.description}) smiling politely and gesturing towards content`;
  }

  // Style clause
  let styleClause = "flat 2D vector educational illustration style, clean solid colors, crisp outlines, modern minimalist aesthetic";
  if (visualStyle.includes("3D Pixar") || visualStyle.includes("3D Glossy") || visualStyle.includes("3D Clay")) {
    styleClause = "clean modern 3D cartoon illustration style, gentle soft ambient studio lighting, smooth volumes, subtle minimal drop shadows, polished aesthetic without excessive gloss";
  } else if (visualStyle.includes("Kawaii") || visualStyle.includes("Chibi")) {
    styleClause = "kawaii pastel chibi illustration style, cute friendly proportions, soft harmonic pastel colors, clean outlines";
  } else if (visualStyle.includes("Anime") || visualStyle.includes("Ghibli")) {
    styleClause = "Japanese anime studio Ghibli aesthetic, gentle hand-painted scenery tones, soft daylight, tidy composition";
  } else if (visualStyle.includes("Watercolor")) {
    styleClause = "soft watercolor storybook aesthetic, gentle artistic wash, calming pastel palette, clean white negative space";
  } else if (visualStyle.includes("Doodle") || visualStyle.includes("Hand-Drawn")) {
    styleClause = "clean minimalist hand-drawn doodle style, neat sketch accents, friendly educational lines";
  }

  let headerText = pageTitle.replace(/^\d+[\s.]*-?\s*/, "").trim();
  let educationalObjective = `Menyajikan konten esensial untuk sub-materi "${pageTitle}".`;
  let visibleTexts: string[] = [];
  let slideContent: string[] = [];
  let slideSpecificLayoutPrompt = "";
  let navigationButtons = "LANJUT";
  let estimatedTime = "1-2 Menit";
  let quizData: QuizQuestionData | undefined = undefined;
  let conceptMapData: ConceptMapData | undefined = undefined;
  let guidePoints: Array<{ icon: string; title: string; desc: string }> | undefined = undefined;
  let videoPlaceholderTopic: string | undefined = undefined;

  // ROUTE ACCORDING TO SLIDE TYPE
  switch (slideType) {
    case 'cover': {
      headerText = topic || "Media Pembelajaran Interaktif";
      educationalObjective = `Halaman pembuka menarik untuk memperkenalkan topik "${topic}" kepada siswa ${ageGroup}.`;
      visibleTexts = [
        "MEDIA PEMBELAJARAN INTERAKTIF",
        topic,
        `${subject} - ${ageGroup}`
      ];
      slideContent = [
        `Mata Pelajaran: ${subject}`,
        `Topik: ${topic}`,
        `Sasaran: ${ageGroup}`
      ];
      navigationButtons = "MULAI BELAJAR!";
      estimatedTime = "1 Menit";
      slideSpecificLayoutPrompt = `Opening cover slide. Left side features a friendly, smiling 3D robot tutor holding a book and pointing politely towards the large white information panel on the right. Right side features a very large, clean white information panel with high text contrast. Top of the panel displays blue label "MEDIA PEMBELAJARAN INTERAKTIF". Center of the panel displays main lesson title: "${topic}" in giant, bold, clear navy blue typography. Bottom of the panel displays "${subject} - ${ageGroup}". Background is soft light blue with clean ambient studio lighting and generous whitespace. NO menu lists, NO quiz questions, NO breadcrumb chains.`;
      break;
    }

    case 'navigation': {
      headerText = "Pilih Menu Belajar";
      educationalObjective = "Menyediakan navigasi 6 menu utama pembelajaran yang terstruktur dan mudah diakses.";
      visibleTexts = [
        "1. Petunjuk",
        "2. Apersepsi",
        "3. Peta Konsep",
        "4. Materi",
        "5. Video",
        "6. Kuis"
      ];
      slideContent = [
        "📋 Petunjuk: Panduan penggunaan media",
        "💡 Apersepsi: Pengantar & pemantik berpikir",
        "🗺️ Peta Konsep: Struktur diagram materi",
        "📖 Materi: Pembahasan materi inti",
        "🎬 Video: Tayangan animasi interaktif",
        "🎮 Kuis: Evaluasi pemahaman belajar"
      ];
      navigationButtons = "PILIH MENU";
      estimatedTime = "1 Menit";
      slideSpecificLayoutPrompt = `Main menu navigation board. Center displays exactly six neat, modular white rounded card buttons organized in a balanced 2-row by 3-column grid layout with clean matching icons: "1. Petunjuk" (guide icon), "2. Apersepsi" (idea bulb icon), "3. Peta Konsep" (concept map node icon), "4. Materi" (open book icon), "5. Video" (media player icon), and "6. Kuis" (gamepad icon). Left side features ${characterClause}. Background features ${theme.bg}. NO seventh menu, strictly 6 structured options.`;
      break;
    }

    case 'guide': {
      headerText = "Petunjuk Penggunaan Media";
      educationalObjective = "Memberikan petunjuk langkah belajar dan navigasi tombol agar siswa dapat belajar mandiri.";
      guidePoints = [
        { icon: "👆", title: "Navigasi Tombol", desc: "Gunakan tombol panah atau menu untuk berpindah halaman materi" },
        { icon: "🎧", title: "Media & Interaksi", desc: "Klik ikon audio/video untuk memutar penjelasan interaktif" },
        { icon: "📝", title: "Aktivitas & Kuis", desc: "Pilih jawaban kuis dan periksa pembahasan yang disediakan" }
      ];
      visibleTexts = [
        "1. Gunakan tombol panah untuk berpindah slide",
        "2. Tekan tombol interaktif untuk audio dan penjelasan",
        "3. Jawab pertanyaan kuis di akhir sesi materi"
      ];
      slideContent = guidePoints.map(g => `${g.icon} ${g.title}: ${g.desc}`);
      navigationButtons = "MENGERTI & LANJUT";
      estimatedTime = "2 Menit";
      slideSpecificLayoutPrompt = `Instruction and user guide slide. Right side features a clean white rounded card container showing a numbered 3-step usage guide with neat icon badges: "1. Navigasi Tombol", "2. Media & Interaksi", and "3. Aktivitas & Kuis". Ample padding, clear typography, no quiz questions on this page. Left side features ${characterClause}. Background features ${theme.bg}.`;
      break;
    }

    case 'apperception': {
      headerText = "Tahukah Kamu? Mari Mengamati";
      educationalObjective = `Membangkitkan rasa ingin tahu siswa melalui fenomena pengantar seputar "${topic}".`;
      visibleTexts = [
        "Mari amati fenomena sekitar kita!",
        `Bagaimana hal ini terjadi pada "${topic}"?`,
        "Yuk temukan jawabannya di materi berikut!"
      ];
      slideContent = [
        `Pernahkah kamu mengamati fenomena terkait ${topic}?`,
        `Mengapa hal tersebut terjadi di sekitar lingkungan kita?`,
        `Mari kita selidiki rahasia di balik materi ini bersama!`
      ];
      navigationButtons = "EKSPLORASI MATERI";
      estimatedTime = "2 Menit";
      slideSpecificLayoutPrompt = `Apperception and curiosity prompt slide. Right side features an engaging focal educational visual representing a real-world phenomenon of "${topic}" with clean question callouts "Tahukah Kamu?" and "Mari Mengamati". Left side features ${characterClause}. Background features ${theme.bg}. High contrast, friendly, sparking curiosity.`;
      break;
    }

    case 'concept_map': {
      headerText = `Peta Konsep: ${topic}`;
      educationalObjective = `Memvisualisasikan struktur hierarki dan relasi konsep utama "${topic}" secara terpadu.`;
      conceptMapData = buildTopicConceptMapData(topic, subject);
      visibleTexts = [
        `Konsep Utama: ${conceptMapData.centralConcept}`,
        ...conceptMapData.subConcepts.map(s => `• ${s.title}: ${s.desc}`),
        ...conceptMapData.connectingRelationships
      ];
      slideContent = conceptMapData.subConcepts.map(s => `${s.title}: ${s.desc}`);
      navigationButtons = "PELAJARI MATERI INTI";
      estimatedTime = "3 Menit";
      slideSpecificLayoutPrompt = `Concept map and mind map diagram slide. Center displays a clear hierarchical concept map diagram with a central primary node labeled "${conceptMapData.centralConcept}" connected via neat connecting lines to 4 distinct rounded concept sub-nodes: "${conceptMapData.subConcepts[0].title}", "${conceptMapData.subConcepts[1].title}", "${conceptMapData.subConcepts[2].title}", and "${conceptMapData.subConcepts[3].title}". NOT a checkpoint trail or game path, but a genuine educational concept map with semantic relationships. Left side features ${characterClause}. Background features ${theme.bg}.`;
      break;
    }

    case 'material': {
      headerText = `Materi Inti: ${topic}`;
      educationalObjective = `Menjelaskan konsep utama dan mekanisme penting dalam materi "${topic}".`;
      visibleTexts = [
        `Konsep 1: Pemahaman dasar tentang ${topic}`,
        `Konsep 2: Komponen dan fungsi penting`,
        `Konsep 3: Penerapan dan contoh dalam kehidupan nyata`
      ];
      slideContent = [
        `Definisi & prinsip utama ${topic} dalam mata pelajaran ${subject}`,
        `Karakteristik spesifik dan hubungan antar unsur materi`,
        `Fakta edukatif penting yang perlu dipahami siswa`
      ];
      navigationButtons = "LANJUT MATERI";
      estimatedTime = "3-4 Menit";
      slideSpecificLayoutPrompt = `Core lesson content slide. Right side features a large clean white rounded card container divided into structured modular sections explaining "${topic}" with neat diagrams, bullet points, and high-contrast typography. Left side features ${characterClause}. Background features ${theme.bg}. No quiz options, pure clean pedagogical layout.`;
      break;
    }

    case 'video': {
      headerText = `Video Pembelajaran: ${topic}`;
      educationalObjective = `Menyediakan media audio-visual interaktif untuk memperdalam pemahaman materi "${topic}".`;
      videoPlaceholderTopic = topic;
      visibleTexts = [
        `Video Pembelajaran: ${topic}`,
        "Klik Tombol Play untuk Memutar",
        "Durasi: 03:45 Menit | Animasi Edukatif HD"
      ];
      slideContent = [
        `Tayangan animasi interaktif seputar ${topic}`,
        "Penjelasan visual konsep secara bertahap dan jelas",
        "Disertai narasi suara dan teks panduan belajar"
      ];
      navigationButtons = "LANJUT KE KUIS";
      estimatedTime = "4 Menit";
      slideSpecificLayoutPrompt = `Educational video showcase slide. Right side features a stylish rounded 16:9 media player card with a prominent play button icon, progress bar, and subtitle preview "Video Animasi Pembelajaran: ${topic}". Left side features ${characterClause}. Background features ${theme.bg}. Clean modern digital classroom aesthetic.`;
      break;
    }

    case 'quiz': {
      // Determine quiz question index
      let qNum = 1;
      const match = pageTitle.match(/\d+/);
      if (match && parseInt(match[0], 10) > 0) {
        qNum = parseInt(match[0], 10);
      }
      quizData = buildTopicQuizData(topic, subject, qNum - 1);
      headerText = `Kuis ${qNum}: Pemahaman ${topic}`;
      educationalObjective = `Menguji pemahaman siswa mengenai konsep ${topic} melalui pertanyaan pilihan ganda terstruktur.`;
      visibleTexts = [
        quizData.question,
        ...quizData.options
      ];
      slideContent = [
        `Soal: ${quizData.question}`,
        ...quizData.options,
        `Kunci: ${quizData.correctAnswer} - ${quizData.explanation}`
      ];
      navigationButtons = "JAWAB KUIS";
      estimatedTime = "1-2 Menit";
      slideSpecificLayoutPrompt = `Multiple choice quiz slide. Right side features a large clean white rounded card container. Top of card displays clear question: "${quizData.question}". Center displays 4 neat horizontal multiple choice cards with circular letter badges (A, B, C, D): "${quizData.options[0]}", "${quizData.options[1]}", "${quizData.options[2]}", and "${quizData.options[3]}". Left side features ${characterClause}. Background features ${theme.bg}. Pristine layout, no overlapping elements.`;
      break;
    }

    case 'feedback_correct': {
      headerText = "Luar Biasa! Jawabanmu Benar ⭐⭐⭐";
      educationalObjective = "Memberikan apresiasi positif atas keberhasilan siswa menjawab kuis dengan tepat.";
      visibleTexts = [
        "⭐⭐⭐ JAWABAN BENAR!",
        "Kamu telah memahami materi dengan sangat baik!",
        "Lanjut ke Soal Berikutnya"
      ];
      slideContent = [
        "Selamat! Analisis dan jawabanmu sudah tepat.",
        "Pemahamanmu terhadap materi ini sudah sangat kuat.",
        "Pertahankan prestasimu di tantangan berikutnya!"
      ];
      navigationButtons = "LANJUT SOAL";
      estimatedTime = "1 Menit";
      slideSpecificLayoutPrompt = `Positive quiz feedback slide. Center displays 3 gleaming golden achievement stars and a tidy green success badge "JAWABAN BENAR!". Tutor character gives a cheerful thumbs up with an encouraging celebratory pose. Clean rounded button "Lanjut ke Soal Berikutnya". No messy confetti, uncluttered and dignified celebration. Background features ${theme.bg}.`;
      break;
    }

    case 'feedback_incorrect': {
      headerText = "Hampir Tepat! Yuk Pikirkan Lagi 💡";
      educationalObjective = "Memberikan motivasi membangun dan kesempatan untuk mencoba kembali kuis evaluasi.";
      visibleTexts = [
        "💡 AYO COBA LAGI!",
        "Jangan menyerah, kamu pasti bisa!",
        "Lihat Petunjuk / Ulangi Soal"
      ];
      slideContent = [
        "Jawabanmu hampir benar! Jangan berkecil hati.",
        "Coba baca kembali petunjuk konsep yang disediakan.",
        "Klik tombol ulangi untuk mencoba sekali lagi!"
      ];
      navigationButtons = "ULANGI SOAL";
      estimatedTime = "1 Menit";
      slideSpecificLayoutPrompt = `Encouraging quiz retry feedback slide. Center features tutor character holding a warm glowing lightbulb motif with a friendly supportive smile and speech bubble "Ayo Coba Lagi, Kamu Pasti Bisa!". White rounded card offers buttons "Lihat Petunjuk" and "Ulangi Soal". Gentle, warm, and supportive atmosphere. Background features ${theme.bg}.`;
      break;
    }

    case 'summary_closing': {
      headerText = `Rangkuman & Penutup: ${topic}`;
      educationalObjective = `Menyimpulkan seluruh inti pembelajaran materi "${topic}" dan mengapresiasi partisipasi siswa.`;
      visibleTexts = [
        `Rangkuman Inti Materi: ${topic}`,
        "1. Pemahaman konsep kunci telah tuntas",
        "2. Aktivitas eksplorasi dan kuis selesai",
        "SELESAI & ULANGI"
      ];
      slideContent = [
        `Intisari materi ${topic} telah dipelajari dengan seksama`,
        "Siswa berhasil menyelesaikan seluruh misi pembelajaran",
        "Terima kasih atas semangat belajar yang luar biasa!"
      ];
      navigationButtons = "SELESAI & ULANGI";
      estimatedTime = "2 Menit";
      slideSpecificLayoutPrompt = `Lesson summary and closing celebration slide. Center displays a large clean white rounded card container organized into 3 neat summary blocks highlighting key takeaways of "${topic}". Tutor waving politely next to a neat graduate diploma badge. Prominent clean rounded action button "SELESAI & ULANGI". Background features ${theme.bg}.`;
      break;
    }
  }

  const detailClause = "Ultra-clean minimalist composition, generous negative space (ample whitespace), zero visual clutter, neat rounded white card container with subtle soft drop shadow, high text contrast, no floating confetti or glitter particles, content-first layout";

  const cleanPrompt = `Clean educational presentation slide UI, ${aspect} aspect ratio. Style: ${styleClause}. ${characterClause}. ${slideSpecificLayoutPrompt}. ${detailClause}. Soft ambient studio lighting, sharp focus, 8k resolution, UI/UX educational presentation mockup.`;
  const midjourneyPrompt = `${cleanPrompt} --ar ${layout === 'portrait' ? '9:16' : '16:9'} --v 6.0 --style raw`;

  const structuredSpec = `📐 Layout: ${layout === 'portrait' ? '9:16 Portrait (1080x1920 px)' : '16:9 Landscape (1920x1080 px)'}
🏷️ Jenis Halaman: ${slideType.toUpperCase()}
📚 Mata Pelajaran: ${subject} | Topik: "${topic}"
🎯 Sasaran: ${ageGroup}
✨ Tingkat Detail: ${detailLevel}
🎨 Gaya Visual: ${visualStyle}
🌿 Latar Belakang: ${theme.bg}
🧑‍🎓 Karakter: ${characterClause}
📄 Teks Wajib Tampil: ${visibleTexts.join(" | ")}
🎨 Palet Warna: ${theme.palette}
🔍 Kata Kunci Canva: ${theme.canvaKeywords}`;

  return {
    slideId,
    index,
    slideType,
    pageTitle: `Halaman ${index + 1}: ${pageTitle}`,
    headerText,
    educationalObjective,
    visibleTexts,
    slideContent,
    cleanPrompt,
    midjourneyPrompt,
    illustrationDesc: structuredSpec,
    canvaKeywords: theme.canvaKeywords,
    navigationButtons,
    estimatedTime,
    quizData,
    conceptMapData,
    guidePoints,
    videoPlaceholderTopic
  };
}
