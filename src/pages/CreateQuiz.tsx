import { useNavigate, useSearchParams } from "react-router-dom";
import "../scss/createQuiz.scss";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  QuestionOrder,
  BookWithBookId,
  BooksWithUID,
  Question,
} from "../interfaces/Interfaces";
import {
  createData,
  getUidFromId,
  readBooksData,
} from "../firebase/firebaseCRUD";
import { auth } from "../firebase/firebase";
import { SearchBarModifyBookCard } from "../components/SearchBarModifyBookCard";
import { AdjustQuizQuestions } from "../components/AdjustQuizQuestions";
import { createARandomIdWithInitial } from "../functions/createRandomNumberId";

export const CreateQuiz = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toggleNext, setToggleNext] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [books, setBooks] = useState<BookWithBookId[]>([]);
  const [booksWithUID, setBooksWithUID] = useState<BooksWithUID[] | undefined>(
    []
  );
  const [questionOrder, setQuestionOrder] = useState<QuestionOrder>({});

  const [searchResults, setSearchResults] = useState<
    BooksWithUID[] | undefined
  >([]);
  const [isGrouped, setIsGrouped] = useState(false);
  const [step, setStep] = useState(1);
  let loadedBooks: string[] = [];
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [quizId, setQuizId] = useState<string>("");
  const [slideNumberOfQuestions, setSlideNumberOfQuestions] = useState(0);
  const [togglePreferences, setTogglePreferences] = useState(false);
  const [toggleBundleBooks, setToggleBundleBooks] = useState(false);
  const [toggleBundleTypes, setToggleBundleTypes] = useState(false);
  const [slideNumberOfPlotQuestion, setSlideNumberOfPlotQuestion] = useState(0);
  const [slideNumberOfDialogueQuestion, setSlideNumberOfDialogueQuestion] =
    useState(0);
  const [slideNumberOfVocabularyQuestion, setSlideNumberOfVocabularyQuestion] =
    useState(0);
  const [slideNumberOfSettingQuestion, setSlideNumberOfSettingQuestion] =
    useState(0);
  const [slideNumberOfCharactersQuestion, setSlideNumberOfCharactersQuestion] =
    useState(0);
  useEffect(() => {
    setQuizId(createARandomIdWithInitial("QZ", 7));
  }, []);

  useEffect(() => {
    searchParams.delete("stage");
    searchParams.delete("search");
    setSearchParams(searchParams);
    readBooksData().then((res) => {
      setBooks(res.message.books);
      setBooksWithUID([]);
      setSearchResults([]);
      if (books.length > 0) {
        books.map((book: any) => {
          getUidFromId("books", "bookId", book.bookId).then((res) => {
            const bookUID = res.message;
            const newBookObject = {
              bookUID: bookUID,
              bookId: book.bookId,
              bookName: book.bookName,
              stage: book.stage || "",
            };
            setBooksWithUID((booksWithUID) => [
              ...(booksWithUID ? booksWithUID : []),
              newBookObject,
            ]);

            setSearchResults((searchResults) => [
              ...(searchResults ? searchResults : []),
              newBookObject,
            ]);
          });
        });
      }
    });
  }, [auth, step]);

  useEffect(() => {
    if (selectedBooks.length === 5) {
      toast.info("You can pick 5 books Maximum", {
        autoClose: 1500,
      });
    }
  }, [selectedBooks]);

  useEffect(() => {
    if (togglePreferences) {
      setSlideNumberOfQuestions(
        slideNumberOfPlotQuestion +
          slideNumberOfDialogueQuestion +
          slideNumberOfVocabularyQuestion +
          slideNumberOfSettingQuestion +
          slideNumberOfCharactersQuestion
      );
    }
  }, [
    slideNumberOfPlotQuestion,
    slideNumberOfDialogueQuestion,
    slideNumberOfVocabularyQuestion,
    slideNumberOfSettingQuestion,
    slideNumberOfCharactersQuestion,
  ]);

  useEffect(() => {
    if (!togglePreferences) {
      setSlideNumberOfPlotQuestion(Math.round(slideNumberOfQuestions / 5));
      setSlideNumberOfDialogueQuestion(Math.round(slideNumberOfQuestions / 5));
      setSlideNumberOfSettingQuestion(Math.round(slideNumberOfQuestions / 5));
      setSlideNumberOfCharactersQuestion(
        Math.round(slideNumberOfQuestions / 5)
      );

      setSlideNumberOfVocabularyQuestion(
        Math.round(slideNumberOfQuestions / 5)
      );
    }
  }, [slideNumberOfQuestions]);
  return (
    <div className="create-quiz-container">
      <div className="create-quiz-header">
        <h2 className="create-quiz-name">Create Quiz</h2>
        <h2 className="quiz-id">{step === 1 ? quizId : quizName}</h2>
        <button
          className="back-button"
          onClick={() => {
            navigate("/");
          }}
        >
          Go back
        </button>
      </div>

      {step === 1 && (
        <div className="container create-quiz-name-div">
          <label
            htmlFor="create-quiz-input"
            className="create-quiz-name-label container-header-text"
          >
            Quiz Name
          </label>
          <input
            type="text"
            maxLength={45}
            id="create-quiz-input"
            name="create-quiz-input"
            placeholder="Quiz Name"
            defaultValue={quizName}
            onChange={(event) => {
              setQuizName(event.target.value);
              if (event.target.value.trim().length >= 3) {
                setToggleNext(true);
              } else {
                setToggleNext(false);
              }
            }}
          />
          <button
            className={`btn-next ${
              toggleNext ? "btn-next-enabled" : "btn-next-disabled"
            }`}
            name="btn-next-step-1"
            onClick={() => {
              if (toggleNext) {
                setStep(step + 1);
                setToggleNext(false);
              } else {
                toast.error("Quiz Name is Too short");
              }
            }}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="container choose-books-container">
          <div className="container-header choose-books-header">
            <h2 className="container-header-text choose-books-header-text">
              {" "}
              Choose books or your questionaires
            </h2>
            <div className="header-buttons">
              <button
                name="btn-previous-step-2"
                className="btn-previous"
                onClick={() => {
                  setStep(step - 1);
                  setToggleNext(true);
                }}
              >
                Previous
              </button>
              <button
                name="btn-next-step-2"
                className={`btn-next ${
                  selectedBooks.length > 0
                    ? "btn-next-enabled"
                    : "btn-next-disabled"
                }`}
                onClick={() => {
                  if (toggleNext || selectedBooks.length > 0) {
                    setStep(step + 1);
                    setToggleNext(false);
                    searchParams.delete("stage");
                    searchParams.delete("search");
                    setSearchParams(searchParams);
                  }
                }}
              >
                Next
              </button>
            </div>
          </div>
          <div className="search-bar-container-create-quiz">
            <SearchBarModifyBookCard
              booksObject={booksWithUID}
              setBooksObject={setBooksWithUID}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              isGrouped={isGrouped}
              setIsGrouped={setIsGrouped}
            />
          </div>
          <div className="books-list">
            <div className="book-list-header">
              <span className="book-list-select">
                Select
                {selectedBooks.length > 0 && (
                  <span>({selectedBooks.length})</span>
                )}
              </span>

              <span className="book-list-book-name">Book Name</span>
              <span className="book-list-stage">Stage</span>
            </div>
            <div className="book-list-columns">
              {searchResults?.map((book) => {
                if (!loadedBooks.includes(book.bookId)) {
                  loadedBooks.push(book.bookId);

                  return (
                    <div
                      className="book-list-column"
                      key={`div-${book.bookId}`}
                    >
                      <div className="book-list-select">
                        <input
                          type="checkbox"
                          defaultChecked={selectedBooks.includes(book.bookId)}
                          id={`select-${book.bookId}`}
                          key={`select-${book.bookId}`}
                          className="book-select-input"
                          value={book.bookId}
                          disabled={
                            selectedBooks.length >= 5 &&
                            !selectedBooks.includes(book.bookId)
                          }
                          onClick={(e) => {
                            const isChecked = (e.target as HTMLInputElement)
                              .checked;

                            if (isChecked) {
                              if (selectedBooks.length < 5) {
                                setSelectedBooks((selectedBooks) => [
                                  ...selectedBooks,
                                  book.bookId,
                                ]);
                                setToggleNext(true);
                              }
                            } else {
                              setSelectedBooks(
                                selectedBooks.filter((sb) => {
                                  return sb !== book.bookId;
                                })
                              );
                            }
                          }}
                        />
                      </div>
                      <span className="book-list-book-name">
                        {book.bookName}
                      </span>
                      <span className="book-list-stage"> {book.stage}</span>
                    </div>
                  );
                }
              })}
              {searchResults?.length === 0 && (
                <div className="no-books-found">No books found</div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="container adjust-questions-container">
          <div className="container-header adjust-questions-header">
            <h2 className="container-header-text adjust-questions-header-text">
              {" "}
              Selet types of questions
            </h2>
            <div className="header-buttons">
              <button
                name="btn-previous-step-2"
                className="btn-previous"
                onClick={() => {
                  setStep(step - 1);
                  setToggleNext(true);
                  searchParams.delete("stage");
                  searchParams.delete("search");
                  setSearchParams(searchParams);
                }}
              >
                Previous
              </button>
              <button
                name="btn-next-step-2"
                className={`btn-next ${
                  slideNumberOfQuestions > 0
                    ? "btn-next-enabled"
                    : "btn-next-disabled"
                }`}
                onClick={() => {
                  if (slideNumberOfQuestions > 0) {
                    setStep(step + 1);
                  }
                }}
              >
                Next
              </button>
            </div>
          </div>

          <div className="adjust-questions-body container-body ">
            <div className="div-number-of-questions">
              <div className="slidecontainer">
                <label htmlFor="number-of-question-range">
                  Number of Total questions
                </label>
                <div className="div-slider">
                  <input
                    type="range"
                    min={0}
                    max={selectedBooks.length * 50}
                    value={slideNumberOfQuestions}
                    className="slider-number-of-questions"
                    id="number-of-question-range"
                    disabled={togglePreferences}
                    step={5}
                    onChange={(e) => {
                      setSlideNumberOfQuestions(parseInt(e.target.value));
                    }}
                  />
                  <span className="slider-number">
                    {slideNumberOfQuestions}
                  </span>
                </div>
              </div>
            </div>
            <div className="div-complete-random-questions ">
              <input
                type="checkbox"
                id="randomize-completely"
                className="checkbox-randomise-completely"
                defaultChecked={true}
                onChange={(e) => {
                  setTogglePreferences(!e.target.checked);
                }}
              />
              <label
                htmlFor="randomize-completely"
                className="label-randomise-completely"
              >
                Randomize questions completely
              </label>
            </div>
            <div
              className={`div-question-types ${
                togglePreferences ? "" : "container-disabled"
              }`}
            >
              <h3 className="question-types-header">Question types</h3>
              <div className="question-types-slide-div">
                <div className="question-type-slide-group">
                  <label htmlFor="slide-number-of-plot-questions">Plot</label>
                  <input
                    type="range"
                    min={0}
                    max={selectedBooks.length * 10}
                    id=""
                    name="slide-number-of-plot-questions"
                    disabled={!togglePreferences}
                    value={slideNumberOfPlotQuestion}
                    onChange={(e) => {
                      setSlideNumberOfPlotQuestion(parseInt(e.target.value));
                    }}
                  />
                  <span className="select-group-">
                    {slideNumberOfPlotQuestion}
                  </span>
                </div>
                <div className="question-type-slide-group">
                  <label
                    htmlFor="slide-number-of-dialogue-questions"
                    className="slide-group-label"
                  >
                    Dialogue
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={selectedBooks.length * 10}
                    id=""
                    disabled={!togglePreferences}
                    value={slideNumberOfDialogueQuestion}
                    name="slide-number-of-dialogue-questions"
                    onChange={(e) => {
                      setSlideNumberOfDialogueQuestion(
                        parseInt(e.target.value)
                      );
                    }}
                  />
                  <span className="select-group-">
                    {slideNumberOfDialogueQuestion}
                  </span>
                </div>

                <div className="question-type-slide-group">
                  <label
                    htmlFor="slide-number-of-vocabulary-questions"
                    className="slide-group-label"
                  >
                    Vocabulary
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={selectedBooks.length * 10}
                    id=""
                    disabled={!togglePreferences}
                    name="slide-number-of-vocabulary-questions"
                    value={slideNumberOfVocabularyQuestion}
                    onChange={(e) => {
                      setSlideNumberOfVocabularyQuestion(
                        parseInt(e.target.value)
                      );
                    }}
                  />
                  <span className="select-group-">
                    {slideNumberOfVocabularyQuestion}
                  </span>
                </div>

                <div className="question-type-slide-group">
                  <label
                    htmlFor="slide-number-of-setting-questions"
                    className="slide-group-label"
                  >
                    Setting
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={selectedBooks.length * 10}
                    id=""
                    disabled={!togglePreferences}
                    name="slide-number-of-setting-questions"
                    value={slideNumberOfSettingQuestion}
                    onChange={(e) => {
                      setSlideNumberOfSettingQuestion(parseInt(e.target.value));
                    }}
                  />
                  <span className="select-group-">
                    {slideNumberOfSettingQuestion}
                  </span>
                </div>

                <div className="question-type-slide-group">
                  <label
                    htmlFor="slide-number-of-characters-questions"
                    className="slide-group-label"
                  >
                    Characters
                  </label>
                  <input
                    type="range"
                    min={0}
                    disabled={!togglePreferences}
                    max={selectedBooks.length * 10}
                    id=""
                    name="slide-number-of-characters-questions"
                    value={slideNumberOfCharactersQuestion}
                    onChange={(e) => {
                      setSlideNumberOfCharactersQuestion(
                        parseInt(e.target.value)
                      );
                    }}
                  />
                  <span className="select-group-">
                    {slideNumberOfCharactersQuestion}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="container final-adjustments-container">
          <div className="container-header final-adjustments-header">
            <h2 className="container-header-text final-adjustments-header-text">
              {" "}
              Final adjustments
            </h2>
            <div className="header-buttons">
              <button
                name="btn-previous-step-2"
                className="btn-previous"
                onClick={() => {
                  setStep(step - 1);
                  setToggleNext(true);
                  searchParams.delete("stage");
                  searchParams.delete("search");
                  setSearchParams(searchParams);
                }}
              >
                Previous
              </button>
              <button
                name="btn-next-step-2"
                className={`btn-next ${
                  slideNumberOfQuestions > 0
                    ? "btn-next-enabled"
                    : "btn-next-disabled"
                }`}
                onClick={() => {
                  if (slideNumberOfQuestions > 0) {
                    setStep(step + 1);
                  }
                }}
              >
                Generate
              </button>
            </div>
          </div>

          <div className="final-adjustments-body container-body ">
            <div className="checkbox-groups">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="checkbox-seperate-questions-by-books"
                  checked={toggleBundleBooks}
                  onChange={(e) => {
                    setToggleBundleBooks(e.target.checked);
                  }}
                />
                <label htmlFor="checkbox-seperate-questions-by-books">
                  Seperate questions by books
                </label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="checkbox-seperate-questions-by-types"
                  checked={toggleBundleTypes}
                  onChange={(e) => {
                    setToggleBundleTypes(e.target.checked);
                  }}
                />
                <label htmlFor="checkbox-seperate-questions-by-types">
                  Seperate questions by question types
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="container see-random-questions-container">
          <div className="container-header final-adjustments-header">
            <h2 className="container-header-text final-adjustments-header-text">
              {" "}
              Adjust Questions
            </h2>
            <div className="header-buttons">
              <button
                name="btn-previous-step-2"
                className="btn-previous"
                onClick={() => {
                  setStep(step - 1);
                  setToggleNext(true);
                  searchParams.delete("stage");
                  searchParams.delete("search");
                  setSearchParams(searchParams);
                }}
              >
                Previous
              </button>
              <button
                name="btn-next-step-2"
                className={`btn-next ${
                  slideNumberOfQuestions > 0
                    ? "btn-next-enabled"
                    : "btn-next-disabled"
                }`}
                onClick={() => {
                  Object.keys(questionOrder).map((k: string) => {
                    const currentQuestionObject = questionOrder[parseInt(k)];
                    const quizQuestionId = createARandomIdWithInitial("QQ", 7);
                    createData("quizQuestions", {
                      quizId: quizId,
                      questionIndex: k,
                      sourceQuestionId: currentQuestionObject.questionId,
                      quizQuestionId: quizQuestionId,
                      author: auth.currentUser?.uid,
                      dateCreated: Date().toLocaleString(),
                      lastUpdated: Date().toLocaleString(),
                    }).then((res) => {
                      if (res.status === 200) {
                        toast.success("Question has been added successfully!", {
                          autoClose: 600,
                        });
                      } else {
                        toast.success(
                          "Something went wrong! Please refresh the page and try again!",
                          {
                            autoClose: 600,
                          }
                        );
                      }
                    });
                  });

                  createData("quizzes", {
                    quizId: quizId,
                    quizName: quizName,
                    numberOfQuestions: slideNumberOfQuestions,
                    author: auth.currentUser?.uid,
                    dateCreated: Date().toLocaleString(),
                    lastUpdated: Date().toLocaleString(),
                  }).then((res) => {
                    if (res.status === 200) {
                      toast.success("Quiz has been created successfully!", {
                        autoClose: 2000,
                      });
                    } else {
                      toast.success(
                        "Something went wrong! Please refresh the page and try again!",
                        {
                          autoClose: 2500,
                        }
                      );
                    }
                  });
                }}
              >
                Complete
              </button>
            </div>
          </div>

          <div className="final-adjustments-body container-body ">
            <AdjustQuizQuestions
              selectedBooks={selectedBooks}
              booksObject={books.filter((book) => {
                return selectedBooks.includes(book.bookId);
              })}
              togglePreferences={togglePreferences}
              plot={slideNumberOfPlotQuestion}
              vocabulary={slideNumberOfVocabularyQuestion}
              characters={slideNumberOfCharactersQuestion}
              setting={slideNumberOfSettingQuestion}
              dialogue={slideNumberOfDialogueQuestion}
              total={slideNumberOfQuestions}
              quizId={quizId}
              quizName={quizName}
              bundleBooks={toggleBundleBooks}
              bundleTypes={toggleBundleTypes}
              questionOrder={questionOrder}
              setQuestionOrder={setQuestionOrder}
            />
          </div>
        </div>
      )}
    </div>
  );
};
