import { auth } from "../firebase/firebase";

export const Home = () => {
  // Initialize Firebase
  return (
    <div>
      {process.env.REACT_APP_APP_NAME}
      <div>{auth.currentUser?.displayName}</div>
    </div>
  );
};
