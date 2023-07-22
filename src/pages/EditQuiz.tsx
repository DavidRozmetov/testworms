import { useEffect, useState } from "react";
import { EditQuizNavBar } from "../components/EditQuizNavBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "../scss/editQuiz.scss";
import {
  deleteData,
  getUidFromId,
  readDataFromUser,
} from "../firebase/firebaseCRUD";
import { ModifyQuizQuestion } from "../components/ModifyQuizQuestion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { QuizQuestion } from "../interfaces/Interfaces";

export const EditQuiz = () => {
  const [user, setUser] = useState<any>();
  const [quiz, setQuiz] = useState<{
    quizId: string;
    quizName: string;
    author: string;
    dateCreated: string;
    lastUpdated: string;
    numberOfQuestions: number;
  }>();
  const [originalInfo, setOriginalInfo] = useState<{
    quizId: string;
    quizName: string;
    author: string;
    dateCreated: string;
    lastUpdated: string;
    numberOfQuestions: number;
  }>();
  const [quizId, setQuizId] = useState<string>();
  const [quizUID, setQuizUID] = useState<string>();
  const [quizQuestions, setQuizQuestions] = useState<{
    [key: string]: {
      author: string;
      dateCreated: string;
      lastUpdated: string;
      questionIndex: string;
      quizId: string;
      quizQuestionId: string;
      sourceQuestionId: string;
    };
  }>();

  const [sourceQuestions, setSourceQuestions] = useState<{
    [index: string]: {
      questionId: string;
      question: string;
      a: string;
      b: string;
      c: string;
      d: string;
      answer: string;
      type: string;
      bookId: string;
    };
  }>();

  const [matchedQuestions, setMatchedQuestions] = useState<
    | {
        uid: string;
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
      }[]
    | undefined
  >();

  const [originalQuestions, setOriginalQuestions] = useState<string[]>();
  const [toggleSave, setToggleSave] = useState(false);
  const [toggleAnswerKey, setToggleAnswerKey] = useState(false);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [saveList, setSaveList] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, () => {
      auth.currentUser && setUser(auth.currentUser);
      setQuizId(window.location.pathname.split("/")[2]);
    });
  }, []);

  useEffect(() => {
    quizId &&
      getUidFromId("quizzes", "quizId", quizId).then((res) => {
        setQuizUID(res.message);
        readDataFromUser("quizzes", "quizId", quizId).then((res2) => {
          if (typeof res2.message !== "string") {
            setQuiz(res2.message[res.message]);
            setOriginalInfo(res2.message[res.message].toString());
          }
        });
      });
  }, [quizId, auth]);

  useEffect(() => {
    quizId &&
      readDataFromUser("quizQuestions", "quizId", quizId).then((res) => {
        if (typeof res.message !== "string") {
          setQuizQuestions(res.message);
        }
      });
  }, [quiz]);

  useEffect(() => {
    quiz &&
      quizQuestions &&
      Object.keys(quizQuestions).map((quizQuestionUID) => {
        const currentQuizQuestion = quizQuestions[quizQuestionUID];

        let newData: QuizQuestion;

        readDataFromUser(
          "questions",
          "questionId",
          currentQuizQuestion.sourceQuestionId
        ).then((res3) => {
          if (typeof res3.message !== "string") {
            Object.keys(res3.message).map((srcQuestionUID) => {
              const CurrentSourceQuestionInfo: {
                questionId: string;
                question: string;
                a: string;
                b: string;
                c: string;
                d: string;
                answer: string;
                type: string;
                bookId: string;
              } =
                typeof res3.message !== "string" &&
                res3.message[srcQuestionUID];

              const currentMatchedQuestion = {
                uid: quizQuestionUID,
                author: currentQuizQuestion.author,
                dateCreated: currentQuizQuestion.dateCreated,
                lastUpdated: currentQuizQuestion.lastUpdated,
                questionIndex: currentQuizQuestion.questionIndex,
                quizId: currentQuizQuestion.quizId,
                quizQuestionId: currentQuizQuestion.quizQuestionId,
                sourceQuestionId: currentQuizQuestion.sourceQuestionId,
                type: CurrentSourceQuestionInfo.type,
                a: CurrentSourceQuestionInfo.a,
                b: CurrentSourceQuestionInfo.b,
                c: CurrentSourceQuestionInfo.c,
                d: CurrentSourceQuestionInfo.d,
                answer: CurrentSourceQuestionInfo.answer,
                bookId: CurrentSourceQuestionInfo.bookId,
              };

              setMatchedQuestions((currentData) => [
                ...(currentData || []),
                currentMatchedQuestion,
              ]);
            });
          }
        });
      });
  }, [quizQuestions]);

  useEffect(() => {
    matchedQuestions?.map((question) => {
      let temp = JSON.stringify(question);
      setOriginalQuestions((old) => [...(old || []), temp]);
    });
  }, [matchedQuestions]);

  useEffect(() => {
    const sortedKeys =
      quizQuestions &&
      Object.keys(quizQuestions).sort((a: string, b: string) => {
        return (
          parseInt(quizQuestions[a].questionIndex) -
          parseInt(quizQuestions[b].questionIndex)
        );
      });

    quizQuestions &&
      sortedKeys?.map((key) => {
        const srcQuestionId = quizQuestions[key].sourceQuestionId;
        readDataFromUser("questions", "questionId", srcQuestionId).then(
          (res) => {
            if (typeof res.message !== "string") {
              Object.keys(res.message).map((key2) => {
                // console.log(
                //   typeof res.message !== "string" && res.message[key2]
                // );
                const questionIndex = quizQuestions[key].questionIndex;

                const currentQuestion =
                  typeof res.message !== "string" && res.message[key2];

                setSourceQuestions((prevQuestions) => {
                  const nextQuestions = { ...prevQuestions }; // create a copy of the previous state
                  nextQuestions[questionIndex] = currentQuestion; // set the current question at the desired index
                  return nextQuestions; // return the updated state
                });
              });
            }
          }
        );
      });
  }, [quizQuestions]);

  return (
    <div className="edit-quiz-container">
      <EditQuizNavBar
        quizId={quiz?.quizName ? quiz?.quizName : ""}
        setToggleAnswerKey={setToggleAnswerKey}
        setToggleDelete={setToggleDelete}
        setToggleSave={setToggleSave}
        quizQuestions={quizQuestions}
        setQuizQuestions={setQuizQuestions}
        sourceQuestions={sourceQuestions}
        toggleSave={toggleSave}
        saveList={saveList}
      />
      <div className="edit-quiz-questions">
        {sourceQuestions &&
          Object.keys(sourceQuestions).map((index) => {
            const key: string = index + "";
            let uid = "";
            quizQuestions &&
              Object.keys(quizQuestions).map((quizQuestion) => {
                // console.log(quizQuestions[quizQuestion]);
              });
            return (
              <ModifyQuizQuestion
                key={key}
                uid={index}
                i={parseInt(index) - 1}
                question={sourceQuestions[key]}
                originalQuestion={JSON.parse(
                  JSON.stringify(sourceQuestions[key])
                )}
                quizQuestions={quizQuestions}
                setQuizQuestions={setQuizQuestions}
                saveList={saveList}
                setSaveList={setSaveList}
              />
            );
          })}
      </div>

      {toggleAnswerKey && (
        <div className="answer-key-container">
          <div
            className="answer-key-background"
            onClick={() => {
              setToggleAnswerKey(false);
            }}
          ></div>
          <div className="answer-key-content">
            <u>
              <h4>Quiz: {quiz?.quizName}</h4>
            </u>
            <ol className="answer-key-ordered-list">
              {sourceQuestions &&
                Object.keys(sourceQuestions).map((index) => {
                  const key: string = index + "";
                  return (
                    <li key={sourceQuestions[key].questionId}>
                      {sourceQuestions[key].answer}
                    </li>
                  );
                })}
            </ol>
          </div>
        </div>
      )}
      {toggleDelete && (
        <div className="delete-quiz-container">
          <div
            className="delete-quiz-background"
            onClick={() => {
              setToggleDelete(false);
            }}
          ></div>
          <div className="delete-quiz-content">
            <h3 className="header">
              Are you sure you want to delete <b>{quiz?.quizName}</b>?
            </h3>
            <div className="buttons">
              <button
                className="btn-delete"
                onClick={() => {
                  quizQuestions &&
                    Object.keys(quizQuestions).map((index) => {
                      const key: string = index + "";

                      deleteData("quizQuestions", key).then((res) => {
                        if (res.status === 200) {
                          toast.success("Question Deleted Successfully", {
                            autoClose: 700,
                          });
                        } else {
                          toast.success(
                            "Something went wrong! Please try again later",
                            {
                              autoClose: 1000,
                            }
                          );
                        }
                      });
                    });

                  quizUID &&
                    deleteData("quizzes", quizUID).then((res) => {
                      if (res.status === 200) {
                        toast.success("Quiz Has been deleted Successfully", {
                          autoClose: 1500,
                        });
                        navigate("/");
                      } else {
                        toast.success(
                          "Something went wrong! Please try again later",
                          {
                            autoClose: 1000,
                          }
                        );
                      }
                    });
                }}
              >
                Yes, delete
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setToggleDelete(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
