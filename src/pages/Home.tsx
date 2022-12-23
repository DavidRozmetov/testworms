import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

export const Home = () => {
  const [userName, setUserName] = useState("Nothing So far");

  useEffect(() => {
    let receivedUserName = auth.currentUser?.displayName;

    onAuthStateChanged(auth, () => {
      setUserName(receivedUserName ? receivedUserName : "It's broken");
    });
  });

  return (
    <div>
      {process.env.REACT_APP_APP_NAME}
      <div>{userName}</div>
    </div>
  );
};
