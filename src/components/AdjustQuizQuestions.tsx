import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  QuestionOrder,
  BookWithBookId,
  QuestionWithId,
  QuizQuestion,
} from "../interfaces/Interfaces";
import { auth } from "../firebase/firebase";

import { readQuestions } from "../firebase/firebaseCRUD";
import { AdjustQuizQuestion } from "./AdjustQuizQuestion";
import { rejects } from "assert";

export const AdjustQuizQuestions = (props: {
  selectedBooks: string[];
  booksObject: BookWithBookId[];
  togglePreferences: boolean;
  plot: number;
  vocabulary: number;
  characters: number;
  setting: number;
  dialogue: number;
  total: number;
  quizId: string;
  quizName: string;
  bundleBooks: boolean;
  bundleTypes: boolean;
  questionOrder: QuestionOrder;
  setQuestionOrder: Dispatch<SetStateAction<QuestionOrder>>;
}) => {
  const selectedBooks = props.selectedBooks;
  const booksObject = props.booksObject;
  const togglePreferences = props.togglePreferences;
  const plot = props.plot;
  const vocabulary = props.vocabulary;
  const characters = props.characters;
  const setting = props.setting;
  const dialogue = props.dialogue;
  const total = props.total;
  const quizId = props.quizId;
  const quizName = props.quizName;
  const bundleBooks = props.bundleBooks;
  const bundleTypes = props.bundleTypes;

  const [cloudQuestions, setCloudQuestions] = useState<QuestionWithId[]>([]);
  const [randomQuestions, setRandomQuestions] = useState<string[]>([]);
  const [quizQuestions, setQuestions] = useState<QuizQuestion[]>([]);
  const [bundle, setBundle] = useState<any>({});
  const [bookArea, setBookArea] = useState<any>();
  const types = ["Setting", "Characters", "Dialogue", "Vocabulary", "Plot"];
  let questionNumber = -1;
  const questionOrder = props.questionOrder;
  const setQuestionOrder = props.setQuestionOrder;

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const loadAllQuestions = (): Promise<{
    status: string;
    message: QuestionWithId[];
  }> => {
    return new Promise(async (resolve, reject) => {
      try {
        const tempQuestionsArray: QuestionWithId[] = [];

        const promises = selectedBooks.map((bookId) => {
          return readQuestions(bookId).then((res) => {
            return res.map((q: any) => {
              return q;
            });
          });
        });

        const results = await Promise.all(promises);

        results.forEach((res) => {
          tempQuestionsArray.push(...res);
        });

        resolve({ status: "200", message: tempQuestionsArray });
      } catch (error) {
        reject({ status: "400", message: "Couldn't load questions" });
      }
    });
  };

  const generateQuizQuestions = (
    questionArray: QuestionWithId[],
    max: number
  ): Promise<{
    status: string;
    message: string[];
  }> => {
    return new Promise(async (resolve, reject) => {
      try {
        const tempRandomArray: string[] = [];

        const promises = questionArray.map((quest) => {
          //   tempRandomArray.push(quest.questionId);
        });

        while (tempRandomArray.length < max) {
          const randomIndex = getRandomInt(questionArray.length);
          const randomItem = questionArray[randomIndex].questionId;
          if (!tempRandomArray.includes(randomItem)) {
            tempRandomArray.push(randomItem);
          }
        }

        tempRandomArray.map((tempRandomItem: string) => {
          const questionObject = questionArray.find((quest) => {
            return tempRandomItem === quest.questionId;
          });
        });

        await Promise.all(promises);

        resolve({
          status: "200",
          message: tempRandomArray,
        });
      } catch (error) {
        reject({
          status: "400",
          message: "Something went wrong, couldn't generate random quiz",
        });
      }
    });
  };

  const filterObjectArray = (array: any[], keyname: string, value: string) => {
    return array.filter((ar) => {
      return ar[keyname] === value;
    });
  };
  const findObjectArray = (array: any[], keyname: string, value: string) => {
    return array.find((ar) => {
      return ar[keyname] === value;
    });
  };
  interface BooksAreaObject {
    [bookId: string]: {
      [type: string]: string[];
    };
  }

  useEffect(() => {
    loadAllQuestions().then((res) => {
      if (res.status === "200") {
        setCloudQuestions(res.message);
        const tempCloudQuestions = res.message;

        if (togglePreferences) {
          const typeLength: {
            [key: string]: number;
            Setting: number;
            Characters: number;
            Dialogue: number;
            Vocabulary: number;
            Plot: number;
          } = {
            Setting: setting,
            Characters: characters,
            Dialogue: dialogue,
            Vocabulary: vocabulary,
            Plot: plot,
          };

          setRandomQuestions([]);
          types.map((questionType) => {
            generateQuizQuestions(
              tempCloudQuestions.filter((quest) => {
                return quest.type === questionType;
              }),
              typeLength[questionType]
            ).then((res2) => {
              res2.message.map((rand) => {
                setRandomQuestions((randomQuestions) => [
                  ...randomQuestions,
                  rand,
                ]);
              });
            });
          });
        } else {
          generateQuizQuestions(tempCloudQuestions, total).then((res2) => {
            if (res2.status === "200") {
              setRandomQuestions(res2.message);
            }
          });
        }
      }
    });
  }, [auth]);

  useEffect(() => {
    let booksAreaObject: BooksAreaObject = {};

    selectedBooks.map((tempBookId: string) => {
      let bookAreaObject: {
        [type: string]: string[];
      } = {};
      let bookAreaQuestions = filterObjectArray(
        cloudQuestions,
        "bookId",
        tempBookId
      );

      types.map((type) => {
        let typeAreaArray: string[] = [];
        let typeAreaQuestions = filterObjectArray(
          bookAreaQuestions,
          "type",
          type
        );

        Object.keys(typeAreaQuestions).map((typeObject) => {
          const currentTypeAreaQuestion =
            typeAreaQuestions[parseInt(typeObject)];
          typeAreaArray.push(currentTypeAreaQuestion.questionId);
        });
        bookAreaObject[type] = typeAreaArray;
      });

      booksAreaObject[tempBookId] = bookAreaObject;
    });
    setBookArea(booksAreaObject);
  }, [randomQuestions, auth]);

  return (
    <div className="question-cards">
      {!bundleBooks &&
        !bundleTypes &&
        randomQuestions.map((index, i = 0) => {
          return (
            <AdjustQuizQuestion
              key={index}
              cloudQuestions={cloudQuestions}
              randomIndex={index}
              randomQuestions={randomQuestions}
              setRandomQuestions={setRandomQuestions}
              i={i}
              numberOfDefaultQuestions={{
                plot: plot,
                vocabulary: vocabulary,
                setting: setting,
                characters: characters,
                dialogue: dialogue,
              }}
              togglePreferences={togglePreferences}
              bundleBook={bundleBooks}
              bundleType={bundleTypes}
              bookId=""
              typeId=""
              questionOrder={questionOrder}
              setQuestionOrder={setQuestionOrder}
            />
          );
        })}

      {(bundleBooks || bundleTypes) &&
        bookArea &&
        Object.keys(bookArea).map((bookId) => {
          return (
            <div key={"book-area-div-" + bookId}>
              {bundleBooks && (
                <h2>
                  {findObjectArray(booksObject, "bookId", bookId).bookName}
                </h2>
              )}

              <div className="question-types">
                {Object.keys(bookArea[bookId]).map((typeId) => {
                  return (
                    <div
                      className="type-area-div"
                      key={"type-area-div-" + bookId + "-" + typeId}
                    >
                      {bundleTypes && <h3>{typeId}</h3>}
                      <div
                        className="type-questions"
                        key={"questions-area-div-" + bookId + "-" + typeId}
                      >
                        {bookArea[bookId][typeId].map(
                          (questionId: string, i = 0) => {
                            if (randomQuestions.includes(questionId)) {
                              questionNumber = questionNumber + 1;
                            }
                            return (
                              <div key={"adjust-questions-" + questionId}>
                                {randomQuestions.includes(questionId) && (
                                  <AdjustQuizQuestion
                                    key={"question-" + questionId}
                                    cloudQuestions={cloudQuestions}
                                    randomIndex={questionId}
                                    randomQuestions={randomQuestions}
                                    setRandomQuestions={setRandomQuestions}
                                    i={questionNumber}
                                    numberOfDefaultQuestions={{
                                      plot: plot,
                                      vocabulary: vocabulary,
                                      setting: setting,
                                      characters: characters,
                                      dialogue: dialogue,
                                    }}
                                    togglePreferences={togglePreferences}
                                    bundleBook={bundleBooks}
                                    bundleType={bundleTypes}
                                    bookId={bookId}
                                    typeId={typeId}
                                    questionOrder={questionOrder}
                                    setQuestionOrder={setQuestionOrder}
                                  />
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      <button
        className="btn-complete"
        onClick={() => {
          if (!bundleBooks && !bundleTypes) {
            let uploadObject = {};

            console.log(quizQuestions);
          }
        }}
      >
        Complete
      </button>
    </div>
  );
};
