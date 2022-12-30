import { logOut } from "../firebase/googleAuth";

export const BtnLogout = () => {
  return (
    <span onClick={() => logOut()} className="logout-button">
      <span className="nav-link-text"> Logout </span>
    </span>
  );
};
