import { Dispatch } from "react";
import { AiOutlineRollback, AiTwotoneDelete } from "react-icons/ai";
import { BiSave } from "react-icons/bi";
import { BsPrinter } from "react-icons/bs";
import { FiKey } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";

export const EditQuizNavBar = (props: {
  quizId: string;

  setToggleAnswerKey: Dispatch<React.SetStateAction<boolean>>;
  setToggleDelete: Dispatch<React.SetStateAction<boolean>>;
  setToggleSave: Dispatch<React.SetStateAction<boolean>>;
  saveList: string[];
  toggleSave: boolean;
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
  sourceQuestions:
    | {
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
      }
    | undefined;
}) => {
  const quizName = props.quizId;
  const navigate = useNavigate();
  const setToggleDelete = props.setToggleDelete;
  const setToggleAnswerKey = props.setToggleAnswerKey;
  const setToggleSave = props.setToggleSave;
  const originalQuizName = props.quizId.toString();
  const sourceQuestions = props.sourceQuestions;
  const quizQuestions = props.quizQuestions;
  const setQuizQuestions = props.setQuizQuestions;
  const toggleSave = props.toggleSave;
  const saveList = props.saveList;
  const originalQuestions =
    props.quizQuestions && JSON.parse(JSON.stringify(props.quizQuestions));
  return (
    <div className="edit-quiz-navbar">
      <input type="string" defaultValue={quizName} maxLength={50}></input>

      <button
        onClick={() => {
          setToggleAnswerKey(true);
        }}
      >
        {" "}
        <FiKey />
        <span> Answer Key</span>
      </button>
      <button
        onClick={() => {
          setToggleDelete(true);
        }}
      >
        <AiTwotoneDelete />
        <span> Delete</span>
      </button>
      <button
        disabled={toggleSave}
        onClick={() => {
          console.log(saveList);
        }}
        className={` ${toggleSave ? "btn-save" : "btn-save btn-save-disabled"}`}
      >
        <BiSave /> <span>Save Changes</span>
      </button>
      <button>
        <BsPrinter />
        <span>Print</span>
      </button>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        {" "}
        <AiOutlineRollback />
        <span>Back</span>
      </button>
    </div>
  );
};
