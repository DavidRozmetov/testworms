import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  const logedIn = window.localStorage.getItem("logged-in");

  return logedIn === "true" ? <Outlet /> : <Navigate to={"/login"} />;
};
export const AuthRoutes = () => {
  const logedIn = window.localStorage.getItem("logged-in");

  return logedIn === "false" ? (
    <Outlet />
  ) : (
    <Navigate to={"/"} state="You are already logged in!" />
  );
};
