import "../scss/forgotPassword.scss";
export const ForgotPassword: React.FC = () => {
  return (
    <div className="auth forgot-password-page">
      <h1>Forgot Password</h1>
      <form>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
        <button type="submit">Send Reset Email</button>
      </form>
    </div>
  );
};
