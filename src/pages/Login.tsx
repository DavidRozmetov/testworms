import "../scss/auth-mobile.scss";
import "../scss/auth.scss";

import { BtnSignInWithGoogle } from "../components/BtnSignInWithGoogle";
import { useState } from "react";
import { logInWithEmailAndPassword } from "../firebase/googleAuth";
import { toast } from "react-toastify";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(email, password);
    logInWithEmailAndPassword(email, password).then((res) => {
      if (res.status === 200) {
        toast.success(res.message, { autoClose: 2000 });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(res.message, { autoClose: 2000 });
      }
    });
  };

  return (
    <div className="log-in-page">
      <div className=" auth-page">
        <div className="left-information">
          <h2 className="signup-form-motto">
            A blessing day to teach and test!
          </h2>
          <h5 className="signup-form-secondary-motto">Welcome back!</h5>
          <div>
            <p className="text-already-have-account">
              Not a member yet? <a href="/signup"> Sign up</a> here!
            </p>
          </div>
        </div>
        <div className="right-information">
          <form className="signup-form" onSubmit={(e) => handleSubmit(e)}>
            <div className="full-width-div">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="form-email"
                className="input form-input full-width"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="full-width-div">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="form-password"
                className="input form-input full-width"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div>
              <div className="form-checkbox">
                <a href="forgot-password" className="forgot-password">
                  Forgot password?
                </a>
              </div>
              <div className="redirect-link-mobile">
                <p className="text-already-have-account">
                  Not a member yet? <a href="/signup"> Sign up</a> here!
                </p>
              </div>
            </div>
            <button type="submit" className="btn bg-main sign-up-button">
              Log In
            </button>
          </form>
          <div className="alternative-sign-up-div">
            <div className="div-or">
              <hr />
              <p className="text-or">or</p>
            </div>
            <BtnSignInWithGoogle displayText="Log in with Google" />
          </div>
        </div>
      </div>
    </div>
  );
};
