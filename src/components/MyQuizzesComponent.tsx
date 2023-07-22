import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { readDataFromUser } from "../firebase/firebaseCRUD";
import "../scss/myQuizzes.scss";

export const MyQuizzesComponent = () => {
  const navigate = useNavigate();
  const [myQuizzes, setMyQuizzes] = useState<{
    [quizUID: string]: {
      author: string;
      dateCreated: string;
      lastUpdated: string;
      numberOfQuestions: number;
      quizId: string;
      quizName: string;
    };
  }>();
  const [user, setUser] = useState<any>();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(auth.currentUser);
      auth.currentUser &&
        readDataFromUser("quizzes", "author", auth.currentUser?.uid).then(
          (res) => {
            if (typeof res.message !== "string") {
              setMyQuizzes(res.message);
            }
          }
        );
    });
  }, []);

  useEffect(() => {}, [auth]);

  return (
    <div className="my-quizzes-component">
      <button
        className="magic-button"
        onClick={() => {
          if (user.emailVerified) {
            navigate("/create-quiz");
          } else {
            toast.error("please verify your email first!");
          }
        }}
      >
        Create a quiz
      </button>
      <button className="magic-button" onClick={() => {}}>
        Browse books
      </button>

      <div className="div-my-quizzes">
        <h2>My quizzes</h2>
        <div className="my-quizzes-body">
          {myQuizzes &&
            Object.keys(myQuizzes).map((quizId) => {
              return (
                <button
                  key={quizId}
                  className="magic-button"
                  onClick={() => {
                    navigate("/my-quizzes/" + myQuizzes[quizId].quizId);
                  }}
                >
                  {myQuizzes[quizId].quizName}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
