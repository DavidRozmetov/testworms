import { logout } from "../firebase/firebase";

export const BtnLogout = () => {
  return (
    <textPath onClick={() => logout()} className="logout-button">
      <span className="nav-link-text"> Logout </span>
    </textPath>
  );
};
