import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const MyQuizzesComponent = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(auth.currentUser);
    });
  }, []);

  return (
    <div className="my-quizzes-component">
      <button
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
      <button>Go to my quizzes</button>
      <button>Browse books</button>
    </div>
  );
};
