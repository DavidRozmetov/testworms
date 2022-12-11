import "../scss/404PageNotFound.scss";
import dinosaur from "../assets/dinosaur.png";
export const ErrorPage = () => {
  return (
    <div className="page-not-found">
      <h1>404</h1>
      <h3>Oops, looks like the page you were looking for doesn't exist.</h3>
      {/* <img src="../assets/dinosaur.png" alt="Dinosaur" /> */}
      <img src={dinosaur} alt="Dinosaur" />
    </div>
  );
};
