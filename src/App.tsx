/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  RotateCcw, 
  Layout, 
  Languages, 
  Laptop, 
  Smartphone, 
  Award, 
  MonitorPlay, 
  Lightbulb, 
  CheckSquare, 
  Info, 
  Smile, 
  FileText, 
  BookOpen, 
  HelpCircle,
  FolderOpen,
  Compass,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Cpu,
  Upload,
  FileUp,
  FileCheck,
  Eye,
  Star,
  Map,
  Layers,
  X,
  Image as ImageIcon,
  Camera,
  Palette,
  Wand2
} from 'lucide-react';

export const STANDARD_13_PAGES = [
  "1. Cover",
  "2. Navigasi (Tujuan Pembelajaran, Kuis)",
  "3. Tujuan Pembelajaran",
  "4. Apersepsi",
  "5. Peta Perjalanan Kuis (4 titik kuis)",
  "6. Kuis 1: Siapa yang membantu penyerbukan bunga?",
  "7. Kuis 2: Di mana ikan hidup?",
  "8. Kuis 3: Siapa konsumen tingkat pertama pada rantai makanan?",
  "9. Kuis 4: Cahaya matahari termasuk komponen biotik?",
  "10. Respon Benar",
  "11. Respon Salah",
  "12. Rangkuman/Summary",
  "13. Penutup"
];

// Pre-defined topics for teachers to click and pre-fill
const PRESET_TOPICS = [
  { 
    title: "Ekosistem & Rantai Makanan", 
    age: "SD Kelas Tinggi (9-11 tahun)", 
    pages: STANDARD_13_PAGES 
  },
  { 
    title: "Siklus Air & Hujan", 
    age: "SD Kelas Tinggi (9-11 tahun)", 
    pages: [
      "1. Cover",
      "2. Navigasi (Tujuan Pembelajaran, Kuis)",
      "3. Tujuan Pembelajaran",
      "4. Apersepsi",
      "5. Peta Perjalanan Kuis (4 titik kuis)",
      "6. Kuis 1: Dari mana uap air terbentuk?",
      "7. Kuis 2: Mengapa awan bisa menurunkan hujan?",
      "8. Kuis 3: Ke mana air hujan meresap?",
      "9. Kuis 4: Apakah jumlah air di bumi berubah?",
      "10. Respon Benar",
      "11. Respon Salah",
      "12. Rangkuman/Summary",
      "13. Penutup"
    ] 
  },
  { 
    title: "Tata Surya & Planet", 
    age: "SMP (12-14 tahun)", 
    pages: [
      "1. Cover",
      "2. Navigasi (Tujuan Pembelajaran, Kuis)",
      "3. Tujuan Pembelajaran",
      "4. Apersepsi",
      "5. Peta Perjalanan Kuis (4 titik kuis)",
      "6. Kuis 1: Pusat tata surya kita?",
      "7. Kuis 2: Planet terbesar tata surya?",
      "8. Kuis 3: Mengapa Mars berwarna merah?",
      "9. Kuis 4: Planet dengan cincin terindah?",
      "10. Respon Benar",
      "11. Respon Salah",
      "12. Rangkuman/Summary",
      "13. Penutup"
    ] 
  },
  { 
    title: "Metamorfosis Sempurna Kupu-Kupu", 
    age: "SD Kelas Rendah (6-8 tahun)", 
    pages: [
      "1. Cover",
      "2. Navigasi (Tujuan Pembelajaran, Kuis)",
      "3. Tujuan Pembelajaran",
      "4. Apersepsi",
      "5. Peta Perjalanan Kuis (4 titik kuis)",
      "6. Kuis 1: Tahap pertama setelah telur?",
      "7. Kuis 2: Tempat ulat membungkus diri?",
      "8. Kuis 3: Makanan ulat sebelum tidur?",
      "9. Kuis 4: Bentuk akhir metamorfosis?",
      "10. Respon Benar",
      "11. Respon Salah",
      "12. Rangkuman/Summary",
      "13. Penutup"
    ] 
  }
];

const AGE_GROUPS = [
  { id: "PAUD (3-5 tahun)", title: "PAUD & TK (3-5 tahun)", desc: "Visual sangat dominan, warna kontras tinggi, objek tunggal berukuran besar, teks super minimal.", icon: "🎒" },
  { id: "SD Kelas Rendah (6-8 tahun)", title: "SD Kelas Rendah (6-8 tahun)", desc: "Karakter kartun imut, penjelasan visual konkret, kalimat pendek & sederhana.", icon: "🎨" },
  { id: "SD Kelas Tinggi (9-11 tahun)", title: "SD Kelas Tinggi (9-11 tahun)", desc: "Ilustrasi informatif, konsep logis mendasar, diagram berwarna, teks penjelasan singkat.", icon: "📚" },
  { id: "SMP (12-14 tahun)", title: "SMP (12-14 tahun)", desc: "Desain infografis semi-realistis, visual analitik, skema alur berlabel jelas.", icon: "🧬" },
  { id: "SMA/Umum (15+ tahun)", title: "SMA / SMK / Umum (15+ tahun)", desc: "Desain profesional premium, skema diagramatik presisi, estetika modern & minimalis.", icon: "🔬" }
];

export const VISUAL_STYLES = [
  { 
    id: "Flat Cartoon / 2D Vector Education", 
    name: "Flat Cartoon / 2D Vector Education (Seperti Gambar Contoh)", 
    category: "2D Vector",
    desc: "Gaya ilustrasi vektor 2D dengan warna solid, cerah, dan bentuk sederhana yang bersih. Sangat serbaguna untuk berbagai mata pelajaran.",
    canvaKeywords: "flat illustration, vector education, kids cartoon, cute flat design",
    icon: "🎯" 
  },
  { 
    id: "3D Pixar Style / 3D Clay Glossy", 
    name: "3D Pixar Style / 3D Clay Glossy", 
    category: "3D Glossy",
    desc: "Karakter dan elemen lingkungan yang terlihat bervolume, mengilap, dan halus seperti mainan tanah liat modern atau animasi 3D. Sangat disukai anak-anak SD karena menarik dan interaktif.",
    canvaKeywords: "3D illustration, 3D clay, 3D elements, cute 3D character",
    icon: "🦄" 
  },
  { 
    id: "Kawaii Pastel Chibi", 
    name: "Kawaii Pastel Chibi (Cute Japanese Mascot)", 
    category: "Kawaii",
    desc: "Gaya karakter super imut proporsi kepala besar chibi Jepang berwajah ramah, garis bulat lembut, dan palet warna pastel ceria. Sangat disukai anak PAUD & SD awal.",
    canvaKeywords: "kawaii illustration, cute chibi, pastel character, cute mascot",
    icon: "🧸" 
  },
  { 
    id: "Japanese Anime / Manga Ghibli", 
    name: "Japanese Anime / Manga Studio Ghibli (Hand-Painted Scenic)", 
    category: "Anime",
    desc: "Gaya animasi klasik Jepang bernuansa hangat ala Studio Ghibli, guratan garis ekspresif, dan latar belakang alam yang kaya sentuhan cat lukis artistik.",
    canvaKeywords: "anime style, studio ghibli illustration, manga aesthetic, japanese cartoon",
    icon: "🌸" 
  },
  { 
    id: "Watercolor Storybook", 
    name: "Watercolor Storybook", 
    category: "Cat Air",
    desc: "Ilustrasi dengan efek sapuan kuas cat air yang lembut, estetik, dan artistik. Cocok untuk materi bercerita (storytelling), bahasa, sejarah, atau materi PAUD yang membutuhkan nuansa menenangkan.",
    canvaKeywords: "watercolor illustration, storybook illustration, hand drawn watercolor",
    icon: "🖌️" 
  },
  { 
    id: "Paper Cut / Paper Craft", 
    name: "Paper Cut / Paper Craft", 
    category: "Kertas 3D",
    desc: "Gaya visual yang menyerupai potongan kertas bertumpuk yang memberikan efek kedalaman (depth) dan tekstur kertas 3D. Sangat bagus untuk materi geografi (lapisan bumi), seni, atau presentasi yang ingin terlihat unik dan kreatif.",
    canvaKeywords: "papercut, paper craft, layered paper",
    icon: "✂️" 
  },
  { 
    id: "Hand-Drawn / Doodle Style", 
    name: "Hand-Drawn / Doodle Style", 
    category: "Doodle Sketsa",
    desc: "Ilustrasi yang terlihat seperti coretan tangan dengan garis yang tidak beraturan, memberikan kesan kasual, kreatif, dan playful. Sering digunakan untuk brainstorming, peta konsep (mind mapping), atau materi SMP/SMA yang ingin terlihat tidak kaku.",
    canvaKeywords: "hand drawn illustration, doodle, sketch style",
    icon: "✏️" 
  },
  { 
    id: "Memphis Design / Retro Education", 
    name: "Memphis Design / Retro Education", 
    category: "Retro Pop",
    desc: "Gaya desain yang menggunakan bentuk geometris tebal, warna kontras tinggi (neon atau pastel terang), dan pola abstrak yang semarak. Cocok untuk materi yang dinamis, kuis cerdas cermat, atau audiens yang lebih tua (SMP/SMA).",
    canvaKeywords: "memphis style, retro education, geometric illustration",
    icon: "⚡" 
  },
  { 
    id: "Whimsical 3D miniature diorama", 
    name: "Whimsical 3D miniature diorama", 
    category: "3D Diorama",
    desc: "Diorama miniatur 3D imajinatif dengan pencahayaan hangat, elemen makro mendetail seperti mainan meja mini atau lanskap mungil yang menawan.",
    canvaKeywords: "3D diorama, miniature world, tilt-shift 3D, cute isometric diorama",
    icon: "🏝️" 
  },
  { 
    id: "Isometric Pixel Art / Low Poly 3D", 
    name: "Isometric Pixel Art / Low Poly 3D (Game Edukasi)", 
    category: "Game 3D",
    desc: "Sudut pandang isometrik bergaya video game edukatif retro (pixel art / poligon 3D bersih). Sangat memikat untuk visualisasi lab virtual, peta petualangan, dan eksplorasi sains interaktif.",
    canvaKeywords: "isometric pixel art, low poly 3d, retro game asset, educational game ui",
    icon: "🎮" 
  },
  { 
    id: "Vintage Botanical & Textbook Engraving", 
    name: "Vintage Botanical & Textbook Engraving (Ensiklopedia Klasik)", 
    category: "Ensiklopedia",
    desc: "Gaya etsa sketsa klasik bertinta halus seperti ilustrasi buku ensiklopedia biologi atau atlas sejarah abad ke-19, sangat elegan untuk materi ilmiah mendalam & biologi.",
    canvaKeywords: "vintage engraving, botanical illustration, scientific sketch, antique etching",
    icon: "🏛️" 
  },
  { 
    id: "Futuristic Sci-Fi / Cyber Clean Hologram", 
    name: "Futuristic Sci-Fi / Cyber Clean Hologram", 
    category: "Sci-Fi Tech",
    desc: "Gaya bertema masa depan dengan elemen garis hologram halus, sirkuit futuristik rapi, dan aksen cyan/neon glowing lembut. Sangat cocok untuk materi astronomi, teknologi, robotika, & AI.",
    canvaKeywords: "futuristic tech, clean sci-fi, hologram graphic, neon futuristic ui",
    icon: "🚀" 
  }
];

const LANGUAGES = [
  { id: "Indonesia", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { id: "English", name: "English (Inggris)", flag: "🇬🇧" },
  { id: "Bilingual", name: "Bilingual (Dual Bahasa)", flag: "🌐" }
];

const MASCOT_TYPES = [
  { id: "generate", name: "Rekomendasi AI", desc: "AI akan otomatis merancang maskot lucu yang paling relevan dengan topik pilihan Anda." },
  { id: "custom", name: "Kustom Mandiri", desc: "Tulis sendiri deskripsi karakter atau unggah foto/gambar karakter Anda." },
  { id: "none", name: "Tanpa Maskot", desc: "Desain materi pembelajaran yang bersih, fokus penuh pada bagan konten sains tanpa karakter pendamping." }
];

export const MASCOT_STYLE_RECOMMENDATIONS = [
  { id: "2d-flat", label: "2D Flat Vector", icon: "🎯", desc: "Vektor solid cerah, garis bersih minimalis" },
  { id: "3d-pixar", label: "3D Pixar Clay", icon: "🦄", desc: "Karakter 3D berkilau seperti mainan clay" },
  { id: "kawaii-chibi", label: "Kawaii Chibi", icon: "🧸", desc: "Super imut, kepala besar pipi merona" },
  { id: "anime-ghibli", label: "Anime Ghibli", icon: "🌸", desc: "Animasi klasik Jepang hangat bernuansa alam" },
  { id: "doodle", label: "Hand-Drawn Doodle", icon: "✏️", desc: "Coretan sketsa pensil ramah & playful" },
  { id: "papercut", label: "Paper Craft", icon: "✂️", desc: "Seni potongan kertas bertumpuk timbul" },
  { id: "watercolor", label: "Cat Air Storybook", icon: "🖌️", desc: "Sapuan kuas cat air lembut artistik" },
  { id: "memphis", label: "Memphis Retro", icon: "⚡", desc: "Geometris dinamis warna kontras ceria" },
  { id: "diorama", label: "3D Diorama Mini", icon: "🏝️", desc: "Miniatur clay 3D pencahayaan hangat" },
  { id: "lowpoly", label: "Pixel / Low Poly", icon: "🎮", desc: "Model poligonal game petualangan retro" },
  { id: "engraving", label: "Ensiklopedia Klasik", icon: "🏛️", desc: "Sketsa etsa ilmiah biologis detail" },
  { id: "scifi", label: "Cyber Sci-Fi Tech", icon: "🚀", desc: "Aksen hologram cerdas berteknologi masa depan" },
];

export const MASCOT_CHARACTER_ARCHETYPES = [
  { name: "🤖 Robot Sains Ramah", desc: "Robot cilik berwarna putih-biru berkacamata pintar dan membawa tablet interaktif sains" },
  { name: "🐰 Kelinci Penjelajah", desc: "Kelinci cerdik berjaket penjelajah membawa kaca pembesar dan tas ransel petualangan" },
  { name: "🎒 Siswa Berjas Lab", desc: "Siswa sekolah ceria mengenakan jas laboratorium mini dan lencana bintang sains" },
  { name: "🐱 Kucing Astronot", desc: "Kucing putih imut memakai helm astronot transparan dengan ekor berayun ramah" },
  { name: "🦉 Burung Hantu Bijak", desc: "Burung hantu kecil memakai topi toga mini dan kacamata bulat bijaksana" },
  { name: "🦕 Dinosaurus Cilik", desc: "Dinosaurus herbivora mini berwarna hijau daun yang tersenyum ramah dan menggemaskan" }
];

interface GeneratedPrompt {
  pageTitle: string;
  headerText: string;
  illustrationDesc: string;
  canvaKeywords?: string;
  navigationButtons: string;
  estimatedTime: string;
  educationalObjective: string;
  quizData?: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
}

declare global {
  interface Window {
    pdfjsLib?: any;
    mammoth?: any;
  }
}

export default function App() {
  // Wizard states
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [topic, setTopic] = useState<string>("Ekosistem & Rantai Makanan");
  const [ageGroup, setAgeGroup] = useState<string>("SD Kelas Tinggi (9-11 tahun)");
  const [pages, setPages] = useState<string[]>(STANDARD_13_PAGES);
  const [layout, setLayout] = useState<"landscape" | "portrait">("landscape");
  const [visualStyle, setVisualStyle] = useState<string>("Flat Cartoon / 2D Vector Education");
  const [language, setLanguage] = useState<string>("Indonesia");
  const [mascotType, setMascotType] = useState<string>("generate");
  const [customMascot, setCustomMascot] = useState<string>("");
  const [mascotImage, setMascotImage] = useState<string | null>(null);
  const [mascotImageName, setMascotImageName] = useState<string | null>(null);
  const [mascotImageSize, setMascotImageSize] = useState<string | null>(null);
  const [styleCategoryFilter, setStyleCategoryFilter] = useState<string>("Semua");

  // UI operational states
  const [newPageName, setNewPageName] = useState<string>("");
  const [editingPageIndex, setEditingPageIndex] = useState<number | null>(null);
  const [editingPageValue, setEditingPageValue] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedCanvaIdx, setCopiedCanvaIdx] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedPrompt[] | null>(null);
  const [aiEngineUsed, setAiEngineUsed] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("");
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<{ connected: boolean; model?: string; message?: string } | null>(null);

  // Upload & Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [extractedCleanText, setExtractedCleanText] = useState<string>("");
  const [confirmTitle, setConfirmTitle] = useState<string>("");
  const [confirmAgeGroup, setConfirmAgeGroup] = useState<string>("SD Kelas Tinggi (9-11 tahun)");
  const [confirmSummary, setConfirmSummary] = useState<string>("");
  const [confirmStructureChoice, setConfirmStructureChoice] = useState<'standard13' | 'customDoc'>('standard13');
  const [detectedDocumentPages, setDetectedDocumentPages] = useState<string[]>([]);
  const [confirmSuccessNotice, setConfirmSuccessNotice] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/api-status')
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(() => setApiStatus({ connected: false, message: 'Server lokal' }));
  }, []);
  
  // Interactive quiz states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const handleSelectAnswer = (slideIndex: number, optionLetter: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [slideIndex]: optionLetter
    }));
  };

  const handleResetAnswer = (slideIndex: number) => {
    setSelectedAnswers(prev => {
      const updated = { ...prev };
      delete updated[slideIndex];
      return updated;
    });
  };
  // File Upload & Text Analysis states & handlers
  const [isAnalyzingFile, setIsAnalyzingFile] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedSummary, setUploadedSummary] = useState<string | null>(null);
  const [pastedNotes, setPastedNotes] = useState<string>("");
  const [showPasteNotes, setShowPasteNotes] = useState<boolean>(false);

  // Client-side Clean Text Extractors using pdf.js & mammoth.js via CDN
  const extractTextFromPdf = async (file: File): Promise<string> => {
    if (!window.pdfjsLib) throw new Error("Library PDF.js belum dimuat dari CDN.");
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= Math.min(pdf.numPages, 15); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    // Strip out non-printable ASCII characters to ensure 100% human readable text
    return fullText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim();
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    if (!window.mammoth) throw new Error("Library Mammoth.js belum dimuat dari CDN.");
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  };

  const extractCleanTextFromFile = async (file: File): Promise<string> => {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.pdf') || file.type.includes('pdf')) {
      return await extractTextFromPdf(file);
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      try {
        return await extractTextFromDocx(file);
      } catch (e) {
        const raw = await file.text();
        return raw.replace(/[^\x20-\x7E\s]/g, ' ').trim();
      }
    } else {
      const rawText = await file.text();
      // Filter out any binary PDF/ZIP header artifacts if file extension is mislabeled
      if (rawText.startsWith('%PDF') || rawText.includes('PK\x03\x04')) {
        return await extractTextFromPdf(file);
      }
      return rawText.trim();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingFile(true);
    setUploadedFileName(file.name);
    setUploadedSummary(null);

    try {
      // Extract pristine clean human-readable text (stripping out any binary PDF/ZIP headers)
      const cleanText = await extractCleanTextFromFile(file);

      if (!cleanText || cleanText.length < 5) {
        throw new Error("Tidak dapat mengekstrak teks dari file ini. Pastikan file tidak diproteksi kata sandi.");
      }

      setExtractedCleanText(cleanText);

      // Call backend API /api/analyze-material
      const res = await fetch('/api/analyze-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: cleanText,
          fileName: file.name
        })
      });

      if (res.ok) {
        const data = await res.json();
        const extractedTitle = data.extractedTopic || file.name.replace(/\.[^/.]+$/, "");
        const extractedAge = data.recommendedAgeGroup || "SD Kelas Tinggi (9-11 tahun)";
        const extractedSummary = data.summary || `Dokumen "${file.name}" berhasil dibaca dengan baik.`;
        const suggestedPages = (data.suggestedPages && Array.isArray(data.suggestedPages) && data.suggestedPages.length > 0)
          ? data.suggestedPages
          : STANDARD_13_PAGES;

        setConfirmTitle(extractedTitle);
        setConfirmAgeGroup(extractedAge);
        setConfirmSummary(extractedSummary);
        setDetectedDocumentPages(suggestedPages);

        // Pre-fill active values
        setTopic(extractedTitle);
        setAgeGroup(extractedAge);
        setUploadedSummary(extractedSummary);

        // Automatically open the confirmation modal so teacher can verify
        setShowConfirmModal(true);
      } else {
        // Fallback local clean text parser
        parseFileLocally(cleanText, file.name);
      }
    } catch (err: any) {
      console.warn("Error parsing or analyzing file, using fallback local parser:", err);
      try {
        const rawText = await file.text();
        const fallbackClean = rawText.replace(/[^\x20-\x7E\s]/g, ' ').trim();
        setExtractedCleanText(fallbackClean);
        parseFileLocally(fallbackClean, file.name);
      } catch (e) {
        alert("Gagal membaca file: " + (err.message || "Format file tidak didukung."));
      }
    } finally {
      setIsAnalyzingFile(false);
    }
  };

  const handlePastedNotesAnalyze = async () => {
    if (!pastedNotes.trim()) return;

    setIsAnalyzingFile(true);
    setUploadedFileName("Catatan Teks Tempel");
    setUploadedSummary(null);
    setExtractedCleanText(pastedNotes.trim());

    try {
      const res = await fetch('/api/analyze-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: pastedNotes.trim(),
          fileName: "catatan_tempel.txt"
        })
      });

      if (res.ok) {
        const data = await res.json();
        const extractedTitle = data.extractedTopic || "Catatan Materi";
        const extractedAge = data.recommendedAgeGroup || "SD Kelas Tinggi (9-11 tahun)";
        const extractedSummary = data.summary || "Catatan teks berhasil dianalisis dengan baik.";
        const suggestedPages = (data.suggestedPages && Array.isArray(data.suggestedPages) && data.suggestedPages.length > 0)
          ? data.suggestedPages
          : STANDARD_13_PAGES;

        setConfirmTitle(extractedTitle);
        setConfirmAgeGroup(extractedAge);
        setConfirmSummary(extractedSummary);
        setDetectedDocumentPages(suggestedPages);

        setTopic(extractedTitle);
        setAgeGroup(extractedAge);
        setUploadedSummary(extractedSummary);

        setShowConfirmModal(true);
      } else {
        parseFileLocally(pastedNotes.trim(), "Catatan Tempel");
      }
    } catch (err) {
      parseFileLocally(pastedNotes.trim(), "Catatan Tempel");
    } finally {
      setIsAnalyzingFile(false);
      setShowPasteNotes(false);
    }
  };

  const parseFileLocally = (text: string, fileName: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 0) {
      const firstLine = lines[0].replace(/^[#*-\d.]+\s*/, '');
      const extractedTitle = firstLine.length < 60 && firstLine.length > 3 ? firstLine : fileName.replace(/\.[^/.]+$/, "");
      
      setConfirmTitle(extractedTitle);
      setConfirmAgeGroup("SD Kelas Tinggi (9-11 tahun)");
      setConfirmSummary(`Berhasil membaca dokumen "${fileName}". Ditemukan ${lines.length} baris materi edukatif.`);
      setDetectedDocumentPages(STANDARD_13_PAGES);

      setTopic(extractedTitle);
      setUploadedSummary(`Berhasil membaca file "${fileName}". Topik utama dan daftar struktur halaman otomatis disesuaikan!`);
      setShowConfirmModal(true);
    }
  };

  const applyConfirmedMaterial = () => {
    if (confirmTitle.trim()) {
      setTopic(confirmTitle.trim());
    }
    if (confirmAgeGroup) {
      setAgeGroup(confirmAgeGroup);
    }
    if (confirmSummary.trim()) {
      setUploadedSummary(confirmSummary.trim());
    }
    if (confirmStructureChoice === 'standard13') {
      setPages(STANDARD_13_PAGES);
    } else if (confirmStructureChoice === 'customDoc' && detectedDocumentPages.length > 0) {
      setPages(detectedDocumentPages);
    }
    setShowConfirmModal(false);
    setConfirmSuccessNotice(true);
    setTimeout(() => setConfirmSuccessNotice(false), 5000);
  };

  const handleMascotImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, WEBP, atau SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setMascotImage(result);
      setMascotImageName(file.name);
      const sizeKb = Math.round(file.size / 1024);
      setMascotImageSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);

      if (!customMascot.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setCustomMascot(`Karakter tutor kustom sesuai foto referensi "${cleanName}" dengan ekspresi ramah, menggemaskan, dan mendidik`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMascotImage = () => {
    setMascotImage(null);
    setMascotImageName(null);
    setMascotImageSize(null);
  };

  const applyMascotStyleChip = (styleLabel: string) => {
    if (!customMascot.trim()) {
      setCustomMascot(`Karakter pendamping tutor bergaya ${styleLabel} yang ramah dan interaktif`);
    } else if (!customMascot.includes(styleLabel)) {
      setCustomMascot(`${customMascot} (Gaya visual: ${styleLabel})`);
    }
  };

  const applyMascotArchetype = (archetypeDesc: string) => {
    setCustomMascot(archetypeDesc);
  };

  // Auto-generate loading screen texts
  const loadingTexts = [
    "Menghubungkan ke server Gemini AI...",
    "Menganalisis kecocokan materi untuk kelompok usia...",
    "Merancang skema visual terstruktur sesuai gaya pilihan...",
    "Mengatur whitespace, margin, dan grid halaman premium...",
    "Menambahkan deskripsi maskot dinamis...",
    "Memformulasikan prompt visual 8K resolusi tinggi...",
    "Menyusun tombol navigasi interaktif..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingText(loadingTexts[0]);
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % loadingTexts.length;
        setLoadingText(loadingTexts[idx]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Load selected preset topic
  const handleSelectPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setTopic(preset.title);
    setAgeGroup(preset.age);
    setPages(preset.pages);
    // Auto jump to next step
    setCurrentStep(2);
  };

  // Step 3 page operations
  const handleAddPage = () => {
    if (newPageName.trim()) {
      setPages([...pages, newPageName.trim()]);
      setNewPageName("");
    }
  };

  const handleRemovePage = (index: number) => {
    if (pages.length <= 1) return; // Keep at least one page
    setPages(pages.filter((_, idx) => idx !== index));
  };

  const handleMovePage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === pages.length - 1) return;

    const newPages = [...pages];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newPages[index];
    newPages[index] = newPages[targetIdx];
    newPages[targetIdx] = temp;
    setPages(newPages);
  };

  const startEditPage = (index: number) => {
    setEditingPageIndex(index);
    setEditingPageValue(pages[index]);
  };

  const saveEditPage = (index: number) => {
    if (editingPageValue.trim()) {
      const newPages = [...pages];
      newPages[index] = editingPageValue.trim();
      setPages(newPages);
      setEditingPageIndex(null);
    }
  };

  // Local fallback generator (when Gemini is not configured or fails)
  const generateLocalPromptsFallback = () => {
    const layoutSize = layout === 'portrait' ? '9:16 (Portrait)' : '16:9 (Landscape)';
    const selectedStyleObj = VISUAL_STYLES.find(s => s.id === visualStyle) || VISUAL_STYLES[0];
    const canvaKeywords = selectedStyleObj.canvaKeywords;

    return pages.map((pageTitle, index) => {
      let headerText = pageTitle;
      let concept = "";
      let quizData: any = undefined;
      const titleLower = pageTitle.toLowerCase();

      // Brainstorm contextual designs for each page in standard 13 sequence
      if (titleLower.includes('cover') || titleLower.includes('sampul')) {
        headerText = topic || "Media Pembelajaran Interaktif";
        concept = `An eye-catching, welcoming splash cover slide introducing the topic "${topic}". The design features a large, beautifully illustrated central concept symbol (e.g., an eco-globe, celestial model, or interactive nature diorama) with bright, welcoming atmosphere.`;
      } else if (titleLower.includes('navigasi') || titleLower.includes('menu')) {
        headerText = "Pilih Menu Belajar";
        concept = `An interactive dual navigation dashboard featuring 2 prominent clickable stylized wooden/gem banner buttons: "🎯 TUJUAN PEMBELAJARAN" on the left and "🎮 KUIS INTERAKTIF" on the right. Balanced whitespace, clear icons, and cheerful educational ambiance.`;
      } else if (titleLower.includes('tujuan') || titleLower.includes('indikator')) {
        headerText = "Tujuan Pembelajaran Kita";
        concept = `A structured, goal-oriented slide showing 3 glowing badges/checklist flags on a clean classroom desk, displaying the 3 main competency objectives of learning "${topic}". Highly readable and motivating.`;
      } else if (titleLower.includes('apersepsi') || titleLower.includes('pengantar') || titleLower.includes('motivasi')) {
        headerText = "Mari Berpikir & Jelajahi!";
        concept = `An intriguing curiosity hook slide: a floating mystery treasure chest or glowing magnifying glass revealing magical elements of "${topic}" that spark deep questions and excitement.`;
      } else if (titleLower.includes('peta') || titleLower.includes('perjalanan') || titleLower.includes('titik kuis')) {
        headerText = "Peta Petualangan 4 Titik Kuis";
        concept = `An engaging treasure quest map / journey roadmap with a winding dashed trail connecting 4 numbered checkpoint flagpins (Titik 1: Penyerbukan, Titik 2: Dunia Air, Titik 3: Rantai Makanan, Titik 4: Biotik & Abiotik). Mascot ready at the starting line.`;
      } else if (titleLower.includes('kuis 1') || titleLower.includes('penyerbukan')) {
        headerText = "Kuis 1: Siapa yang Membantu Penyerbukan Bunga?";
        concept = `A colorful close-up flower garden scene showing vibrant blossom petals with bright sunlight, welcoming a friendly honeybee and colorful butterfly. Clear multiple-choice question box with 4 clean option cards.`;
        quizData = {
          question: "Siapa yang membantu penyerbukan bunga saat mencari nektar?",
          options: ["A. Lebah dan kupu-kupu", "B. Ikan di sungai", "C. Cacing di tanah", "D. Katak di kolam"],
          correctAnswer: "A",
          explanation: "Lebah dan kupu-kupu hinggap pada bunga untuk menghisap nektar. Serbuk sari yang menempel pada tubuh serangga akan berpindah ke kepala putik, membantu terjadinya penyerbukan."
        };
      } else if (titleLower.includes('kuis 2') || titleLower.includes('ikan')) {
        headerText = "Kuis 2: Di Mana Ikan Hidup?";
        concept = `A lively underwater aquatic habitat illustration with crystal-clear blue water, gentle ripples, colorful aquatic plants, and friendly swimming fish breathing with visible gills. Clean quiz prompt interface.`;
        quizData = {
          question: "Di mana habitat alami tempat ikan hidup dan bernapas menggunakan insang?",
          options: ["A. Di daratan kering", "B. Di air (sungai, danau, laut)", "C. Di atas pucuk pohon", "D. Di bawah lapisan tanah tanpa air"],
          correctAnswer: "B",
          explanation: "Ikan adalah hewan vertebrata akuatik yang hidup di air (sungai, danau, rawa, maupun laut) dan bernapas menyerap oksigen terlarut menggunakan insang."
        };
      } else if (titleLower.includes('kuis 3') || titleLower.includes('konsumen') || titleLower.includes('rantai')) {
        headerText = "Kuis 3: Siapa Konsumen Tingkat Pertama pada Rantai Makanan?";
        concept = `An educational food chain pyramid visual slide showing green grass, grasshopper, frog, and eagle. Central quiz card highlighting primary consumers in a playful nature ecosystem setting.`;
        quizData = {
          question: "Dalam rantai makanan ekosistem, siapakah yang berperan sebagai konsumen tingkat pertama (primer)?",
          options: ["A. Herbivora (hewan pemakan tumbuhan)", "B. Karnivora puncak (singa/elang)", "C. Jamur & dekomposer pengurai", "D. Tumbuhan berklorofil (produsen)"],
          correctAnswer: "A",
          explanation: "Konsumen tingkat pertama adalah hewan herbivora yang langsung memakan produsen (tumbuhan hijau) untuk mendapatkan energi pertama kali dalam rantai makanan."
        };
      } else if (titleLower.includes('kuis 4') || titleLower.includes('matahari') || titleLower.includes('biotik')) {
        headerText = "Kuis 4: Cahaya Matahari Termasuk Komponen Biotik?";
        concept = `A warm, illuminating landscape illustrating the sun's golden rays touching rocks, water, soil, and living plants. Side-by-side comparison between living and non-living environmental factors.`;
        quizData = {
          question: "Apakah cahaya matahari termasuk ke dalam kelompok komponen biotik dalam suatu ekosistem?",
          options: ["A. Benar, karena menghasilkan energi hangat", "B. Salah, cahaya matahari adalah komponen Abiotik", "C. Benar, karena termasuk makhluk hidup", "D. Benar, karena memiliki warna cerah"],
          correctAnswer: "B",
          explanation: "Cahaya matahari adalah benda tak hidup (Abiotik). Komponen biotik hanyalah segala sesuatu yang hidup (manusia, hewan, tumbuhan, dan mikroorganisme)."
        };
      } else if (titleLower.includes('respon benar') || titleLower.includes('benar')) {
        headerText = "Luar Biasa! Jawabanmu Benar Sekali ⭐⭐⭐";
        concept = `A jubilant celebration screen! 3 glowing golden achievement stars shine at the top center, colorful confetti ribbons rain down gracefully, friendly mascot leaps with victory, and a golden banner reads 'HEBAT SEKALI!'`;
      } else if (titleLower.includes('respon salah') || titleLower.includes('salah')) {
        headerText = "Hampir Tepat! Yuk Coba Sekali Lagi 💡";
        concept = `A warm, caring, child-friendly motivation screen! Friendly mascot holds a study lamp with an encouraging warm smile and a hint speech bubble: 'Jangan menyerah, kamu pasti bisa! Mari baca petunjuk dan coba lagi!'`;
      } else if (titleLower.includes('rangkuman') || titleLower.includes('summary')) {
        headerText = "Rangkuman / Intisari Materi";
        concept = `A neat, visually categorized laboratory corkboard or summary shelf displaying 4 tidy concept cards highlighting the essential facts of "${topic}". Clean typography, soft shadows, and warm lighting.`;
      } else if (titleLower.includes('penutup') || titleLower.includes('selesai')) {
        headerText = "Selamat! Misi Belajar Selesai 🎓";
        concept = `A warm graduation finale screen! Friendly mascot waves happily wearing a small graduation cap, surrounded by glowing achievement trophies, thank-you banner, and a prominent 'SELESAI' button.`;
      } else {
        headerText = pageTitle;
        concept = `A vivid and clean instructional diagram illustrating the mechanisms of "${pageTitle}" for topic "${topic}". Balanced step-by-step cycle layout with organic connection lines so students easily understand the concept.`;
      }

      // Handle mascot insertion
      let mascotClause = "";
      if (mascotType === 'generate') {
        mascotClause = `An animated, cute, and friendly educational sidekick mascot relevant to the topic of "${topic}" is actively shown on the slide, with big expressive eyes, smiling and guiding the learner.`;
      } else if (mascotType === 'custom') {
        if (mascotImageName) {
          mascotClause = `Custom character mascot based on the teacher's uploaded reference image ("${mascotImageName}"): ${customMascot || 'friendly educational tutor mascot'}. Maintain precise character consistency, visual features, colors, and friendly expressions matching the uploaded photo.`;
        } else if (customMascot) {
          mascotClause = `The mascot "${customMascot}" is prominently integrated into the scene, looking friendly, helpful, and guiding the young learner with clear hand gestures.`;
        } else {
          mascotClause = `An endearing character mascot designed as a friendly tutor companion guiding the student.`;
        }
      }

      const generatedDesc = `Ukuran: ${layoutSize}
Style: ${visualStyle}
Background Environment: Lingkungan visual yang mendalam dan hidup merepresentasikan materi "${topic || 'Materi Pembelajaran'}".
Center Subject / Graphic: ${concept}
Header Text: "${headerText}"
Integrated Mascots & Details: ${mascotClause || 'Desain bersih dan terfokus pada konten pembelajaran.'}
Canva Search Keywords: ${canvaKeywords}
UI Navigation Buttons: Tombol interaktif yang bersih dan mudah ditekan.
Atmosphere: Bright, cozy, friendly lighting, balanced composition with generous whitespace, presentation-ready, 8K resolution, 300 dpi, highly detailed.`;

      return {
        pageTitle: `Halaman ${index + 1}: ${pageTitle}`,
        headerText: headerText,
        illustrationDesc: generatedDesc,
        canvaKeywords: canvaKeywords,
        navigationButtons: index === 0 ? "MULAI BELAJAR!" : index === pages.length - 1 ? "SELESAI & ULANGI" : "LANJUT",
        estimatedTime: "1-2 Menit",
        educationalObjective: `Memberikan stimulus visual yang kuat untuk sub-materi "${pageTitle}" sehingga mempercepat pemahaman kognitif siswa.`,
        quizData: quizData
      };
    });
  };

  // Submit and call backend Gemini API or fallback
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setResults(null);

    const payload = {
      topic: topic.trim() || "Ekosistem & Rantai Makanan",
      ageGroup,
      pages,
      layout,
      visualStyle,
      language,
      mascot: {
        type: mascotType,
        description: mascotType === 'custom' ? customMascot : '',
        imageName: mascotType === 'custom' ? mascotImageName : null,
        hasImage: !!mascotImage
      }
    };

    try {
      const response = await fetch('/api/generate-prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server returned an error');
      }

      const data = await response.json();
      if (data.prompts && Array.isArray(data.prompts)) {
        // Ensure canvaKeywords is attached if missing from API
        const selectedStyleObj = VISUAL_STYLES.find(s => s.id === visualStyle) || VISUAL_STYLES[0];
        const enrichedPrompts = data.prompts.map((p: any) => ({
          ...p,
          canvaKeywords: p.canvaKeywords || selectedStyleObj.canvaKeywords
        }));
        setResults(enrichedPrompts);
        setAiEngineUsed(true);
      } else {
        throw new Error('Format hasil respon AI tidak valid.');
      }
    } catch (err: any) {
      console.warn("API Error, using client fallback generator...", err);
      // Fail gracefully: generate gorgeous prompts locally
      const fallbackPrompts = generateLocalPromptsFallback();
      setResults(fallbackPrompts);
      setAiEngineUsed(false);
      setGenerationError(`Catatan Server: ${err.message || 'Layanan offline'}. Kami telah membuatkan prompt premium dengan Mesin Generator Cerdas EduSmart lokal.`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Clipboard copies
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyCanvaKeywords = (keywords: string, index: number) => {
    navigator.clipboard.writeText(keywords);
    setCopiedCanvaIdx(index);
    setTimeout(() => setCopiedCanvaIdx(null), 2000);
  };

  const copyAllPrompts = () => {
    if (!results) return;
    const allText = results.map(r => `=== ${r.pageTitle} ===\n${r.illustrationDesc}\nKata Kunci Canva: ${r.canvaKeywords || ''}\n\n`).join('');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const resetWizard = () => {
    setResults(null);
    setTopic("Ekosistem & Rantai Makanan");
    setPages(STANDARD_13_PAGES);
    setVisualStyle("Flat Cartoon / 2D Vector Education");
    setMascotType("generate");
    setCustomMascot("");
    setMascotImage(null);
    setMascotImageName(null);
    setMascotImageSize(null);
    setGenerationError(null);
    setCurrentStep(1);
    setSelectedAnswers({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-coral-500 selection:text-white">
      {/* Top Navbar Contract */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#FAF6EE] sticky top-0 z-50 transition-shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Zone 1: Single Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-forest-900 rounded-xl flex items-center justify-center text-white shadow-md shadow-forest-900/10">
              <Sparkles className="w-5 h-5 text-[#FDBA74]" />
            </div>
            <a href="/" className="text-xl font-bold tracking-tight text-forest-900 font-display">
              EduSmart Lab
            </a>
          </div>

          {/* Zone 2: Navigation Links & Live API Status */}
          <nav className="flex items-center gap-3 sm:gap-4 text-sm font-medium text-forest-800">
            {apiStatus?.connected ? (
              <span 
                title="Koneksi Google Gemini API Aktif (Model: gemini-3.8-flash & gemini-3.1-flash-lite)"
                className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                API Gemini: Online & Siap
              </span>
            ) : (
              <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Mode Lokal EduSmart
              </span>
            )}
            <button onClick={() => setShowGuide(!showGuide)} className="hidden md:flex hover:text-forest-900 transition-colors cursor-pointer text-xs items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Panduan Canva & AI
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={resetWizard}
              className="text-xs font-semibold px-4 py-2 text-forest-800 hover:text-forest-900 transition-colors rounded-xl border border-forest-200/50 hover:bg-forest-50/50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Alur
            </button>
          </div>
        </div>
      </header>

      {/* Guide Banner modal if active */}
      {showGuide && (
        <div className="bg-forest-900 text-white py-4 px-6 relative border-b border-forest-950 animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5 md:mt-0" />
              <div>
                <p className="font-semibold text-white">Panduan Penggunaan Prompt Premium</p>
                <p className="text-forest-100/90 text-xs">Salin prompt hasil generator ini, tempel di AI Image Generator (seperti Midjourney, Dall-E, atau Magic Media Canva) untuk menghasilkan aset gambar presisi siap pasang!</p>
              </div>
            </div>
            <button 
              onClick={() => setShowGuide(false)}
              className="text-forest-200 hover:text-white font-semibold text-xs border border-forest-700 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Hero Section */}
        {currentStep === 1 && !results && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#F2EDE2] rounded-3xl p-8 shadow-sm relative overflow-hidden">
            {/* Left Column: Big Catchy Title */}
            <div className="lg:col-span-7 flex flex-col gap-4 z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-forest-800 bg-forest-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Asisten Guru Abad 21
                </span>
                <span className="text-xs text-neutral-500 font-mono">v1.2 Full-Stack Integration</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-forest-900 font-display leading-[1.15] text-wrap">
                Rancang Aset Visual Media Pembelajaran <span className="text-coral-600">Interaktif</span> Tanpa Ribet
              </h1>
              <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-xl">
                Langkah mudah merancang lembar media visual materi interaktif step-by-step. Hasilkan prompt gambar AI presisi tinggi yang didesain khusus agar menyisakan ruang teks rapi, seimbang, dan ramah anak.
              </p>
              
              <div className="flex flex-wrap gap-2 items-center mt-2">
                <span className="text-xs font-semibold text-forest-900/70">Topik Populer:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => setTopic("Metamorfosis Kupu-Kupu")} className="text-xs bg-forest-50 hover:bg-forest-100/80 px-2.5 py-1 rounded-lg border border-forest-100 transition-all text-forest-800 cursor-pointer">🦋 Metamorfosis</button>
                  <button onClick={() => setTopic("Sistem Tata Surya")} className="text-xs bg-forest-50 hover:bg-forest-100/80 px-2.5 py-1 rounded-lg border border-forest-100 transition-all text-forest-800 cursor-pointer">🪐 Tata Surya</button>
                  <button onClick={() => setTopic("Fotosintesis Tumbuhan")} className="text-xs bg-forest-50 hover:bg-forest-100/80 px-2.5 py-1 rounded-lg border border-forest-100 transition-all text-forest-800 cursor-pointer">🌱 Fotosintesis</button>
                  <button onClick={() => setTopic("Siklus Hidrologi Air")} className="text-xs bg-forest-50 hover:bg-forest-100/80 px-2.5 py-1 rounded-lg border border-forest-100 transition-all text-forest-800 cursor-pointer">💧 Siklus Air</button>
                </div>
              </div>
            </div>

            {/* Right Column: Stunning Interactive 3D style Diorama Placeholder */}
            <div className="lg:col-span-5 h-[280px] lg:h-[350px] bg-gradient-to-tr from-forest-50 via-[#FAF6EE] to-white rounded-2xl flex items-center justify-center relative shadow-inner overflow-hidden border border-[#EBE3D3]">
              <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full shadow-xs border border-forest-100 text-[10px] text-forest-800 font-semibold flex items-center gap-1.5 z-20">
                <span className="w-1.5 h-1.5 bg-coral-500 rounded-full animate-ping"></span>
                Diorama Pembelajaran Hidup
              </div>
              
              {/* Interactive SVG Diorama */}
              <svg viewBox="0 0 400 300" className="w-full h-full max-h-[300px]">
                <defs>
                  <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5A2B" />
                    <stop offset="100%" stopColor="#5C3A21" />
                  </linearGradient>
                  <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4ADE80" />
                    <stop offset="100%" stopColor="#15803D" />
                  </linearGradient>
                  <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                  <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0F172A" />
                    <stop offset="50%" stopColor="#1E1B4B" />
                    <stop offset="100%" stopColor="#311042" />
                  </linearGradient>
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#14532D" floodOpacity="0.12" />
                  </filter>
                </defs>

                {/* Sky elements based on visualStyle */}
                {visualStyle === "Neon Cyberpunk" ? (
                  <rect width="400" height="300" rx="16" fill="url(#cyberGrad)" />
                ) : null}

                {/* Background decorative clouds */}
                <g className="animate-pulse" style={{ animationDuration: '4s' }}>
                  <path d="M50,80 Q65,65 80,80 Q95,75 105,90 L45,90 Z" fill={visualStyle === "Neon Cyberpunk" ? "#38BDF8" : "#E2E8F0"} opacity={visualStyle === "Neon Cyberpunk" ? "0.2" : "0.7"} />
                  <path d="M300,60 Q315,45 330,60 Q345,55 355,70 L295,70 Z" fill={visualStyle === "Neon Cyberpunk" ? "#F43F5E" : "#E2E8F0"} opacity={visualStyle === "Neon Cyberpunk" ? "0.2" : "0.7"} />
                </g>

                {/* Floating Island Base Isometric Diamond */}
                <g filter="url(#shadow)">
                  {/* Soil depth */}
                  <polygon points="200,240 100,190 100,205 200,255" fill="#5C3A21" />
                  <polygon points="200,255 300,205 300,190 200,240" fill="#402511" />
                  
                  {/* Grass surface */}
                  <polygon points="200,170 300,220 200,270 100,220" 
                    fill={
                      visualStyle === "Neon Cyberpunk" ? "#4F46E5" :
                      visualStyle === "Watercolor" ? "#86EFAC" :
                      visualStyle === "Vintage Sketch" ? "#E2E8F0" :
                      "url(#grassGrad)"
                    } 
                  />
                </g>

                {/* Interactive flag displaying topic abbreviation in center of island */}
                <g transform="translate(195,120)">
                  <line x1="0" y1="0" x2="0" y2="70" stroke={visualStyle === "Neon Cyberpunk" ? "#F43F5E" : "#14532D"} strokeWidth="4" strokeLinecap="round" />
                  <polygon points="0,5 55,20 0,35" fill={visualStyle === "Neon Cyberpunk" ? "#38BDF8" : "#E65F2B"} />
                  <text x="8" y="24" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                    {topic ? topic.substring(0, 3).toUpperCase() : "EDU"}
                  </text>
                </g>

                {/* A cute small school house structure on left of flag */}
                <g transform="translate(115, 145)">
                  {/* Left wall */}
                  <polygon points="25,40 45,50 45,70 25,60" fill={visualStyle === "Neon Cyberpunk" ? "#4338CA" : "#F8FAFC"} stroke="#14532D" strokeWidth="1.5" />
                  {/* Right wall */}
                  <polygon points="45,50 75,35 75,55 45,70" fill={visualStyle === "Neon Cyberpunk" ? "#312E81" : "#E2E8F0"} stroke="#14532D" strokeWidth="1.5" />
                  {/* Left roof */}
                  <polygon points="20,40 45,25 45,50 25,60" fill={visualStyle === "Neon Cyberpunk" ? "#F43F5E" : "#E65F2B"} stroke="#14532D" strokeWidth="1.5" />
                  {/* Right roof */}
                  <polygon points="45,25 75,10 75,35 45,50" fill={visualStyle === "Neon Cyberpunk" ? "#BE123C" : "#C2410C"} stroke="#14532D" strokeWidth="1.5" />
                  {/* Door */}
                  <polygon points="52,58 62,53 62,65 52,70" fill="#78350F" />
                </g>

                {/* Little science telescope observatory on right of flag */}
                <g transform="translate(245, 175)">
                  {/* Base dome */}
                  <path d="M 0,0 A 20,20 0 0,1 40,0 Z" fill={visualStyle === "Neon Cyberpunk" ? "#1E293B" : "#F1F5F9"} stroke="#14532D" strokeWidth="1.5" transform="rotate(180, 20, 0)" />
                  {/* Lens pipe */}
                  <rect x="15" y="-35" width="10" height="25" rx="2" fill="#94A3B8" stroke="#14532D" strokeWidth="1.5" transform="rotate(25, 20, -20)" />
                </g>

                {/* Animated mascot floating above island if mascot is not 'none' */}
                {mascotType !== 'none' && (
                  <g className="animate-bounce" style={{ animationDuration: '3s' }} transform="translate(195, 65)">
                    {/* Floating cloud under mascot */}
                    <ellipse cx="6" cy="22" rx="18" ry="5" fill="#38BDF8" opacity="0.3" />
                    {/* Cute body */}
                    <circle cx="6" cy="5" r="14" fill={visualStyle === "Neon Cyberpunk" ? "#10B981" : "#FDBA74"} stroke="#14532D" strokeWidth="1.5" />
                    {/* Big Eyes */}
                    <circle cx="1" cy="2" r="3" fill="white" />
                    <circle cx="1" cy="2" r="1.5" fill="black" />
                    <circle cx="10" cy="2" r="3" fill="white" />
                    <circle cx="10" cy="2" r="1.5" fill="black" />
                    {/* Smiling Mouth */}
                    <path d="M 3,8 Q 5,11 8,8" stroke="#14532D" strokeWidth="1.5" fill="none" />
                    {/* Tiny wings */}
                    <path d="M -8,5 Q -15,-2 -10,12" fill="#FED7AA" stroke="#14532D" strokeWidth="1" />
                    <path d="M 20,5 Q 27,-2 22,12" fill="#FED7AA" stroke="#14532D" strokeWidth="1" />
                  </g>
                )}

                {/* Floating screen depending on layout size */}
                <g transform="translate(45, 120)" className="animate-pulse" style={{ animationDuration: '6s' }}>
                  {layout === "landscape" ? (
                    // 16:9 Landscape Screen
                    <g>
                      <rect x="0" y="0" width="70" height="40" rx="4" fill="white" stroke="#14532D" strokeWidth="2" filter="url(#shadow)" />
                      <rect x="4" y="4" width="62" height="32" rx="2" fill="#EFF6FF" />
                      <line x1="10" y1="10" x2="40" y2="10" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="50" cy="22" r="6" fill="#3B82F6" />
                      <line x1="10" y1="30" x2="25" y2="30" stroke="#E65F2B" strokeWidth="2" />
                    </g>
                  ) : (
                    // 9:16 Portrait Screen
                    <g transform="translate(10, -10)">
                      <rect x="0" y="0" width="40" height="70" rx="6" fill="white" stroke="#14532D" strokeWidth="2" filter="url(#shadow)" />
                      <rect x="3" y="3" width="34" height="64" rx="4" fill="#EFF6FF" />
                      <line x1="8" y1="10" x2="24" y2="10" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="20" cy="35" r="8" fill="#3B82F6" />
                      <line x1="8" y1="58" x2="18" y2="58" stroke="#E65F2B" strokeWidth="2" />
                    </g>
                  )}
                </g>
              </svg>

              {/* Dynamic Theme Color overlay indicators based on layout / visualStyle */}
              <div className="absolute bottom-3 left-4 flex gap-2">
                <span className="text-[10px] bg-forest-900 text-white font-mono px-2 py-0.5 rounded-md">
                  Aesthetic: {visualStyle}
                </span>
                <span className="text-[10px] bg-coral-600 text-white font-mono px-2 py-0.5 rounded-md">
                  Ratio: {layout === "landscape" ? "16:9" : "9:16"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Progress Stepper */}
        {!results && (
          <div className="bg-white border border-[#F2EDE2] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-forest-50 rounded-lg text-forest-900">
                <Layout className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tahapan Pengisian</p>
                <p className="text-sm font-bold text-forest-900 font-display">Step {currentStep} dari 8: {
                  currentStep === 1 ? "Tentukan Topik" :
                  currentStep === 2 ? "Target Usia Siswa" :
                  currentStep === 3 ? "Struktur Halaman" :
                  currentStep === 4 ? "Tata Letak (Ratio)" :
                  currentStep === 5 ? "Gaya Visual Ilustrasi" :
                  currentStep === 6 ? "Bahasa Pengantar" :
                  currentStep === 7 ? "Rancang Karakter Maskot" :
                  "Ulas & Hasilkan Prompt!"
                }</p>
              </div>
            </div>

            {/* Stepper Dots/Numbers (Clickable to jump) */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {Array.from({ length: 8 }).map((_, index) => {
                const stepNum = index + 1;
                const isCompleted = stepNum < currentStep;
                const isActive = stepNum === currentStep;
                return (
                  <button
                    key={stepNum}
                    onClick={() => {
                      // Only allow jumping back or to immediate next
                      if (stepNum <= currentStep || (topic.trim() && stepNum <= 8)) {
                        setCurrentStep(stepNum);
                      }
                    }}
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isActive 
                        ? 'bg-coral-600 text-white ring-4 ring-coral-100' 
                        : isCompleted 
                        ? 'bg-forest-900 text-white hover:bg-forest-800' 
                        : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    {stepNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Wizard Steps Shell */}
        {!results && !isGenerating && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Section (Col span 8 on desktop) */}
            <div className="lg:col-span-8 bg-white border border-[#F2EDE2] rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
              
              {/* STEP 1: TOPIK */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-forest-900 font-display">Langkah 1: Masukkan Topik Pembelajaran</h2>
                    <p className="text-xs text-neutral-500 mt-1">Tulis materi apa yang ingin Anda ajarkan (misal: Ekosistem, Kerajaan Singasari, dsb.)</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-forest-900 uppercase">Topik Materi</label>
                    <input 
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Contoh: Ekosistem Hutan atau Siklus Air Tanah..."
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-forest-700 focus:border-transparent bg-neutral-50/50 text-sm font-medium text-forest-950 placeholder:text-neutral-400"
                    />
                  </div>

                  {/* File Upload Box */}
                  <div className="p-4 bg-gradient-to-r from-forest-50/80 via-[#FAF6EE] to-white border border-dashed border-forest-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-forest-800 shadow-xs shrink-0 border border-neutral-100/80 mt-0.5">
                        <Upload className="w-5 h-5 text-coral-600 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-forest-900">Upload File / Modul Ajar Materi</p>
                          <span className="text-[10px] bg-coral-100 text-coral-800 px-2 py-0.5 rounded font-semibold font-mono">Ekstraksi AI</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Unggah dokumen (.txt, .md, .doc, .pdf) untuk ekstraksi topik, target usia, & struktur slide otomatis.</p>
                      </div>
                    </div>

                    <label className="px-4 py-2.5 bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 shadow-sm active:scale-95">
                      {isAnalyzingFile ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Menganalisis File...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-yellow-300" />
                          <span>Pilih File Materi</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept=".txt,.md,.doc,.docx,.pdf,.json,.csv,.rtf,text/*" 
                        onChange={handleFileUpload} 
                        disabled={isAnalyzingFile}
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {/* Upload Notification Success Banner with Confirmation Modal Trigger */}
                  {(uploadedFileName || extractedCleanText) && (
                    <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-xs flex flex-col gap-2.5 text-emerald-950 animate-fade-in shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                          <FileCheck className="w-4 h-4 text-emerald-700" /> Dokumen Berhasil Dibaca: {uploadedFileName || "Catatan Materi"}
                        </span>
                        <span className="text-[10px] bg-emerald-200/70 px-2.5 py-0.5 rounded-full text-emerald-800 font-bold font-mono">
                          0% Kode Biner (Teks Murni)
                        </span>
                      </div>
                      
                      {uploadedSummary && (
                        <p className="text-[11px] text-emerald-800 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-emerald-100">
                          {uploadedSummary}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-200/60">
                        <button
                          type="button"
                          onClick={() => setShowConfirmModal(true)}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" /> Cek & Konfirmasi Isi Dokumen yang Di-Upload
                        </button>
                        <span className="text-[11px] text-emerald-700 font-medium">
                          Periksa judul & teks lengkap agar sesuai dokumen asli Anda.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Green Success Notice if confirmed */}
                  {confirmSuccessNotice && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-900 flex items-center gap-2 animate-fade-in shadow-2xs">
                      <Check className="w-4 h-4 text-green-600 shrink-0" />
                      <span><strong>Materi berhasil dikonfirmasi!</strong> Judul & struktur 13 halaman interaktif EduSmart Lab siap diproses.</span>
                    </div>
                  )}

                  {/* Toggle Paste Notes Textarea */}
                  <div>
                    <button 
                      onClick={() => setShowPasteNotes(!showPasteNotes)} 
                      className="text-xs text-forest-800 hover:text-forest-950 font-bold flex items-center gap-1.5 cursor-pointer underline transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-coral-600" /> 
                      {showPasteNotes ? "Sembunyikan Area Tempel Teks" : "Atau Tempel/Salin Teks Catatan & Modul Ajar di Sini"}
                    </button>

                    {showPasteNotes && (
                      <div className="mt-3 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-col gap-3 animate-fade-in">
                        <label className="text-xs font-bold text-forest-900">Tempelkan Teks Catatan/Modul Ajar Anda:</label>
                        <textarea
                          rows={4}
                          value={pastedNotes}
                          onChange={(e) => setPastedNotes(e.target.value)}
                          placeholder="Salin dan tempelkan naskah catatan materi atau RPP Anda di sini..."
                          className="w-full p-3 rounded-xl border border-neutral-200 text-xs font-sans bg-white focus:ring-1 focus:ring-forest-700 focus:outline-hidden"
                        />
                        <button
                          disabled={!pastedNotes.trim() || isAnalyzingFile}
                          onClick={handlePastedNotesAnalyze}
                          className="self-end px-4 py-2 bg-coral-600 hover:bg-coral-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                        >
                          {isAnalyzingFile ? (
                            <span>Menganalisis Teks...</span>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                              <span>Analisis & Ekstrak Topik Teks</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-forest-800 mb-2">Atau Pilih Preset Template Siap Pakai:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {PRESET_TOPICS.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectPreset(preset)}
                          className="text-left p-3.5 rounded-xl border border-neutral-100 hover:border-forest-700/30 hover:bg-forest-50/30 transition-all cursor-pointer flex flex-col gap-1.5 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-forest-900 group-hover:text-coral-600 transition-colors">{preset.title}</span>
                            <span className="text-[10px] bg-forest-100 text-forest-800 px-2 py-0.5 rounded-md font-semibold font-sans">{preset.age.split(' ')[0]}</span>
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate w-full">Struktur: {preset.pages.join(' → ')}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: TARGET USIA */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-forest-900 font-display">Langkah 2: Tentukan Target Usia Siswa</h2>
                    <p className="text-xs text-neutral-500 mt-1">Pilihan ini membantu AI menyesuaikan tingkat kesulitan visual dan panjang kalimat narasi.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {AGE_GROUPS.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => setAgeGroup(group.id)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                          ageGroup === group.id 
                            ? 'border-forest-700 bg-forest-50/40 ring-2 ring-forest-100' 
                            : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'
                        }`}
                      >
                        <span className="text-2xl p-2 bg-white rounded-lg shadow-xs shrink-0">{group.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-forest-950">{group.title}</h3>
                            {ageGroup === group.id && (
                              <span className="text-[10px] bg-forest-700 text-white font-semibold px-2 py-0.5 rounded-md">Terpilih</span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">{group.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: STRUKTUR HALAMAN */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-forest-900 font-display">Langkah 3: Atur Struktur Halaman Media</h2>
                      <p className="text-xs text-neutral-500 mt-1">Anda bebas menyusun, mengubah judul, menambah, atau memuat 13 alur standar interaktif.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPages(STANDARD_13_PAGES)}
                      className="self-start md:self-auto px-3.5 py-2 bg-forest-900 hover:bg-forest-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                    >
                      <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                      <span>Muat Standar EduSmart 13 Halaman Lengkap</span>
                    </button>
                  </div>

                  {/* 13-page pedagogical flow badge */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="leading-relaxed text-[11px]">
                      <strong>Standar Alur 13 Halaman EduSmart Lab:</strong> 1. Cover &bull; 2. Navigasi &bull; 3. Tujuan &bull; 4. Apersepsi &bull; 5. Peta 4 Kuis &bull; 6-9. Kuis 1 s/d 4 (4 Soal Interaktif) &bull; 10. Respon Benar &bull; 11. Respon Salah &bull; 12. Rangkuman &bull; 13. Penutup.
                    </div>
                  </div>

                  {/* Add page control */}
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={newPageName}
                      onChange={(e) => setNewPageName(e.target.value)}
                      placeholder="Masukkan nama halaman baru..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-forest-700"
                    />
                    <button
                      onClick={handleAddPage}
                      className="px-4 py-2 bg-coral-600 hover:bg-coral-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" /> Tambah Halaman
                    </button>
                  </div>

                  {/* Checklist List */}
                  <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
                    {pages.map((page, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-neutral-50/80 hover:bg-neutral-50 rounded-xl border border-neutral-100 text-xs transition-all group"
                      >
                        <div className="flex items-center gap-2 flex-1 mr-4">
                          <span className="font-mono text-[10px] text-neutral-400 font-bold bg-neutral-100 w-5 h-5 flex items-center justify-center rounded-md">
                            {index + 1}
                          </span>
                          
                          {editingPageIndex === index ? (
                            <input 
                              type="text"
                              value={editingPageValue}
                              onChange={(e) => setEditingPageValue(e.target.value)}
                              onBlur={() => saveEditPage(index)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEditPage(index)}
                              autoFocus
                              className="flex-1 px-2 py-1 text-xs border border-forest-500 rounded bg-white"
                            />
                          ) : (
                            <span 
                              onClick={() => startEditPage(index)}
                              className="font-semibold text-forest-950 cursor-pointer hover:underline"
                              title="Klik untuk ubah judul"
                            >
                              {page}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Ordering Buttons */}
                          <button 
                            disabled={index === 0}
                            onClick={() => handleMovePage(index, 'up')}
                            className="p-1 text-neutral-400 hover:text-forest-900 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer transition-colors"
                          >
                            ▲
                          </button>
                          <button 
                            disabled={index === pages.length - 1}
                            onClick={() => handleMovePage(index, 'down')}
                            className="p-1 text-neutral-400 hover:text-forest-900 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer transition-colors"
                          >
                            ▼
                          </button>
                          {/* Delete */}
                          <button 
                            disabled={pages.length <= 1}
                            onClick={() => handleRemovePage(index)}
                            className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-30 cursor-pointer transition-colors ml-1"
                            title="Hapus halaman"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-relaxed italic">*Klik teks nama halaman untuk mengubah judul secara instan.</p>
                </div>
              )}

              {/* STEP 4: LAYOUT (RATIO) */}
              {currentStep === 4 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-forest-900 font-display">Langkah 4: Pilih Rasio Tata Letak (Orientation)</h2>
                    <p className="text-xs text-neutral-500 mt-1">Sesuaikan dengan perangkat utama yang akan digunakan oleh siswa di kelas.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Landscape */}
                    <button
                      onClick={() => setLayout("landscape")}
                      className={`p-6 rounded-2xl border text-left flex flex-col gap-4 cursor-pointer transition-all ${
                        layout === "landscape" 
                          ? 'border-forest-700 bg-forest-50/40 ring-2 ring-forest-100 shadow-sm' 
                          : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'
                      }`}
                    >
                      <div className="w-12 h-8 bg-forest-100 rounded-md flex items-center justify-center text-forest-950 shadow-inner">
                        <Laptop className="w-5 h-5 text-forest-800" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-forest-900">Landscape (16:9)</h3>
                          {layout === "landscape" && (
                            <span className="w-2 h-2 bg-coral-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Format standar paling ideal untuk tayangan LCD Proyektor kelas, Laptop, dan Smart TV Interaktif.</p>
                      </div>
                    </button>

                    {/* Portrait */}
                    <button
                      onClick={() => setLayout("portrait")}
                      className={`p-6 rounded-2xl border text-left flex flex-col gap-4 cursor-pointer transition-all ${
                        layout === "portrait" 
                          ? 'border-forest-700 bg-forest-50/40 ring-2 ring-forest-100 shadow-sm' 
                          : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'
                      }`}
                    >
                      <div className="w-8 h-12 bg-forest-100 rounded-md flex items-center justify-center text-forest-950 shadow-inner">
                        <Smartphone className="w-5 h-5 text-forest-800" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-forest-900">Portrait (9:16)</h3>
                          {layout === "portrait" && (
                            <span className="w-2 h-2 bg-coral-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Sangat cocok untuk materi mobile learning, modul berbasis Android/iOS, dan postingan story edukasi.</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: GAYA VISUAL */}
              {currentStep === 5 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-forest-900 font-display">Langkah 5: Tentukan Gaya Visual Gambar</h2>
                      <span className="text-[11px] bg-forest-100 text-forest-800 font-bold px-2.5 py-0.5 rounded-full font-mono">
                        12 Rekomendasi Edukasi
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Pilih gaya artistik gambar untuk merangsang estetika belajar siswa Anda (tersedia 12 pilihan lengkap termasuk 2D, 3D, Anime, Kawaii, dsb).</p>
                  </div>

                  {/* Filter Kategori Gaya */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-1">
                    {["Semua (12)", "2D & Vektor", "3D & Animasi", "Anime & Kawaii", "Seni Kertas & Cat Air", "Retro & Sci-Fi"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setStyleCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          styleCategoryFilter === cat
                            ? 'bg-forest-900 text-white shadow-xs'
                            : 'bg-white border border-neutral-200/80 text-neutral-600 hover:bg-neutral-50 hover:text-forest-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {VISUAL_STYLES.filter((style) => {
                      if (styleCategoryFilter === "Semua (12)" || styleCategoryFilter === "Semua") return true;
                      if (styleCategoryFilter === "2D & Vektor") return (style.category || '').includes("2D") || (style.category || '').includes("Doodle");
                      if (styleCategoryFilter === "3D & Animasi") return (style.category || '').includes("3D") || (style.category || '').includes("Game");
                      if (styleCategoryFilter === "Anime & Kawaii") return (style.category || '').includes("Anime") || (style.category || '').includes("Kawaii");
                      if (styleCategoryFilter === "Seni Kertas & Cat Air") return (style.category || '').includes("Cat Air") || (style.category || '').includes("Kertas") || (style.category || '').includes("Ensiklopedia");
                      if (styleCategoryFilter === "Retro & Sci-Fi") return (style.category || '').includes("Retro") || (style.category || '').includes("Sci-Fi");
                      return true;
                    }).map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setVisualStyle(style.id)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 justify-between ${
                          visualStyle === style.id 
                            ? 'border-forest-700 bg-forest-50/40 ring-2 ring-forest-100 shadow-sm' 
                            : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{style.icon}</span>
                            <span className="text-[10px] bg-forest-100 text-forest-900 font-bold px-2 py-0.5 rounded-md font-mono">
                              {style.category}
                            </span>
                          </div>
                          {visualStyle === style.id && (
                            <span className="w-2.5 h-2.5 bg-coral-500 rounded-full ring-2 ring-coral-200"></span>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="text-xs font-bold text-forest-950">{style.name}</h3>
                          <p className="text-[10px] text-neutral-500 leading-relaxed">{style.desc}</p>
                          
                          <div className="mt-1 pt-2 border-t border-neutral-100 flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-coral-600 uppercase tracking-wider font-mono">
                              🔍 Kata Kunci di Canva:
                            </span>
                            <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200/50 rounded-lg px-2 py-1">
                              <code className="text-[10px] text-amber-950 font-mono font-medium truncate" title={style.canvaKeywords}>
                                {style.canvaKeywords}
                              </code>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyCanvaKeywords(style.canvaKeywords, -1);
                                }}
                                title="Salin kata kunci Canva"
                                className="p-1 hover:text-coral-600 text-forest-800 cursor-pointer ml-1 transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: BAHASA */}
              {currentStep === 6 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-forest-900 font-display">Langkah 6: Pilih Bahasa Narasi Materi</h2>
                    <p className="text-xs text-neutral-500 mt-1">Bahasa pengantar utama yang akan diintegrasikan pada judul slide presentasi.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setLanguage(lang.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                          language === lang.id 
                            ? 'border-forest-700 bg-forest-50/40 ring-2 ring-forest-100' 
                            : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <h3 className="text-xs font-bold text-forest-900">{lang.name}</h3>
                          <p className="text-[10px] text-neutral-500">Opsi: Active</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: MASKOT */}
              {currentStep === 7 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-forest-900 font-display">Langkah 7: Konfigurasi Maskot Karakter</h2>
                    <p className="text-xs text-neutral-500 mt-1">Maskot bertindak sebagai pemandu belajar (tutor pendamping) yang disukai siswa.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {MASCOT_TYPES.map((mascot) => (
                      <button
                        key={mascot.id}
                        type="button"
                        onClick={() => setMascotType(mascot.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-2 justify-between h-32 ${
                          mascotType === mascot.id 
                            ? 'border-forest-700 bg-forest-50/40 ring-2 ring-forest-100 shadow-sm' 
                            : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-bold text-forest-950">{mascot.name}</span>
                          {mascotType === mascot.id && (
                            <span className="w-1.5 h-1.5 bg-coral-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-snug">{mascot.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Kustom Mandiri: Upload Foto Karakter, 10-12 Rekomendasi Gaya, & Ide Karakter */}
                  {mascotType === 'custom' && (
                    <div className="flex flex-col gap-5 p-5 bg-[#FAF6EE]/90 border border-[#EBE3D3] rounded-3xl animate-fade-in shadow-xs">
                      
                      {/* Bagian 1: Tombol Upload Foto Karakter */}
                      <div className="flex flex-col gap-2.5 pb-4 border-b border-[#E8DFCE]">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-forest-950 flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-coral-600" />
                            1. Unggah Foto / Gambar Karakter (Praktis & Instan):
                          </label>
                          {mascotImage && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                              <Check className="w-3 h-3 text-emerald-600" /> Foto Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-normal">
                          Tidak perlu bingung merangkai kata! Cukup unggah file foto/gambar karakter Anda (PNG, JPG, WEBP). Sistem AI akan otomatis menjaga konsistensi wajah, warna, dan kostum karakter di seluruh slide materi pembelajaran.
                        </p>

                        {!mascotImage ? (
                          <div className="mt-1 flex flex-col sm:flex-row items-center gap-3 p-4 bg-white border-2 border-dashed border-neutral-200 hover:border-forest-700/60 rounded-2xl transition-all">
                            <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center shrink-0">
                              <ImageIcon className="w-6 h-6 text-forest-800" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                              <p className="text-xs font-bold text-forest-950">Pilih File Foto / Gambar Karakter</p>
                              <p className="text-[10px] text-neutral-400">Mendukung file JPG, PNG, WEBP, atau SVG (Maksimal 5MB)</p>
                            </div>
                            <label className="px-4 py-2 bg-coral-600 hover:bg-coral-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all shrink-0">
                              <Upload className="w-3.5 h-3.5" />
                              Unggah Foto Karakter
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleMascotImageUpload} 
                                className="hidden" 
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center justify-between p-3.5 bg-white border border-forest-200 rounded-2xl shadow-xs">
                            <div className="flex items-center gap-3">
                              <img 
                                src={mascotImage} 
                                alt="Mascot Thumbnail" 
                                className="w-14 h-14 rounded-xl object-cover border-2 border-forest-700 shadow-sm"
                              />
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-forest-950 truncate max-w-[200px] sm:max-w-xs">{mascotImageName}</span>
                                <span className="text-[10px] text-neutral-400">{mascotImageSize} &bull; Acuan visual aktif</span>
                                <span className="text-[10px] text-emerald-700 font-medium">Konsistensi karakter akan dipertahankan di seluruh slide</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-forest-900 rounded-lg text-xs font-bold cursor-pointer transition-colors">
                                Ganti Foto
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleMascotImageUpload} 
                                  className="hidden" 
                                />
                              </label>
                              <button 
                                type="button" 
                                onClick={handleRemoveMascotImage}
                                className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus foto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bagian 2: 10-12 Rekomendasi Gaya Ilustrasi Karakter */}
                      <div className="flex flex-col gap-2 pb-4 border-b border-[#E8DFCE]">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-forest-950 flex items-center gap-1.5">
                            <Palette className="w-4 h-4 text-coral-600" />
                            2. Rekomendasi Gaya Ilustrasi Karakter (Pilih 1 Sentuhan):
                          </label>
                          <span className="text-[10px] text-neutral-400 font-mono">12 Pilihan Gaya</span>
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          Klik salah satu gaya di bawah ini untuk menyematkan sentuhan render estetika ke deskripsi maskot:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-1">
                          {MASCOT_STYLE_RECOMMENDATIONS.map((style) => (
                            <button
                              key={style.id}
                              type="button"
                              onClick={() => applyMascotStyleChip(style.label)}
                              className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                                customMascot.includes(style.label)
                                  ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                                  : 'bg-white hover:bg-forest-50/60 border-neutral-200/80 text-forest-950'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">{style.icon}</span>
                                <span className="text-[11px] font-bold truncate">{style.label}</span>
                              </div>
                              <span className={`text-[9px] line-clamp-1 ${customMascot.includes(style.label) ? 'text-forest-200' : 'text-neutral-400'}`}>
                                {style.desc}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Bagian 3: Ide Karakter Cepat Siap Pakai */}
                      <div className="flex flex-col gap-2 pb-3 border-b border-[#E8DFCE]">
                        <label className="text-xs font-bold text-forest-950 flex items-center gap-1.5">
                          <Wand2 className="w-4 h-4 text-amber-600" />
                          3. Ide Cepat Karakter Populer (Sekali Klik):
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {MASCOT_CHARACTER_ARCHETYPES.map((arch, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => applyMascotArchetype(arch.desc)}
                              className="px-2.5 py-1 bg-white hover:bg-amber-50 hover:border-amber-300 border border-neutral-200 text-forest-900 rounded-lg text-[10px] font-semibold cursor-pointer transition-all shadow-2xs"
                            >
                              {arch.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Bagian 4: Deskripsi Teks Karakter */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-forest-950">
                          4. Deskripsi Teks Karakter (Telah Disesuaikan Otomatis):
                        </label>
                        <textarea 
                          rows={2}
                          value={customMascot}
                          onChange={(e) => setCustomMascot(e.target.value)}
                          placeholder="Misal: Kiko si Katak Hijau ceria berkacamata bulat dengan ekspresi gembira memegang buku sains..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-forest-700 bg-white leading-relaxed resize-none"
                        />
                        <p className="text-[10px] text-neutral-400">
                          {mascotImage 
                            ? "Foto karakter telah terpasang. Teks di atas akan memperkaya pose interaktif tutor di slide." 
                            : "Anda dapat mengetik langsung, memilih gaya, atau mengunggah foto karakter pada bagian di atas."}
                        </p>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* STEP 8: REVIEW & GENERATE */}
              {currentStep === 8 && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-forest-900 font-display">Langkah 8: Tinjau Konfigurasi Media</h2>
                    <p className="text-xs text-neutral-500 mt-1">Periksa kembali ringkasan sebelum sistem memformulasikan prompt visual premium.</p>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF6EE]/50 rounded-2xl p-5 border border-[#F2EDE2]">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">Topik Pembelajaran</span>
                      <span className="text-xs font-bold text-forest-950">{topic || "Belum Ditentukan"}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">Target Usia Siswa</span>
                      <span className="text-xs font-bold text-forest-950">{ageGroup}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">Dimensi Tata Letak</span>
                      <span className="text-xs font-bold text-forest-950">
                        {layout === 'landscape' ? "Landscape Widescreen (16:9)" : "Portrait Mobile (9:16)"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">Gaya Estetika Visual</span>
                      <span className="text-xs font-bold text-forest-950">{visualStyle}</span>
                    </div>

                    <div className="flex flex-col gap-1 col-span-1 md:col-span-2 border-t border-dashed border-[#EBE3D3] pt-3">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">Struktur Materi ({pages.length} Slide)</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {pages.map((p, i) => (
                          <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded-md text-forest-800 border border-neutral-100 font-medium font-sans">
                            {i+1}. {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2 border-t border-dashed border-[#EBE3D3] pt-3">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">Bahasa & Maskot Tutor</span>
                      <div className="flex items-center gap-3">
                        {mascotType === 'custom' && mascotImage && (
                          <img 
                            src={mascotImage} 
                            alt="Foto Maskot" 
                            className="w-10 h-10 rounded-xl object-cover border-2 border-forest-700 shadow-xs shrink-0" 
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-forest-950">
                            Bahasa: {language} &middot; Maskot: {
                              mascotType === 'none' 
                                ? "Tanpa Maskot" 
                                : mascotType === 'generate' 
                                  ? "AI Generated (Otomatis)" 
                                  : `Kustom ${mascotImageName ? `[Foto: ${mascotImageName}]` : ''}`
                            }
                          </span>
                          {mascotType === 'custom' && (
                            <span className="text-[10px] text-neutral-500 line-clamp-1">
                              {customMascot || (mascotImageName ? "Sesuai foto acuan visual karakter" : "Tanpa deskripsi spesifik")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning if no topic filled */}
                  {!topic.trim() && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-800">Topik Masih Kosong</p>
                        <p className="text-[11px] text-amber-700 leading-normal">Silakan isi topik materi terlebih dahulu di Step 1 agar AI dapat memformulasikan deskripsi materi yang detail.</p>
                      </div>
                    </div>
                  )}

                  {/* Big Coral CTA Button */}
                  <button
                    disabled={!topic.trim()}
                    onClick={handleGenerate}
                    className="w-full bg-coral-600 hover:bg-coral-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-coral-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer text-sm font-display tracking-wide uppercase"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-200" />
                    Hasilkan Prompt Visual Sekarang!
                  </button>
                </div>
              )}

              {/* Back / Next Buttons */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-5 mt-4">
                <button
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-4 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-xl text-xs font-bold border border-neutral-200/60 disabled:opacity-30 cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali
                </button>

                {currentStep < 8 ? (
                  <button
                    disabled={currentStep === 1 && !topic.trim()}
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="px-5 py-2 bg-forest-900 hover:bg-forest-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Lanjut <ChevronRight className="w-4 h-4" />
                  </button>
                ) : null}
              </div>

            </div>

            {/* Sidebar Guide (Col span 4 on desktop) */}
            <div className="lg:col-span-4 bg-white border border-[#F2EDE2] rounded-3xl p-6 shadow-sm flex flex-col gap-5 sticky top-24">
              <h3 className="text-xs font-bold text-forest-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-coral-600" /> Kiat Desain Slide Premium
              </h3>
              
              <ul className="flex flex-col gap-3.5 text-xs text-neutral-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-coral-600 font-bold mt-0.5">01.</span>
                  <div>
                    <strong className="text-forest-950 block">Aturan Whitespace Luas</strong>
                    Semua prompt kami menyertakan instruksi &ldquo;generous whitespace&rdquo; untuk menyisakan ruang peletakan teks guru di Canva.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-coral-600 font-bold mt-0.5">02.</span>
                  <div>
                    <strong className="text-forest-950 block">No Touch Policy</strong>
                    Gambar diinstruksikan tidak saling tabrakan atau terpotong di tepi canvas, mempermudah guru merapikan tata letak slide.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-coral-600 font-bold mt-0.5">03.</span>
                  <div>
                    <strong className="text-forest-950 block">Fokus & Edukatif</strong>
                    Gaya visual yang dirancang khusus menyesuaikan perkembangan kognitif anak sesuai jenjang usia masing-masing.
                  </div>
                </li>
              </ul>

              <div className="bg-forest-50/50 rounded-2xl p-4 border border-forest-100 text-xs flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-1.5 text-forest-900 font-bold">
                  <Cpu className="w-4 h-4 text-emerald-800" />
                  <span>Teknologi Pemrosesan</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Web app ini terhubung ke model <strong>Gemini-3.8-Flash</strong> di backend. Jika offline, sistem otomatis beralih ke mesin pemrosesan template lokal berkecepatan tinggi secara cerdas.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Loading / Generating State */}
        {isGenerating && (
          <div className="bg-white border border-[#F2EDE2] rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center gap-6 animate-pulse max-w-2xl mx-auto my-12">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-forest-100 border-t-coral-600 animate-spin"></div>
              <Sparkles className="w-6 h-6 text-[#FDBA74] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            
            <div className="text-center flex flex-col gap-2">
              <h3 className="text-lg font-bold text-forest-900 font-display">Sedang Merancang Prompt Visual...</h3>
              <p className="text-xs text-neutral-500 max-w-sm font-mono">{loadingText}</p>
            </div>

            <div className="w-full bg-neutral-100 rounded-full h-1.5 max-w-xs overflow-hidden mt-2">
              <div className="bg-coral-600 h-full w-2/3 rounded-full animate-infinite-scroll"></div>
            </div>
          </div>
        )}

        {/* OUTPUT: Results Stage */}
        {results && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* Header Result summary */}
            <div className="bg-white border border-[#F2EDE2] rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] bg-coral-600 text-white font-mono px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Selesai Dibuat
                  </span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-md flex items-center gap-1.5 ${
                    aiEngineUsed 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold' 
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    <Cpu className={`w-3 h-3 ${aiEngineUsed ? 'text-emerald-600' : ''}`} /> 
                    {aiEngineUsed ? "Mesin: Google Gemini AI (Online)" : "Mesin: Template EduSmart Lokal"}
                  </span>
                  {mascotType === 'custom' && mascotImage && (
                    <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1.5 font-mono">
                      <img src={mascotImage} alt="Foto Karakter" className="w-4 h-4 rounded-full object-cover border border-amber-500" />
                      Karakter Foto: {mascotImageName}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-forest-900 font-display">Prompt Visual: &ldquo;{topic}&rdquo;</h2>
                <p className="text-xs text-neutral-500 max-w-xl">
                  Berikut adalah {results.length} prompt visual premium siap pakai. Salin teks prompt di bawah ini lalu tempelkan ke tools AI pilihan Anda (Midjourney, DALL-E, atau Canva Magic Media).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={copyAllPrompts}
                  className="px-4 py-2.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  {copiedAll ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                  {copiedAll ? "Tersalin Semua!" : "Salin Semua Prompt"}
                </button>
                
                <button
                  onClick={resetWizard}
                  className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-forest-900 text-xs font-bold rounded-xl border border-neutral-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Mulai Baru
                </button>
              </div>
            </div>

            {/* Error or Warning Info banner */}
            {generationError && (
              <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 text-xs text-amber-800 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans">{generationError}</p>
              </div>
            )}

            {/* Slide List Grid */}
            <div className="grid grid-cols-1 gap-6">
              {results.map((prompt, index) => {
                const layoutRatio = layout === 'portrait' ? 'max-w-[320px] aspect-[9/16]' : 'max-w-full aspect-[16/9]';
                return (
                  <div 
                    key={index} 
                    className="bg-white border border-[#F2EDE2] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12"
                  >
                    {/* Left Grid: Premium Layout Mockup Representation */}
                    <div className="lg:col-span-5 bg-[#FAF6EE]/40 p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#FAF6EE] min-h-[220px]">
                      <div className="flex flex-col gap-2 items-center w-full">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                          MOCKUP FRAME: {prompt.pageTitle.split(':')[0]}
                        </span>
                        
                        {/* Slide Mockup Box representation */}
                        <div className={`w-full ${layoutRatio} bg-white rounded-xl shadow-xs border border-[#F0EAE1] p-4 flex flex-col justify-between relative overflow-hidden`}>
                          
                          {/* Slide Header area */}
                          <div className="border-b border-neutral-100/70 pb-1.5">
                            <span className="text-[10px] font-bold text-forest-700 uppercase tracking-wider block">
                              Slide Header Title
                            </span>
                            <p className="text-[11px] font-bold text-forest-950 truncate max-w-[90%]">
                              {prompt.headerText}
                            </p>
                          </div>

                          {/* Central illustration placeholder visual representation based on page type & visualStyle */}
                          <div className="flex-1 my-3 bg-[#FAF6EE]/50 rounded-lg flex flex-col items-center justify-center p-3 text-center border border-dashed border-neutral-200 relative overflow-hidden">
                            {/* Abstract decorative graphic depending on page title */}
                            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                              <BookOpen className="w-16 h-16 text-forest-900" />
                            </div>

                            {prompt.pageTitle.toLowerCase().includes('navigasi') ? (
                              <div className="flex flex-col gap-1.5 w-full max-w-[190px] z-10">
                                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">PILIH JALUR</span>
                                <div className="p-1.5 bg-forest-900 text-white rounded-lg text-[9px] font-bold text-center shadow-xs flex items-center justify-center gap-1">
                                  <span>🎯</span> TUJUAN BELAJAR
                                </div>
                                <div className="p-1.5 bg-coral-600 text-white rounded-lg text-[9px] font-bold text-center shadow-xs flex items-center justify-center gap-1">
                                  <span>🎮</span> KUIS INTERAKTIF
                                </div>
                              </div>
                            ) : prompt.pageTitle.toLowerCase().includes('peta') || prompt.pageTitle.toLowerCase().includes('perjalanan') ? (
                              <div className="flex flex-col items-center gap-1.5 z-10">
                                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">4 TITIK MISI KUIS</span>
                                <div className="flex items-center gap-1.5">
                                  {[1, 2, 3, 4].map(n => (
                                    <div key={n} className="flex items-center">
                                      <span className="w-6 h-6 rounded-full bg-forest-900 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                                        {n}
                                      </span>
                                      {n < 4 && <span className="w-2 h-0.5 bg-neutral-300"></span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : prompt.pageTitle.toLowerCase().includes('respon benar') ? (
                              <div className="flex flex-col items-center gap-1 z-10 text-center">
                                <div className="flex gap-0.5 text-base text-yellow-400">⭐⭐⭐</div>
                                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full font-mono uppercase">
                                  🎉 JAWABAN BENAR!
                                </span>
                              </div>
                            ) : prompt.pageTitle.toLowerCase().includes('respon salah') ? (
                              <div className="flex flex-col items-center gap-1 z-10 text-center">
                                <span className="text-xl">💡</span>
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full font-mono uppercase">
                                  AYO COBA LAGI!
                                </span>
                              </div>
                            ) : (
                              <>
                                <span className="text-[9px] font-bold text-coral-600 font-mono uppercase bg-coral-50 px-1.5 py-0.5 rounded-sm z-10">
                                  {visualStyle.split('/')[0].trim()}
                                </span>
                                <p className="text-[9px] text-neutral-500 mt-1 max-w-[180px] leading-tight truncate-3 z-10">
                                  {topic} visual background
                                </p>
                              </>
                            )}
                          </div>

                          {/* Footer area */}
                          <div className="flex items-center justify-between border-t border-neutral-100 pt-1.5">
                            <span className="text-[9px] text-neutral-400 font-mono">{prompt.estimatedTime}</span>
                            <div className="flex gap-1">
                              <span className="px-2 py-0.5 bg-coral-600 text-white rounded text-[8px] font-bold">
                                {prompt.navigationButtons.split(',')[0].trim()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Grid: Formatted Prompt Output */}
                    <div className="lg:col-span-7 p-6 md:p-8 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <div>
                          <h3 className="text-sm font-bold text-forest-900 font-display">{prompt.pageTitle}</h3>
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold mt-1 inline-block">
                            Tujuan: {prompt.educationalObjective}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => copyToClipboard(prompt.illustrationDesc, index)}
                          className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-forest-900 text-xs font-bold rounded-lg border border-neutral-200 transition-colors cursor-pointer flex items-center gap-1 hover:border-forest-700/30"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-600 animate-bounce" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Prompt</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Prompt code block style */}
                      <div className="bg-[#FAF6EE] text-forest-950 font-mono text-[11px] p-4 rounded-2xl border border-[#F2EDE2] overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner max-h-[220px] overflow-y-auto">
                        {prompt.illustrationDesc}
                      </div>

                      {/* Canva Search Keywords Tag */}
                      {prompt.canvaKeywords && (
                        <div className="flex items-center justify-between bg-amber-50/90 border border-amber-200/70 rounded-xl px-3 py-2 text-xs">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <span className="text-[10px] font-bold text-amber-900 uppercase font-mono shrink-0">
                              🔍 Kata Kunci di Canva:
                            </span>
                            <code className="text-[11px] text-amber-950 font-semibold font-mono truncate" title={prompt.canvaKeywords}>
                              {prompt.canvaKeywords}
                            </code>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyCanvaKeywords(prompt.canvaKeywords!, index)}
                            className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-200 text-[10px] font-bold shrink-0 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            {copiedCanvaIdx === index ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                            {copiedCanvaIdx === index ? "Tersalin!" : "Salin Tag"}
                          </button>
                        </div>
                      )}

                      {/* Educational Tips */}
                      <div className="flex gap-2 items-center text-[11px] text-neutral-500">
                        <Info className="w-3.5 h-3.5 text-coral-600 shrink-0" />
                        <span><strong>Petunjuk Canva:</strong> Tempel prompt di atas pada Magic Media Canva, masukkan rasio {layout === 'landscape' ? '16:9 (Horizontal)' : '9:16 (Vertical)'}.</span>
                      </div>

                      {/* Interactive Playable Quiz Card */}
                      {prompt.quizData && (
                        <div className="mt-2 p-5 bg-forest-50/50 border border-forest-100 rounded-2xl flex flex-col gap-3.5 animate-fade-in shadow-xs">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-forest-900 uppercase tracking-wider">
                            <CheckSquare className="w-4 h-4 text-coral-600 shrink-0" />
                            <span>Simulasi Kuis Interaktif (Playable Preview)</span>
                          </div>
                          
                          <p className="text-xs font-bold text-forest-950 leading-relaxed bg-white p-3 rounded-xl border border-neutral-100/60 shadow-2xs">
                            {prompt.quizData.question}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {prompt.quizData.options.map((opt, optIdx) => {
                              const optionLetter = opt.trim().substring(0, 1).toUpperCase(); // 'A', 'B', 'C', 'D'
                              const isSelected = selectedAnswers[index] === optionLetter;
                              const isCorrect = optionLetter === prompt.quizData?.correctAnswer;
                              const hasAnswered = selectedAnswers[index] !== undefined;
                              
                              let buttonStyle = "bg-white border-neutral-100 hover:border-forest-700/30 hover:bg-forest-50/20 text-neutral-700";
                              if (isSelected) {
                                if (isCorrect) {
                                  buttonStyle = "bg-green-50 border-green-600 text-green-900 ring-2 ring-green-100 font-semibold";
                                } else {
                                  buttonStyle = "bg-red-50 border-red-500 text-red-900 ring-2 ring-red-100 font-semibold";
                                }
                              } else if (hasAnswered && isCorrect) {
                                buttonStyle = "bg-green-50/40 border-green-400 text-green-900 border-dashed font-semibold";
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={hasAnswered}
                                  onClick={() => handleSelectAnswer(index, optionLetter)}
                                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${buttonStyle} ${!hasAnswered ? 'cursor-pointer' : 'opacity-80'}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {selectedAnswers[index] !== undefined && (
                            <div className={`p-4 rounded-xl text-[11px] leading-relaxed flex items-start gap-2.5 animate-fade-in ${
                              selectedAnswers[index] === prompt.quizData.correctAnswer 
                                ? 'bg-green-50 border border-green-200 text-green-900' 
                                : 'bg-red-50 border border-red-200 text-red-900'
                            }`}>
                              <span className="text-base shrink-0 mt-0.5">
                                {selectedAnswers[index] === prompt.quizData.correctAnswer ? "🎉" : "💡"}
                              </span>
                              <div>
                                <p className="font-bold">
                                  {selectedAnswers[index] === prompt.quizData.correctAnswer ? "Luar Biasa, Jawaban Anda Benar!" : "Belum Tepat, Mari Kita Pelajari!"}
                                </p>
                                <p className="mt-1 text-neutral-600">{prompt.quizData.explanation}</p>
                                
                                <button
                                  onClick={() => handleResetAnswer(index)}
                                  className="mt-3.5 text-[10px] font-bold text-forest-900 hover:text-forest-950 underline flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  Ulangi Pertanyaan
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Floating Quick Canva Tutorial card */}
            <div className="bg-forest-900 text-white rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-forest-950">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold font-display flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-yellow-300" /> Bagaimana Cara Menggunakan Prompt Ini?
                </h3>
                <p className="text-xs text-forest-100/90 leading-relaxed max-w-2xl">
                  Langkah Mudah: 1) Salin prompt visual dari salah satu slide di atas. 2) Masuk ke <strong>Canva</strong>, buat desain baru (misal: Presentasi Pendidikan). 3) Buka tab &ldquo;Aplikasi&rdquo; lalu pilih &ldquo;Media Ajaib (Magic Media)&rdquo;. 4) Tempel prompt, pilih rasio yang sesuai, dan klik buat. Masukkan visual hasil AI ke background slide Anda!
                </p>
              </div>
              <button 
                onClick={() => window.open('https://canva.com', '_blank')} 
                className="px-5 py-3 bg-coral-600 hover:bg-coral-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer hover:shadow-coral-600/30 active:scale-95"
              >
                Buka Canva <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </main>

      {/* MODAL KONFIRMASI CEK ISI MATERI UNGGAHAN */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#FAF6EE] border border-[#E8DEC8] rounded-3xl max-w-2xl w-full shadow-2xl p-6 md:p-8 flex flex-col gap-5 text-forest-950 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button 
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-forest-900 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-3 border-b border-neutral-200/60 pb-4">
              <div className="p-3 bg-forest-900 text-white rounded-2xl shadow-sm shrink-0">
                <Eye className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-coral-600 font-mono uppercase tracking-wider">
                  Verifikasi Naskah & Ekstraksi AI
                </span>
                <h3 className="text-xl font-bold text-forest-950 font-display">
                  Konfirmasi & Cek Isi Materi yang Di-Upload
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                  Periksa judul dan naskah hasil pembacaan dokumen. Anda dapat mengoreksi judul jika dirasa berbeda dari isi file asli Anda.
                </p>
              </div>
            </div>

            {/* Section 1: Detected & Editable Topic/Title */}
            <div className="flex flex-col gap-1.5 bg-white p-4 rounded-2xl border border-neutral-200/70 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-forest-900 uppercase">
                  Judul / Topik Terdeteksi dari Dokumen
                </label>
                <span className="text-[10px] text-coral-600 font-semibold">*Dapat diedit langsung</span>
              </div>
              <input 
                type="text"
                value={confirmTitle}
                onChange={(e) => setConfirmTitle(e.target.value)}
                placeholder="Masukkan judul materi pembelajaran yang sesuai..."
                className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-forest-700 bg-neutral-50/40 text-forest-950"
              />
              <p className="text-[11px] text-neutral-500">
                💡 <em>Tip Guru:</em> Jika judul otomatis dari file kurang pas, ketikkan judul materi yang Anda inginkan di kolom ini.
              </p>
            </div>

            {/* Section 2: Recommended Age Group */}
            <div className="flex flex-col gap-1.5 bg-white p-4 rounded-2xl border border-neutral-200/70 shadow-2xs">
              <label className="text-xs font-bold text-forest-900 uppercase">
                Target Usia Siswa (Rekomendasi)
              </label>
              <select
                value={confirmAgeGroup}
                onChange={(e) => setConfirmAgeGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-forest-700 bg-white"
              >
                {AGE_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>

            {/* Section 3: Summary of Understood Content */}
            <div className="flex flex-col gap-1.5 bg-white p-4 rounded-2xl border border-neutral-200/70 shadow-2xs">
              <label className="text-xs font-bold text-forest-900 uppercase">
                Ringkasan Pemahaman Dokumen
              </label>
              <textarea
                rows={2}
                value={confirmSummary}
                onChange={(e) => setConfirmSummary(e.target.value)}
                className="w-full p-3 text-xs leading-relaxed rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-forest-700 bg-neutral-50/40 text-neutral-700"
              />
            </div>

            {/* Section 4: Clean Text Preview (No Binary Artifacts) */}
            <div className="flex flex-col gap-1.5 bg-white p-4 rounded-2xl border border-neutral-200/70 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-forest-900 uppercase flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-forest-700" /> Pratinjau Teks Bersih Dokumen (Clean Text)
                </label>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-bold">
                  {extractedCleanText.length} Karakter &middot; 100% Bebas Kode Biner
                </span>
              </div>
              <textarea
                rows={5}
                value={extractedCleanText}
                onChange={(e) => setExtractedCleanText(e.target.value)}
                placeholder="Teks naskah materi yang diekstrak akan muncul di sini..."
                className="w-full p-3 text-xs font-mono rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-forest-700 bg-neutral-50/70 text-neutral-800 leading-relaxed"
              />
              <p className="text-[10px] text-neutral-400 italic">
                *Teks di atas telah dibersihkan secara otomatis dari metadata '%PDF', '0 obj', atau karakter biner lainnya.
              </p>
            </div>

            {/* Section 5: Structure Choice (13 Standard vs Document Chapters) */}
            <div className="flex flex-col gap-2 bg-forest-50/70 p-4 rounded-2xl border border-forest-200/60">
              <label className="text-xs font-bold text-forest-900 uppercase">
                Pilihan Struktur Slide Media Pembelajaran:
              </label>
              
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input 
                  type="radio" 
                  name="structChoice" 
                  value="standard13"
                  checked={confirmStructureChoice === 'standard13'}
                  onChange={() => setConfirmStructureChoice('standard13')}
                  className="mt-0.5 accent-coral-600"
                />
                <div>
                  <strong className="text-forest-950 block">Gunakan Standar 13 Alur EduSmart Lab (Direkomendasikan)</strong>
                  <span className="text-[11px] text-neutral-600 leading-snug block mt-0.5">
                    Menyusun alur lengkap: Cover, Navigasi, Tujuan, Apersepsi, Peta 4 Kuis, Kuis 1 s/d 4 (4 pertanyaan interaktif), Respon Benar, Respon Salah, Rangkuman, & Penutup.
                  </span>
                </div>
              </label>

              {detectedDocumentPages.length > 0 && (
                <label className="flex items-start gap-2.5 cursor-pointer text-xs pt-2 border-t border-forest-200/40">
                  <input 
                    type="radio" 
                    name="structChoice" 
                    value="customDoc"
                    checked={confirmStructureChoice === 'customDoc'}
                    onChange={() => setConfirmStructureChoice('customDoc')}
                    className="mt-0.5 accent-coral-600"
                  />
                  <div>
                    <strong className="text-forest-950 block">Gunakan Bab Terdeteksi Dokumen ({detectedDocumentPages.length} Slide)</strong>
                    <span className="text-[11px] text-neutral-600 leading-snug block mt-0.5">
                      Struktur disesuaikan dengan heading/sub-bab yang ditemukan langsung di dalam naskah file Anda.
                    </span>
                  </div>
                </label>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Tutup / Batal
              </button>
              <button
                type="button"
                onClick={applyConfirmedMaterial}
                className="px-6 py-2.5 bg-coral-600 hover:bg-coral-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2 active:scale-95"
              >
                <Check className="w-4 h-4 text-white" /> Konfirmasi & Terapkan Materi ke EduSmart Lab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#FAF6EE] mt-12 py-8 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 EduSmart Lab - Media Pembelajaran Interaktif. Semua Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="text-forest-800 font-semibold">Dibuat khusus untuk Pendidik Indonesia Berdaya</span>
            <span className="text-neutral-300">|</span>
            <span className="text-neutral-400 font-mono">Powered by Google Gemini 3.8</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
