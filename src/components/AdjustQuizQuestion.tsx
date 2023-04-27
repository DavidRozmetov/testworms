import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { QuestionOrder, QuestionWithId } from "../interfaces/Interfaces";
import { auth } from "../firebase/firebase";
import "../scss/createQuiz.scss";
import { MdAutorenew } from "react-icons/md";
import { BsInfoLg } from "react-icons/bs";
import { toast } from "react-toastify";
export const AdjustQuizQuestion = (props: {
  randomQuestions: string[];
  randomIndex: string;
  i: number;
  cloudQuestions: QuestionWithId[];
  setRandomQuestions: Dispatch<SetStateAction<string[]>>;
  numberOfDefaultQuestions: {
    plot: number;
    vocabulary: number;
    setting: number;
    characters: number;
    dialogue: number;
  };
  togglePreferences: boolean;
  bundleBook: boolean;
  bundleType: boolean;
  bookId: string;
  typeId: string;
  questionOrder: QuestionOrder;
  setQuestionOrder: Dispatch<SetStateAction<QuestionOrder>>;
}) => {
  const cloudQuestions = props.cloudQuestions;
  const randomIndex = props.randomIndex;
  const i = props.i + 1;
  const bundleBooks = props.bundleBook;
  const bundleTypes = props.bundleType;
  const [question, setQusetion] = useState<QuestionWithId>();
  const [toggleResetInfo, setToffleResetInfo] = useState(false);
  const [toggleInfo, setToffleInfo] = useState(false);
  const randomQuestions = props.randomQuestions;
  const setRandomQuestions = props.setRandomQuestions;
  const numberOfDefaultQuestions = props.numberOfDefaultQuestions;
  const togglePreferences = props.togglePreferences;
  const bookId = props.bookId;
  const typeId = props.typeId;
  const questionOrder = props.questionOrder;
  const setQuestionOrder = props.setQuestionOrder;

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const returnRandomQuestion = (
    current: string
  ): Promise<{
    status: string;
    message: string;
  }> => {
    return new Promise(async (resolve, reject) => {
      try {
        let randomItem = "";
        let randomIndex = 0;
        let randomItemType = "";
        let questionLength = 0;
        let randomBookId = "";

        const currentType = cloudQuestions
          .find((cQuestion) => {
            return cQuestion.questionId === current;
          })
          ?.type.toLocaleLowerCase();

        if (
          currentType === "plot" ||
          currentType === "characters" ||
          currentType === "setting" ||
          currentType === "dialogue" ||
          currentType === "vocabulary"
        ) {
          questionLength = numberOfDefaultQuestions[currentType];
        }

        if (
          randomQuestions.length === cloudQuestions.length ||
          (togglePreferences && questionLength === cloudQuestions.length / 5)
        ) {
          toast.warning("All the questions are in use");
          randomItem = current;
        } else {
          do {
            randomIndex = getRandomInt(cloudQuestions.length);
            randomItem = cloudQuestions[randomIndex]?.questionId;
            randomItemType = cloudQuestions[randomIndex]?.type;
            randomBookId = cloudQuestions[randomIndex]?.bookId;
          } while (
            randomQuestions.includes(randomItem) ||
            randomItem === "" ||
            togglePreferences ||
            (bundleTypes &&
              currentType?.toLocaleLowerCase() !==
                randomItemType.toLocaleLowerCase()) ||
            (bundleBooks && randomBookId !== bookId)
          );
        }
        const result: PromiseSettledResult<string>[] = await Promise.allSettled(
          [randomItem]
        );

        const fulfilledResults: string[] = result
          .filter(
            (res): res is PromiseFulfilledResult<string> =>
              res.status === "fulfilled"
          )
          .map((res) => res.value);

        if (fulfilledResults.length > 0) {
          resolve({
            status: "200",
            message: fulfilledResults[fulfilledResults.length - 1],
          });
        } else {
          reject({
            status: "404",
            message: "No promise fulfilled",
          });
        }
      } catch (error) {
        reject({
          status: "400",
          message: error,
        });
      }
    });
  };

  useEffect(() => {
    const currentQuestion = cloudQuestions.find((q: QuestionWithId) => {
      return q.questionId === randomIndex;
    });
    setQusetion(currentQuestion);
    if (currentQuestion !== undefined) {
      setQuestionOrder((prevOrder: QuestionOrder) => {
        const nextOrder = { ...prevOrder };
        nextOrder[i] = currentQuestion;
        return nextOrder;
      });
    }
  }, [auth, randomQuestions]);
  return (
    <div className="question-card">
      <div className="header-buttons">
        <button
          className="btn-new-question"
          onMouseEnter={() => {
            setToffleResetInfo(true);
          }}
          onMouseLeave={() => {
            setToffleResetInfo(false);
          }}
          onClick={() => {
            returnRandomQuestion(question?.questionId || "").then((res) => {
              const newIndex: string = res.message;
              let tempRandomArray: string[] = [];

              randomQuestions.map((randQuest) => {
                if (randQuest !== randomQuestions[i]) {
                  tempRandomArray.push(randQuest);
                } else {
                  tempRandomArray.push(newIndex);
                }
              });

              setRandomQuestions((prevQuestions) => tempRandomArray);
            });
          }}
        >
          <MdAutorenew />
          {toggleResetInfo && (
            <span className="label-reset-question-info">New question</span>
          )}
        </button>
        <button
          className="btn-question-info"
          onMouseEnter={() => {
            setToffleInfo(true);
          }}
          onMouseLeave={() => {
            setToffleInfo(false);
          }}
        >
          <BsInfoLg />
          {toggleInfo && (
            <span className="label-question-info">{question?.questionId}</span>
          )}
        </button>
      </div>
      <div
        key={question?.questionId}
        className="question-card"
        onClick={() => {
          toast.warning("You can edit questions after you have saved the quiz");
        }}
      >
        <div className="main-question">
          <span>{i + ".\t"}</span>
          <input
            type="text"
            className="question-input"
            defaultValue={question?.question}
            disabled
          />
        </div>
        <div className="options">
          <input
            type="radio"
            value="a"
            name={question?.questionId}
            className="option-select"
            defaultChecked={question?.answer === "a"}
            disabled
          />
          <input
            type="text"
            className={`option-input ${
              question?.answer === "a" ? "correct-answer" : ""
            }`}
            defaultValue={question?.a}
            disabled
          />
          <input
            type="radio"
            value="b"
            name={question?.questionId}
            className="option-select"
            defaultChecked={question?.answer === "b"}
            disabled
          />
          <input
            type="text"
            className={`option-input ${
              question?.answer === "b" ? "correct-answer" : ""
            }`}
            defaultValue={question?.b}
            disabled
          />
          <input
            type="radio"
            value="c"
            name={question?.questionId}
            className="option-select"
            defaultChecked={question?.answer === "c"}
            disabled
          />
          <input
            type="text"
            className={`option-input ${
              question?.answer === "c" ? "correct-answer" : ""
            }`}
            defaultValue={question?.c}
            disabled
          />
          <input
            type="radio"
            value="d"
            name={question?.questionId}
            className="option-select"
            defaultChecked={question?.answer === "d"}
            disabled
          />
          <input
            type="text"
            className={`option-input ${
              question?.answer === "d" ? "correct-answer" : ""
            }`}
            defaultValue={question?.d}
            disabled
          />
        </div>
      </div>
    </div>
  );
};
