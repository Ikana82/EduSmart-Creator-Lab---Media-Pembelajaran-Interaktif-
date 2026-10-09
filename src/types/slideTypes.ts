export type SlideType = 
  | 'cover'
  | 'navigation'
  | 'guide'
  | 'apperception'
  | 'concept_map'
  | 'material'
  | 'video'
  | 'quiz'
  | 'feedback_correct'
  | 'feedback_incorrect'
  | 'summary_closing';

export interface ConceptMapNode {
  title: string;
  desc: string;
}

export interface ConceptMapData {
  centralConcept: string;
  subConcepts: ConceptMapNode[];
  connectingRelationships: string[];
}

export interface QuizQuestionData {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface SlideIdentity {
  slideId: string;
  index: number;
  slideType: SlideType;
  pageTitle: string;
  headerText: string;
  educationalObjective: string;
  visibleTexts: string[];
  slideContent: string[];
  cleanPrompt: string;
  midjourneyPrompt: string;
  illustrationDesc: string;
  canvaKeywords: string;
  navigationButtons: string;
  estimatedTime: string;
  quizData?: QuizQuestionData;
  conceptMapData?: ConceptMapData;
  videoPlaceholderTopic?: string;
  guidePoints?: Array<{ icon: string; title: string; desc: string }>;
}

/**
 * Route slide title and position to an explicit SlideType
 */
export function detectSlideType(pageTitle: string, index: number, totalSlides: number): SlideType {
  const t = (pageTitle || '').toLowerCase().trim();

  // 1. Cover
  if (index === 0 || t.includes('cover') || t.includes('sampul') || t.includes('halaman pembuka')) {
    return 'cover';
  }

  // 2. Navigation
  if (t.includes('navigasi') || t.includes('menu utama') || t.includes('pilih menu')) {
    return 'navigation';
  }

  // 3. Petunjuk / Guide
  if (t.includes('petunjuk') || t.includes('panduan') || t.includes('cara belajar') || t.includes('instruksi')) {
    return 'guide';
  }

  // 4. Apersepsi
  if (t.includes('apersepsi') || t.includes('pengantar') || t.includes('mari berpikir') || t.includes('mari mengamati') || t.includes('tahukah kamu') || t.includes('motivasi')) {
    return 'apperception';
  }

  // 5. Peta Konsep (Strict: not a checkpoint trail, but concept diagram / mind map)
  if (t.includes('peta konsep') || t.includes('konsep') || t.includes('mapping') || (t.includes('peta') && !t.includes('titik kuis'))) {
    return 'concept_map';
  }

  // 6. Video
  if (t.includes('video') || t.includes('tonton') || t.includes('animasi materi')) {
    return 'video';
  }

  // 7. Feedback responses
  if (t.includes('respon benar') || t.includes('jawaban benar') || t.includes('hebat') || t.includes('tepat')) {
    return 'feedback_correct';
  }
  if (t.includes('respon salah') || t.includes('jawaban salah') || t.includes('kurang tepat') || t.includes('coba lagi')) {
    return 'feedback_incorrect';
  }

  // 8. Quiz
  if (t.includes('kuis') || t.includes('soal') || t.includes('evaluasi') || t.includes('pertanyaan') || t.includes('latihan')) {
    return 'quiz';
  }

  // 9. Summary & Closing
  if (t.includes('rangkuman') || t.includes('summary') || t.includes('penutup') || t.includes('selesai') || index === totalSlides - 1) {
    return 'summary_closing';
  }

  // 10. Default is Material
  return 'material';
}
