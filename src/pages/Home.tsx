import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { redirect, useLocation } from "react-router-dom";
import { readDocument } from "../firebase/firebaseCRUD";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";

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

  // const user: User = {
  //   metadata: {
  //     lastSignInTime: '2022-01-01',
  //   },
  // };

  // console.log(user.metadata.lastSignInTime); // 2022-01-01

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

  useEffect(() => {
    if (User.uid !== "") {
      readDocument("users", User.uid).then((res) => {
        userData = res.message;
        if (userData.role !== null) {
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
    console.log("click click");
    navigate("/upload-questions");
  };
  return (
    <div>
      {process.env.REACT_APP_APP_NAME}
      <div>{email}</div>
      <div>{userName}</div>
      {!auth.currentUser?.emailVerified && <h4>please verify your email</h4>}
      <p>
        {userRole === "a" && (
          <button className="btn-primary" onClick={redirectToUploadPage}>
            Upload Question Banks
          </button>
        )}
      </p>
    </div>
  );
};
