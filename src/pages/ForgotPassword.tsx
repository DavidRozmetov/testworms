import { useState } from "react";
import { sendResetPasswordEmail } from "../firebase/googleAuth";
import "../scss/forgotPassword.scss";
import { toast } from "react-toastify";
export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  return (
    <div className="auth forgot-password-page">
      <h1>Forgot Password</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendResetPasswordEmail(email);
          toast.success("Reset Password Link Has Been Sent To " + email, {
            autoClose: 2000,
          });
        }}
      >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <button type="submit">Send Reset Email</button>
      </form>
    </div>
  );
};
