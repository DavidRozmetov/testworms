import { useCallback, useEffect } from "react";
import "../scss/auth.scss";
import "../scss/auth-mobile.scss";
import React, { useState } from "react";
import { BtnSignInWithGoogle } from "../components/BtnSignInWithGoogle";
import { checkPasswordStrength } from "../firebase/checkPasswordStrength";

import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { CreateAccountWithEmailAndPassword } from "../firebase/googleAuth";

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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const debouncedValidateForm = () => {
    validateForm();
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (formData.firstName.trim() === "") {
      newErrors.firstName = "Name is required";
      valid = false;
    } else {
      newErrors.firstName = "";
    }
    if (formData.lastName.trim() === "") {
      newErrors.lastName = "Last name is required";
      valid = false;
    } else {
      newErrors.lastName = "";
    }
    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
      valid = false;
    } else {
      newErrors.email = "";
    }
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!checkPasswordStrength(formData.password)) {
      newErrors.password = "Password is not strong enough";
      valid = false;
    } else {
      newErrors.password = "";
    }
    if (formData.confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Confirm password is required";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors(newErrors);
    setIsValid(valid);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submit clicked");
    debouncedValidateForm();

    if (isValid && agreedToTerms) {
      console.log(formData);
      CreateAccountWithEmailAndPassword({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
    } else {
      console.log(errors);
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
                    setFormData({ ...formData, firstName: event.target.value });
                    debouncedValidateForm();
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
                    setFormData({ ...formData, lastName: event.target.value });
                    debouncedValidateForm();
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
                  setFormData({ ...formData, email: event.target.value });
                  console.log(formData);
                  // validateForm();
                  // debouncedValidateForm();
                  // console.log(event.target.value);
                  // setEmail(event.target.value);
                  // console.log(email);
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
                  setFormData({ ...formData, password: event.target.value });
                  debouncedValidateForm();
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
                  setFormData({
                    ...formData,
                    confirmPassword: event.target.value,
                  });
                  debouncedValidateForm();
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
              type="submit"
              className="btn full-width bg-main sign-up-button"
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
