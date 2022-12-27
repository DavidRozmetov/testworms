import * as React from "react";
import { useEffect } from "react";
import { auth } from "./firebase";
import { redirect } from "react-router-dom";
import { Home } from "../pages/Home";

export const useRedirectIfLoggedIn = (redirectTo: string) => {
  const user = auth.currentUser ? auth.currentUser : {};
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setShouldRedirect(true);
    }
  }, [user]);

  if (shouldRedirect) {
    return redirect(redirectTo);
  }
};

export const HomePage = () => {
  const redirect = useRedirectIfLoggedIn("/home");

  return (
    <div>
      <Home />
    </div>
  );
};
