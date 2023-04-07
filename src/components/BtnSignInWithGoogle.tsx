import { SignInwithGoogle } from "../firebase/googleAuth";
import GoogleLogo from "../assets/google-logo.svg";
import { toast } from "react-toastify";

interface Props extends React.PropsWithChildren<{}> {
  displayText: string;
}

export const BtnSignInWithGoogle: React.FC<Props> = ({ displayText }) => {
  return (
    <button
      className="btn full-width sign-up-with-google"
      onClick={() => {
        SignInwithGoogle().then((res) => {
          toast.success("You have logged in");
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }}
    >
      <img src={GoogleLogo} alt="google logo" className="google-logo" />
      <p className="sign-up-with-google-text">{displayText}</p>
    </button>
  );
};
