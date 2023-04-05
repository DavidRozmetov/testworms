import { GoogleAuthProvider } from "firebase/auth";
import { checkForTheSameName, createData } from "../firebase/firebaseCRUD";
import { Book, Question } from "../interfaces/Interfaces";
import { createRandomNumberId } from "./createRandomNumberId";

export const uploadBooksToTheCloud = (booksArray: Book[]) => {
  const createARandomIdWithInitial = (initial: string, idLength: number) => {
    return initial + createRandomNumberId(idLength);
  };

  booksArray.map(async (book) => {
    if ((await checkForTheSameName(book)) === false) {
      const bookData = {
        bookId: createARandomIdWithInitial("B", 7),
        bookName: book.bookName,
      };
      createData("books", bookData).then((res) => {
        console.log(res.message);
      });

      Object.keys(book.questions).map((questionIndex) => {
        const question = book.questions[questionIndex] as Question;
        const questionId = createARandomIdWithInitial("Q", 9);

        const questionObject = {
          questionId: questionId,
          bookId: bookData.bookId,
          question: question.question,
          a: question.a,
          b: question.b,
          c: question.c,
          d: question.d,
          answer: book.answerKey[questionIndex],
        };
        createData("questions", questionObject).then((res) => {
          console.log(res.message);
        });
      });
    } else {
      alert(book.bookName + " is already in the cloud!");
    }
  });
};
