import { logout } from "../firebase/firebase";

export const BtnLogout = () => {
  return (
    <button onClick={() => logout()} className="logout-button">
      Logout
    </button>
  );
};
