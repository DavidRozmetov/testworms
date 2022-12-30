import { signInwithGoogle } from "../firebase/googleAuth";
import GoogleLogo from "../assets/google-logo.svg";

interface Props extends React.PropsWithChildren<{}> {
  displayText: string;
}

export const BtnSignInWithGoogle: React.FC<Props> = ({ displayText }) => {
  return (
    <button
      className="btn full-width sign-up-with-google"
      onClick={() => {
        signInwithGoogle();
      }}
    >
      <img src={GoogleLogo} alt="google logo" className="google-logo" />
      <p className="sign-up-with-google-text">{displayText}</p>
    </button>
  );
};
