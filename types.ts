
export enum QuizMode {
  TREINO = "TREINO",
  PROVA = "PROVA"
}

export type AnswerType = "C" | "E" | null;

export interface Question {
  id: number;
  area: string;
  disciplina: string;
  assunto: string;
  enunciado: string;
  resposta_correta: "C" | "E";
  comentario: string;
}

export interface QuizData {
  banca: string;
  nivel: string;
  cargo: string;
  modo: QuizMode;
  pontuacao: {
    acerto: number;
    erro: number;
    em_branco: number;
  };
  questoes: Question[];
}

export interface UserAnswer {
  questionId: number;
  answer: AnswerType;
}

export interface QuizResults {
  totalQuestions: number;
  correct: number;
  incorrect: number;
  blank: number;
  finalScore: number;
}
