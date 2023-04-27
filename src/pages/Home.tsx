import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { readDocument } from "../firebase/firebaseCRUD";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";
import { MyQuizzesComponent } from "../components/MyQuizzesComponent";
import "../scss/home.scss";
import { RxCross1 } from "react-icons/rx";
import { sendEmailToVerify } from "../firebase/googleAuth";

export const Home = () => {
  interface User {
    displayName: string;
    email: string;
    photoURL: string | null;
    metadata: {
      createdAt: string;
      lastSignInTime: string;
      lastLoginAt: string;
    };
  }
  interface UserAdditionalData {
    firstName: string;
    lastName: string;
    accountType: string;
    isVerifiedTeacher: boolean;
    role: string;
  }

  const [userName, setUserName] = useState("Nothing So far");
  const [email, setEmail] = useState("Nothing So far");
  const [userRole, setUserRole] = useState("");
  const [User, setUser] = useState({
    uid: "",
  });

  let userData: any = {
    role: "",
  };
  const navigate = useNavigate();
  const location = useLocation();
  const statemessage = location.state;
  const effectRan = useRef(false);
  const [toggelVerifyEmail, setToggelVerifyEmail] = useState(true);

  useEffect(() => {
    if (User.uid !== "") {
      readDocument("users", User.uid).then((res) => {
        userData = res.message;

        if (userData.role) {
          setUserRole(userData.role);
        }
      });
    }

    if (!effectRan.current && statemessage) {
      toast(statemessage);
      location.state = null;
    }

    let receivedUserName = auth.currentUser?.displayName;
    onAuthStateChanged(auth, () => {
      setUserName(receivedUserName ? receivedUserName : "It's broken");
      if (auth.currentUser !== null) {
        setUser(auth.currentUser);
        setEmail(auth.currentUser.email ? auth.currentUser.email : "");
      }
    });

    return () => {
      effectRan.current = true;
    };
  });

  const redirectToUploadPage = () => {
    navigate("/upload-questions");
  };
  return (
    <div>
      <h3 className="greeting message">Good morning, {userName}</h3>
      {!auth.currentUser?.emailVerified && toggelVerifyEmail && (
        <div className="verify-email-container">
          <button
            className="verify-email-close-button"
            onClick={() => setToggelVerifyEmail(false)}
          >
            <RxCross1 />
          </button>
          <span className="verify-email-text">Please verify your email!</span>{" "}
          <button
            className="verify-email-button"
            onClick={() => {
              if (auth.currentUser) {
                sendEmailToVerify().then((res) => {
                  if (res.status === 200) {
                    toast.success(
                      "Verification link sent to " +
                        auth.currentUser?.email +
                        ". If you can't see it, please check the spam folder",
                      {
                        autoClose: 2000,
                      }
                    );
                  } else {
                    toast.error(
                      "Something went wrong! Please try again later!",
                      {
                        autoClose: 2000,
                      }
                    );
                  }
                });
              }
            }}
          >
            resend email
          </button>{" "}
        </div>
      )}
      <div>
        {userRole === "a" && (
          <button className="btn-primary" onClick={redirectToUploadPage}>
            Upload Books
          </button>
        )}
        {userRole !== "a" && <MyQuizzesComponent />}
      </div>
    </div>
  );
};
