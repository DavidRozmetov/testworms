import { BtnSignInWithGoogle } from "../components/BtnSignInWithGoogle";
export const SignUp = () => {
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
            <p className="text-or">or</p>
          </div>
          <div className="two-row full-width">
            <div className="first-name-div">
              <label htmlFor="first-name" className="first-name-label">
                First Name
              </label>

              <input
                type="text"
                id="first-name"
                className="input form-input half-width"
              />
            </div>
            <div className="last-name-div">
              <label htmlFor="last-name" className="last-name-label">
                Last Name
              </label>
              <input
                type="text"
                id="last-name"
                className="input form-input half-width"
              />
            </div>
          </div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="form-email"
            className="input form-input full-width"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="form-password"
            className="input form-input full-width"
          />
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="form-agree-checkbox"
              className="form-agree-checkbox"
            />
            <p>I agree to the Terms of Service and Privacy Notice</p>
          </div>
          <button className="btn full-width bg-main sign-up-button">
            Sign me up !
          </button>
        </div>
      </div>
    </div>
  );
};
