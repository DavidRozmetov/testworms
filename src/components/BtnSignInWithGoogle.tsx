import { signInwithGoogle } from "../firebase/googleAuth";
import GoogleLogo from "../assets/google-logo.svg";

export const BtnSignInWithGoogle = () => {
  return (
    <button
      className="btn full-width sign-up-with-google"
      onClick={signInwithGoogle}
    >
      <img src={GoogleLogo} alt="google logo" className="google-logo" />
      <p className="sign-up-with-google-text">Sign up with Google</p>
    </button>
  );
};
