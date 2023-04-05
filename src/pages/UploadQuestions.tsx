import React, { useState } from "react";
import { BookCard } from "../components/BookCard";

import { readTxtFile } from "../functions/readTxtFile";
import "../scss/uploadQuestions.scss";
import { UploadQuestionsInfoBar } from "../components/UploadQuestionsInfoBar";

import { uploadBooksToTheCloud } from "../functions/uploadBooksToTheCloud";

import { toast } from "react-toastify";
import { createRandomNumberId } from "../functions/createRandomNumberId";
import { checkForTheSameName, createData } from "../firebase/firebaseCRUD";
import { Book, Question } from "../interfaces/Interfaces";
import { AiTwotoneEdit } from "react-icons/ai";

export const UploadQuestions = () => {
  const [expanded, setExpanded] = useState(false);
  const [questionsObject, setQuestionObject] = useState({
    questions: {},
    missingQuestions: [],
    answerKey: {},
    bookName: "",
  });

  const [booksArray, setBooksArray] = useState<Book[]>([]);
  const [failedBooks, setFailedBooks] = useState<string[]>([]);

  const isNotUploaded = (bookName: string) => {
    if (booksArray.find((book) => book.bookName === bookName)) {
      return false;
    }
    return true;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files as FileList;
    const fileArray = Array.from(fileList);

    try {
      let questionObjects = {
        questions: {},
        missingQuestions: [],
        answerKey: {},
        bookName: "",
      };
      for (const file of fileArray) {
        const result = await readTxtFile(file);

        questionObjects = result;
        if (Object.keys(result.questions).length !== 0) {
          if (isNotUploaded(result.bookName)) {
            setQuestionObject({
              questions: questionObjects.questions,
              missingQuestions: questionObjects.missingQuestions,
              bookName: questionObjects.bookName,
              answerKey: questionObjects.answerKey,
            });

            setBooksArray((booksArray) => [
              ...booksArray,
              {
                questions: questionObjects.questions,
                missingQuestions: questionObjects.missingQuestions,
                bookName: questionObjects.bookName,
                answerKey: questionObjects.answerKey,
              },
            ]);
          }
        } else {
          setFailedBooks((failedBooks) => [...failedBooks, result.bookName]);
          toast.error(
            "Something went wrong! Couldn't upload" + result.bookName,
            {
              autoClose: 1000,
            }
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpanded = (book: {
    questions: object;
    bookName: string;
    answerKey: object;
    missingQuestions: never[];
  }) => {
    setExpanded(true);
    setQuestionObject(book);
    renderBookCardsComponent(book);
  };

  const renderBookCardsComponent = (data: {
    questions: object;
    bookName: string;
    answerKey: object;
    missingQuestions: string[];
  }) => {
    if (Object.keys(data.questions).length > 0) {
      return (
        <BookCard
          key={data.bookName}
          book={data}
          answers={data.answerKey}
          missingQuestions={data.missingQuestions}
        ></BookCard>
      );
    } else {
      return <p>{data.bookName} could not be uploaded.</p>;
    }
  };

  const deleteBookFromData = (book: {
    questions: object;
    bookName: string;
    answerKey: object;
    missingQuestions: never[];
  }) => {
    // setFruits(oldValues => {
    //   return oldValues.filter(fruit => fruit !== value)
    // })

    setBooksArray((booksArray) => {
      console.log(booksArray);
      return booksArray.filter((bk) => bk.bookName !== book.bookName);
    });
    console.log(booksArray);
  };

  const renderBookButtons = (data: {
    questions: object;
    bookName: string;
    answerKey: object;
    missingQuestions: never[];
  }) => {
    if (Object.keys(data).length > 0) {
      return (
        <div className="book-button-div">
          <div onClick={() => toggleExpanded(data)} className="book-button">
            {Object.keys(data.questions).length > 0 ? data.bookName : "error"}
          </div>
          <button
            className="delete-book-button"
            onClick={(e) => {
              e.preventDefault();
              deleteBookFromData(data);
            }}
          >
            X
          </button>
        </div>
      );
    }
  };

  const createARandomIdWithInitial = (initial: string, idLength: number) => {
    return initial + createRandomNumberId(idLength);
  };

  return (
    <div className="div-upload upload-questions-page">
      <a href="modify-books" className="btn-go-to-modify-books">
        <AiTwotoneEdit className="icon-btn" />
        <span className="text-btn"> Modify Books</span>
      </a>
      <div className="div-upload-file">
        <input
          type="file"
          accept=".txt"
          id="file-input"
          className="custom-file-input"
          multiple
          onChange={handleFileChange}
        />
      </div>
      <UploadQuestionsInfoBar
        loadedBooks={booksArray.length}
        failedBooks={failedBooks}
      ></UploadQuestionsInfoBar>
      <div className="book-buttons">
        {booksArray.map((book: Book) => (
          <React.Fragment key={book.bookName}>
            {renderBookButtons({
              bookName: book.bookName,
              questions: book.questions,
              missingQuestions: book.missingQuestions,
              answerKey: book.answerKey,
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="div-submit-button">
        <button
          className="button-submit"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            booksArray.map(async (book) => {
              if ((await checkForTheSameName(book)) === false) {
                const bookData = {
                  bookId: createARandomIdWithInitial("B", 7),
                  bookName: book.bookName,
                };
                createData("books", bookData).then((res) => {
                  toast.success(
                    "The book '" +
                      bookData.bookName +
                      "' has been uploaded successuflly",
                    {
                      autoClose: 2000,
                    }
                  );
                  if (booksArray[booksArray.length - 1] === book) {
                    toast.info("All books have been uploaded");
                  }
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
                    type: question.type,
                  };
                  createData("questions", questionObject).then((res) => {});
                });
              } else {
                toast.error(
                  "The book '" + book.bookName + "' is already in the cloud!",
                  {
                    autoClose: 3000,
                  }
                );
                if (booksArray[booksArray.length - 1] === book) {
                  toast.info("All books have been uploaded");
                }
              }
            });
          }}
        >
          Upload the books
        </button>
      </div>
      <div
        className={`questions-component ${
          expanded
            ? "questions-component-expanded"
            : "questions-component-collapsed"
        }`}
      >
        <div id="book-page">{renderBookCardsComponent(questionsObject)}</div>
      </div>
    </div>
  );
};
