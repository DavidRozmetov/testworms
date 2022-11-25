import "../scss/auth.scss";
import GoogleLogo from "../assets/google-logo.svg";
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
          <button className="btn full-width sign-up-with-google">
            <img src={GoogleLogo} alt="google logo" className="google-logo" />
            <text className="sign-up-with-google-text">Log In with Google</text>
          </button>
          <div className="div-or">
            <text className="text-or">or</text>
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
              id="remember-me-checkbox"
              className="form-agree-checkbox"
            />
            <p>Remember me</p>
            <a href="forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>
          <button className="btn full-width bg-main sign-up-button">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
