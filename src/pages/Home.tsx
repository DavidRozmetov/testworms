import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

import { auth } from "../firebase/firebase";

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

  // const user: User = {
  //   metadata: {
  //     lastSignInTime: '2022-01-01',
  //   },
  // };

  // console.log(user.metadata.lastSignInTime); // 2022-01-01

  const [userName, setUserName] = useState("Nothing So far");
  const [email, setEmail] = useState("Nothing So far");
  const [User, setUser] = useState({});

  const location = useLocation();
  const statemessage = location.state;
  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current && statemessage) {
      alert(statemessage);
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

  return (
    <div>
      {process.env.REACT_APP_APP_NAME}
      <div>{email}</div>
      <div>{userName}</div>
      {!auth.currentUser?.emailVerified && <h4>please verify your email</h4>}
    </div>
  );
};
