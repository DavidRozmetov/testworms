import { useCallback, useEffect } from "react";
import "../scss/auth.scss";
import "../scss/auth-mobile.scss";
import React, { useState } from "react";
import { BtnSignInWithGoogle } from "../components/BtnSignInWithGoogle";
import { checkPasswordStrength } from "../firebase/checkPasswordStrength";

import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { CreateAccountWithEmailAndPassword } from "../firebase/googleAuth";
import { toast } from "react-toastify";

export const SignUp = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    onAuthStateChanged(auth, () => {
      if (auth.currentUser) {
        setUser(auth.currentUser);
      }
    });
  });

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isValid, setIsValid] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (firstName.trim() === "") {
      newErrors.firstName = "Name is required";
      toast.error(newErrors.firstName, {
        autoClose: 1000,
      });
      valid = false;
    } else {
      newErrors.firstName = "";
    }
    if (lastName.trim() === "") {
      newErrors.lastName = "Last name is required";

      toast.error(newErrors.lastName, {
        autoClose: 1000,
      });
      valid = false;
    } else {
      newErrors.lastName = "";
    }
    if (email.trim() === "") {
      newErrors.email = "Email is required";
      toast.error(newErrors.email, {
        autoClose: 1000,
      });
      valid = false;
    } else if (!email.trim().includes("@")) {
      newErrors.email = "Email is required";
      toast.error(newErrors.email, {
        autoClose: 1000,
      });
    } else {
      newErrors.email = "";
    }
    if (password.trim() === "") {
      newErrors.password = "Password is required";
      toast.error(newErrors.password, {
        autoClose: 1000,
      });
      valid = false;
    } else if (!checkPasswordStrength(password)) {
      newErrors.password = "Password is not strong enough";
      valid = false;
    } else {
      newErrors.password = "";
    }
    if (confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Confirm password is required";
      toast.error(newErrors.confirmPassword, {
        autoClose: 1000,
      });
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      toast.error(newErrors.confirmPassword, {
        autoClose: 1000,
      });
      valid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors(newErrors);
    setIsValid(valid);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isValid && agreedToTerms) {
      CreateAccountWithEmailAndPassword({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      }).then((res) => {
        if (res.status === 200) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      });
    }
  };

  return (
    <div className="sign-up-page">
      <div className="auth-page">
        <div className="left-information">
          <h2 className="signup-form-motto">
            Make reading tests easily and at a scale
          </h2>
          <h5 className="signup-form-secondary-motto">
            Start testing in minutes !
          </h5>
          <div>
            <p className="text-already-have-account">
              Already have an account? <a href="/login"> Log in</a>
            </p>
          </div>
        </div>
        <div className="right-information">
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="two-row">
              <div
                className={`first-name-div half-width-div ${
                  errors.firstName !== "" ? " half-width-div-error " : ""
                }`}
              >
                <label htmlFor="first-name" className="first-name-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  className="input form-input half-width"
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    if (errors.firstName !== "") {
                      setErrors({ ...errors, firstName: "" });
                    }
                  }}
                />
              </div>
              <div
                className={`first-name-div half-width-div ${
                  errors.lastName !== "" ? " half-width-div-error " : ""
                }`}
              >
                <label htmlFor="last-name" className="last-name-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  className="input form-input half-width"
                  onChange={(event) => {
                    setLastName(event.target.value);
                    if (errors.lastName !== "") {
                      setErrors({ ...errors, lastName: "" });
                    }
                  }}
                />
              </div>
            </div>
            <div
              className={`full-width-div 
              ${errors.email !== "" ? " full-width-div-error " : ""}`}
            >
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="form-email"
                className="input form-input full-width"
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errors.email !== "") {
                    setErrors({ ...errors, email: "" });
                  }
                }}
              />
            </div>

            <div
              className={`full-width-div ${
                errors.password !== "" ? " full-width-div-error " : ""
              }`}
            >
              <label htmlFor="form-password">Password</label>
              <input
                type="text"
                id="form-password"
                className="input form-input full-width"
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errors.password !== "") {
                    setErrors({ ...errors, password: "" });
                  }
                }}
              />
            </div>
            <div
              className={`full-width-div ${
                errors.confirmPassword !== "" ? " full-width-div-error " : ""
              }`}
            >
              <label htmlFor="form--confirm-password">Confirm Password</label>
              <input
                type="password"
                id="form-confirm-password"
                className="input form-input full-width"
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (errors.confirmPassword !== "") {
                    setErrors({ ...errors, confirmPassword: "" });
                  }
                }}
              />
            </div>
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="form-agree-checkbox"
                className="form-agree-checkbox"
                onChange={(event) => {
                  setAgreedToTerms(event.target.checked);
                }}
              />
              <p>I agree to the Terms of Service and Privacy Notice</p>
              <br />
              <div className="redirect-link-mobile">
                <p className="text-already-have-account">
                  Already a member? <a href="/login"> Login here</a> here!
                </p>
              </div>
            </div>
            <button
              className="btn full-width bg-main sign-up-button"
              onClick={(e) => {
                validateForm();
              }}
            >
              Sign me up !
            </button>
          </form>
          <div className="alternative-sign-up-div">
            <div className="div-or">
              <hr />
              <p className="text-or">or</p>
            </div>
            <BtnSignInWithGoogle displayText="Sign up with Google" />
          </div>
        </div>
      </div>
    </div>
  );
};
function getUser() {
  throw new Error("Function not implemented.");
}
