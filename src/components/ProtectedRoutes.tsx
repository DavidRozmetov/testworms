import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  const logedIn = window.localStorage.getItem("logged-in");

  return logedIn === "true" ? <Outlet /> : <Navigate to={"/login"} />;
};
export const AuthRoutes = () => {
  let loggedIn;
  if (window.localStorage.getItem("logged-in") !== null) {
    loggedIn = window.localStorage.getItem("logged-in");
  } else {
    loggedIn = "false";
    window.localStorage.setItem("loged-in", "false");
  }
  return loggedIn === "false" ? (
    <Outlet />
  ) : (
    <Navigate to={"/"} state="You are already logged in!" />
  );
};
