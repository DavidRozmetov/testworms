export interface Book {
  bookId: string;
  bookName: string;
  bookUID: string;
  stage?: number;
  thumbnailURL: string;
}

export interface BookData {
  status: number;
  message: Book[];
}

export interface Thumbnail {
  name: string;
  url: string;
}
