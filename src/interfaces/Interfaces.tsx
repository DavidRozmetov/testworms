export interface Book {
  questions: Record<string, unknown>;
  missingQuestions: never[];
  answerKey: Record<string, unknown>;
  bookName: string;
}

export interface BookWithBookId {
  questions: Record<string, unknown>;
  missingQuestions: never[];
  answerKey: Record<string, unknown>;
  bookName: string;
  bookId: string;
}

export interface Question {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  type: string;
  bookId: string;
  questionId: string;
}

export interface BooksWithUID {
  bookUID: string;
  bookId: string;
  bookName: string;
  stage: string | undefined;
}

export interface QuizQuestion {
  quizId: string;
  bookId: string;
  type: string;
  sourceQuestionId: string;
  createdAt: Date;
  author: string;
}

export interface QuestionWithId {
  questionId: string;
  question: string;
  answer: string;
  a: string;
  b: string;
  c: string;
  d: string;
  type: string;
  bookId: string;
}
export interface AdjustQuizQuestionProps {
  cloudQuestions: QuestionWithId[];
  randomIndex: string;
  randomQuestions: string[];
  setRandomQuestions: React.Dispatch<React.SetStateAction<string[]>>;
  i: number;
  numberOfDefaultQuestions: Record<string, number>;
  togglePreferences: (type: string) => void;
}

export interface QuizQuestionWithBook extends QuizQuestion {
  bookName: string;
}

export interface QuizQuestionWithBookAndType extends QuizQuestionWithBook {
  type: string;
}

export interface QuestionOrder {
  [questionIndex: number]: Question;
}

export interface QuizQuestion {
  author: string;
  dateCreated: string;
  lastUpdated: string;
  questionIndex: string;
  quizId: string;
  quizQuestionId: string;
  sourceQuestionId: string;
  type: string;
  a: string;
  b: string;
  c: string;
  d: string;
  answer: string;
  bookId: string;
}
