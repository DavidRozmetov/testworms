import { useEffect, useState } from "react";
import {
  getUidFromId,
  readBookData,
  readQuestions,
  updateData,
} from "../firebase/firebaseCRUD";
import "../scss/modifyQuestions.scss";
import { IoIosArrowBack } from "react-icons/io";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { SearchBarModifyQuestions } from "../components/SearchBarModifyQuestions";
import { AiOutlineWarning } from "react-icons/ai";
export const ModifyQuestions = () => {
  const bookId = window.location.pathname.split("/").pop();
  const [originalQuestions, setOriginalQuestions] = useState<
    {
      question: string;
      a: string;
      b: string;
      c: string;
      d: string;
      answer: string;
      questionId: string;
      type: string;
    }[]
  >();

  const [questions, setQuestions] = useState<
    {
      question: string;
      a: string;
      b: string;
      c: string;
      d: string;
      answer: string;
      questionId: string;
      type: string;
    }[]
  >();

  const [bookData, setBookData] = useState<{
    bookId: string;
    bookName: string;
    stage: string;
  }>();

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const params = new URLSearchParams(document.location.search);
  useEffect(() => {
    bookId &&
      readQuestions(bookId).then((res) => {
        const deepCopy = JSON.parse(JSON.stringify(res));
        setQuestions(res);
        setOriginalQuestions(deepCopy);
      });
    bookId &&
      readBookData(bookId).then((res) => {
        setBookData(res);
      });
  }, []);

  const upDateQuestionsArray = (
    question: {
      question: string;
      a: string;
      b: string;
      c: string;
      d: string;
      answer: string;
      questionId: string;
      type: string;
    },

    keyName:
      | "question"
      | "a"
      | "b"
      | "c"
      | "d"
      | "answer"
      | "questionId"
      | "type",
    value: string
  ) => {
    let newObject = question;

    newObject[keyName] = value;

    let newQuestionsArray: {
      question: string;
      a: string;
      b: string;
      c: string;
      d: string;
      answer: string;
      questionId: string;
      type: string;
    }[] = [];

    const originalQuestion = originalQuestions?.find((oq) => {
      return oq.questionId == question.questionId;
    });
    questions?.map((q) => {
      if (JSON.stringify(q) === JSON.stringify(originalQuestion)) {
        newQuestionsArray.push(newObject);
      } else {
        newQuestionsArray.push(q);
      }
    });

    setQuestions(newQuestionsArray);
  };

  return (
    <div className="modify-questions-page">
      <div className="book-header">
        <h2 className="book-name">{bookData?.bookName}</h2>
        <SearchBarModifyQuestions setSearchKeyWord={setSearchKeyWord} />
        <a href="../modify-books">
          <button className="btn-back">
            {" "}
            <IoIosArrowBack />
            <span>back</span>
            <div
              className={`btn-back-warning ${
                JSON.stringify(questions) !== JSON.stringify(originalQuestions)
                  ? "btn-back-warning-visible"
                  : ""
              }`}
            >
              <AiOutlineWarning className="warning-icon" /> The changes will not
              be saved!
            </div>
          </button>
        </a>
        <button
          className={`btn-save-changes ${
            JSON.stringify(questions) !== JSON.stringify(originalQuestions)
              ? "btn-active"
              : "btn-disabled"
          }`}
          onClick={() => {
            if (
              JSON.stringify(questions) !== JSON.stringify(originalQuestions)
            ) {
              let upDatedQuestions: string[] = [];
              questions?.map((question) => {
                if (
                  JSON.stringify(question) !==
                  JSON.stringify(
                    originalQuestions?.find((oq) => {
                      return oq.questionId === question.questionId;
                    })
                  )
                ) {
                  upDatedQuestions.push(question.questionId);
                }
              });

              upDatedQuestions.map((questionId) => {
                const newQuestion = questions?.find((q) => {
                  return q.questionId === questionId;
                });

                getUidFromId("questions", "questionId", questionId).then(
                  (result) => {
                    if (result.status === 200) {
                      updateData("questions", result.message, newQuestion).then(
                        (res) => {
                          if (res.status === 200) {
                            toast.success(
                              "Question " + questionId + " has been updated!",
                              {
                                autoClose: 1000,
                              }
                            );
                          } else {
                            toast.error("Soemthing went wrong", {
                              autoClose: 1000,
                            });
                          }
                        }
                      );
                    }
                  }
                );
              });
            } else {
              toast.error("Nothing to save", {
                autoClose: 500,
              });
            }
          }}
        >
          Save Changes
        </button>
      </div>

      <div className="questions-div">
        {questions?.filter((question) => {
          return (
            question.question.toLocaleLowerCase().includes(searchKeyWord) ||
            question.a.toLocaleLowerCase().includes(searchKeyWord) ||
            question.b.toLocaleLowerCase().includes(searchKeyWord) ||
            question.c.toLocaleLowerCase().includes(searchKeyWord) ||
            question.d.toLocaleLowerCase().includes(searchKeyWord) ||
            question.questionId.toLocaleLowerCase().includes(searchKeyWord)
          );
        }).length !== 0 &&
          questions
            ?.filter((question) => {
              return (
                question.question.toLocaleLowerCase().includes(searchKeyWord) ||
                question.a.toLocaleLowerCase().includes(searchKeyWord) ||
                question.b.toLocaleLowerCase().includes(searchKeyWord) ||
                question.c.toLocaleLowerCase().includes(searchKeyWord) ||
                question.d.toLocaleLowerCase().includes(searchKeyWord) ||
                question.questionId.toLocaleLowerCase().includes(searchKeyWord)
              );
            })
            .map((question, i = 0) => {
              return (
                <div key={question.questionId} className="question-card">
                  <div className="main-question">
                    <select
                      name="question-type"
                      id={"select-type- " + question.questionId}
                      defaultValue={question.type}
                      onChange={(e) => {
                        upDateQuestionsArray(
                          question,

                          "type",
                          e.target.value
                        );
                      }}
                    >
                      <option value="Setting">Setting</option>
                      <option value="Character">Character</option>
                      <option value="Dialogue">Dialogue</option>
                      <option value="Vocabulary">Vocabulary</option>
                      <option value="Plot">Plot</option>
                    </select>
                    <input
                      type="text"
                      className="question-input"
                      defaultValue={question.question}
                      onChange={(e) => {
                        upDateQuestionsArray(
                          question,

                          "question",
                          e.target.value
                        );
                      }}
                    />
                  </div>
                  <div className="options">
                    <input
                      type="radio"
                      value="a"
                      name={question.questionId}
                      className="option-select"
                      defaultChecked={question.answer === "a"}
                      onChange={(e) => {
                        upDateQuestionsArray(
                          question,

                          "answer",
                          e.target.value
                        );
                      }}
                    />
                    <input
                      type="text"
                      className={`option-input ${
                        question.answer === "a" ? "correct-answer" : ""
                      }`}
                      defaultValue={question.a}
                      onChange={(e) => {
                        upDateQuestionsArray(question, "a", e.target.value);
                      }}
                    />
                    <input
                      type="radio"
                      value="b"
                      name={question.questionId}
                      className="option-select"
                      defaultChecked={question.answer === "b"}
                      onChange={(e) => {
                        upDateQuestionsArray(
                          question,

                          "answer",
                          e.target.value
                        );
                      }}
                    />
                    <input
                      type="text"
                      className={`option-input ${
                        question.answer === "b" ? "correct-answer" : ""
                      }`}
                      defaultValue={question.b}
                      onChange={(e) => {
                        upDateQuestionsArray(question, "b", e.target.value);
                      }}
                    />
                    <input
                      type="radio"
                      value="c"
                      name={question.questionId}
                      className="option-select"
                      defaultChecked={question.answer === "c"}
                      onChange={(e) => {
                        upDateQuestionsArray(
                          question,

                          "answer",
                          e.target.value
                        );
                      }}
                    />
                    <input
                      type="text"
                      className={`option-input ${
                        question.answer === "c" ? "correct-answer" : ""
                      }`}
                      defaultValue={question.c}
                      onChange={(e) => {
                        upDateQuestionsArray(question, "c", e.target.value);
                      }}
                    />
                    <input
                      type="radio"
                      value="d"
                      name={question.questionId}
                      className="option-select"
                      defaultChecked={question.answer === "d"}
                      onChange={(e) => {
                        upDateQuestionsArray(
                          question,

                          "answer",
                          e.target.value
                        );
                      }}
                    />
                    <input
                      type="text"
                      className={`option-input ${
                        question.answer === "d" ? "correct-answer" : ""
                      }`}
                      defaultValue={question.d}
                      onChange={(e) => {
                        upDateQuestionsArray(question, "d", e.target.value);
                      }}
                    />
                  </div>
                </div>
              );
            })}

        {questions?.filter((question) => {
          return (
            question.question.toLocaleLowerCase().includes(searchKeyWord) ||
            question.a.toLocaleLowerCase().includes(searchKeyWord) ||
            question.b.toLocaleLowerCase().includes(searchKeyWord) ||
            question.c.toLocaleLowerCase().includes(searchKeyWord) ||
            question.d.toLocaleLowerCase().includes(searchKeyWord) ||
            question.questionId.toLocaleLowerCase().includes(searchKeyWord)
          );
        }).length === 0 && (
          <div className="no-questions-found"> No questions found</div>
        )}
      </div>
    </div>
  );
};
