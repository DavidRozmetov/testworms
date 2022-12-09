import "../scss/auth-mobile.scss";
import "../scss/auth.scss";
import GoogleLogo from "../assets/google-logo.svg";
import { BtnSignInWithGoogle } from "../components/BtnSignInWithGoogle";
export const Login = () => {
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
        <div className="signup-form">
          <BtnSignInWithGoogle />
          <div className="div-or">
            <hr />
            <p className="text-or">or</p>
          </div>

          <div className="full-width-div">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="form-email"
              className="input form-input full-width"
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
          <div>
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="remember-me-checkbox"
                className="form-agree-checkbox"
              />
              <p>Remember me</p>
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
          <button className="btn bg-main sign-up-button">Log In</button>
        </div>
      </div>
    </div>
  );
};
