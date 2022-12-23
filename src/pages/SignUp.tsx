import "../scss/auth.scss";
import "../scss/auth-mobile.scss";
import React, { useState } from "react";
import { BtnSignInWithGoogle } from "../components/BtnSignInWithGoogle";
export const SignUp = () => {
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

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (formData.firstName.trim() === "") {
      newErrors.firstName = "Name is required";
      valid = false;
    }
    if (formData.lastName.trim() === "") {
      newErrors.lastName = "Last name is required";
      valid = false;
    }
    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
      valid = false;
    }
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
      valid = false;
    }
    if (formData.confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Confirm password is required";
      valid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    setIsValid(valid);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    validateForm();

    if (isValid) {
      console.log(formData);
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
        <div className="signup-form">
          <BtnSignInWithGoogle />
          <div className="div-or">
            <hr />
            <p className="text-or">or</p>
          </div>
          <div className="two-row">
            <div className="first-name-div half-width-div">
              <label htmlFor="first-name" className="first-name-label">
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                className="input form-input half-width"
                onChange={(event) =>
                  setFormData({ ...formData, firstName: event.target.value })
                }
              />
            </div>
            <div className="last-name-div half-width-div">
              <label htmlFor="last-name" className="last-name-label">
                Last Name
              </label>
              <input
                type="text"
                id="last-name"
                className="input form-input half-width"
                onChange={(event) =>
                  setFormData({ ...formData, lastName: event.target.value })
                }
              />
            </div>
          </div>
          <div className="full-width-div">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="form-email"
              className="input form-input full-width"
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
          </div>
          <div className="full-width-div">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="form-password"
              className="input form-input full-width"
            />
          </div>
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="form-agree-checkbox"
              className="form-agree-checkbox"
            />
            <p>I agree to the Terms of Service and Privacy Notice</p>
            <br />
            <div className="redirect-link-mobile">
              <p className="text-already-have-account">
                Already a member? <a href="/login"> Login here</a> here!
              </p>
            </div>
          </div>
          <button className="btn full-width bg-main sign-up-button">
            Sign me up !
          </button>
        </div>
      </div>
    </div>
  );
};
