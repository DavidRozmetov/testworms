export interface Book {
  questions: Record<string, unknown>;
  missingQuestions: never[];
  answerKey: Record<string, unknown>;
  bookName: string;
}

export interface Question {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  type: string;
}
