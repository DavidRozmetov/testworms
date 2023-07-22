import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { QuestionWithId } from "../interfaces/Interfaces";

import "../scss/createQuiz.scss";
import { toast } from "react-toastify";
import { auth } from "../firebase/firebase";
export const ModifyQuizQuestion = (props: {
  uid: string;
  i: number;
  question: QuestionWithId;

  quizQuestions:
    | {
        [key: string]: {
          author: string;
          dateCreated: string;
          lastUpdated: string;
          questionIndex: string;
          quizId: string;
          quizQuestionId: string;
          sourceQuestionId: string;
        };
      }
    | undefined;
  setQuizQuestions: Dispatch<
    React.SetStateAction<
      | {
          [key: string]: {
            author: string;
            dateCreated: string;
            lastUpdated: string;
            questionIndex: string;
            quizId: string;
            quizQuestionId: string;
            sourceQuestionId: string;
          };
        }
      | undefined
    >
  >;
  saveList: string[];
  setSaveList: Dispatch<SetStateAction<string[]>>;
  originalQuestion: QuestionWithId;
}) => {
  const i = props.i + 1;
  const question = props.question;
  let originalQuestion = props.originalQuestion;
  const quizQuestions = props.quizQuestions;
  const setQuizQuestions = props.setQuizQuestions;
  const saveList = props.saveList;
  const setSaveList = props.setSaveList;

  const evaluateChange = (keyName: string, newValue: string) => {
    let newQuestion: any = question;
    let newQuizQuestion: any = {};
    quizQuestions &&
      Object.keys(quizQuestions).map((k) => {
        if (quizQuestions[k].sourceQuestionId === question.questionId) {
          newQuizQuestion = quizQuestions[k];
        }
      });

    newQuestion[keyName] = newValue;
    const questionIndex = newQuizQuestion.questionIndex;

    if (JSON.stringify(newQuestion) !== JSON.stringify(originalQuestion)) {
      console.log("mismatch:", "new: ", newQuestion);
      console.log("original: ", originalQuestion);
      if (!saveList.includes(questionIndex)) {
        // console.log("new to List", saveList);
        setSaveList((previous) => [...previous, questionIndex]);
      }
    } else {
      // console.log("match:", newQuestion, originalQuestion);
      if (saveList.includes(questionIndex)) {
        // console.log("already in the list", saveList);
        const newList: string[] = [];
        saveList.map((list) => {
          if (list !== questionIndex) {
            newList.push(list);
          }
        });
        setSaveList(newList);
        // console.log(newList);
      }
    }
  };

  useEffect(() => {
    // console.error("Original Question has changed", originalQuestion);
  }, [originalQuestion]);

  return (
    <div className="question-card">
      <div key={question?.questionId} className="question-card">
        <div className="main-question">
          <span>{i + ".\t"}</span>
          <input
            type="text"
            className="question-input"
            defaultValue={question?.question}
            onChange={(e) => {
              evaluateChange("question", e.target.value);
            }}
          />
        </div>
        <div className="options">
          <input
            type="radio"
            value="a"
            name={question?.questionId}
            className="option-select"
            defaultChecked={question?.answer === "a"}
            onChange={(e) => {
              evaluateChange("answer", e.target.value);
            }}
          />
          <input
            type="text"
            className={`option-input ${
              question?.answer === "a" ? "correct-answer" : ""
            }`}
            defaultValue={question?.a}
            onChange={(e) => {
              evaluateChange("a", e.target.value);
            }}
          />
          <input
            type="radio"
            value="b"
            name={question?.questionId}
            className="option-select"
            defaultChecked={question?.answer === "b"}
            onChange={(e) => {
              evaluateChange("answer", e.target.value);
            }}
          />
          <input
            type="text"
            className={`option-input ${
              question?.answer === "b" ? "correct-answer" : ""
            }`}
            defaultValue={question?.b}
            onChange={(e) => {
              evaluateChange("b", e.target.value);
            }}
          />
          <input
            type="radio"
            value="c"
            name={question?.questionId}
            className="option-select"
            defaultChecked={question?.answer === "c"}
            onChange={(e) => {
              evaluateChange("answer", e.target.value);
            }}
          />
          <input
            type="text"
            className={`option-input ${
              question?.answer === "c" ? "correct-answer" : ""
            }`}
            defaultValue={question?.c}
            onChange={(e) => {
              evaluateChange("c", e.target.value);
            }}
          />
          <input
            type="radio"
            value="d"
            name={question?.questionId}
            className="option-select"
            defaultChecked={question?.answer === "d"}
            onChange={(e) => {
              evaluateChange("answer", e.target.value);
            }}
          />
          <input
            type="text"
            className={`option-input ${
              question?.answer === "d" ? "correct-answer" : ""
            }`}
            defaultValue={question?.d}
            onChange={(e) => {
              evaluateChange("d", e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
