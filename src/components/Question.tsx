import "../scss/questionCard.scss";
export const Question = (props: any) => {
  const questionObject = props.question;
  const answer = props.answer;
  const questionNumber = props.questionIndex;

  const isCorrect = answer === questionObject.correctAnswer;

  return (
    <div className={`div-question ${isCorrect ? "correct" : "incorrect"}`}>
      <h3>
        {questionNumber + ".\t "}
        {questionObject.question}
      </h3>
      <li className={answer === "a" ? "correct" : ""}>a. {questionObject.a}</li>
      <li className={answer === "b" ? "correct" : ""}>b. {questionObject.b}</li>
      <li className={answer === "c" ? "correct" : ""}>c. {questionObject.c}</li>
      <li className={answer === "d" ? "correct" : ""}>d. {questionObject.d}</li>
    </div>
  );
};
