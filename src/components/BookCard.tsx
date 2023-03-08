import React, { useState } from "react";
import { Question } from "./Question";
import "../scss/bookCards.scss";

export const BookCard = (props: any) => {
  const book = props.book;
  const answerKey = props.answers;
  const missingQuestions = props.missingQuestions;

  interface Question {
    question: string;
    a: string;
    b: string;
    c: string;
    d: string;
  }

  const renderQuestionsComponent = (
    questionObject: {
      question: string;
      a: string;
      b: string;
      c: string;
      d: string;
    },
    answerKey: string,
    questionIndex: string
  ) => {
    return (
      <Question
        key={"question-" + questionIndex}
        question={questionObject}
        answer={answerKey}
        questionIndex={questionIndex}
      />
    );
  };
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    const openedTabs = document.querySelector(".expanded");
    openedTabs?.classList.remove("expanded");
    openedTabs?.classList.add("collapsed");
  };

  return (
    <div
      className={`book-card ${expanded ? "expanded" : "collapsed"}`}
      onClick={toggleExpanded}
    >
      <h1 className="expand-btn">{book.bookName}</h1>

      {missingQuestions.length > 0 ? (
        <h3>Missing Questions: 1</h3>
      ) : (
        <h3>{Object.keys(book.questions).length} questions</h3>
      )}

      <div className="card-content">
        {Object.keys(book.questions).map((questionIndex) => (
          <React.Fragment key={"question-" + questionIndex}>
            {renderQuestionsComponent(
              book.questions[questionIndex],
              answerKey[questionIndex],
              questionIndex
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
