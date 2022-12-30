import "../scss/404PageNotFound.scss";
import dinosaur from "../assets/dinosaur.png";

import { Navigate, redirect } from "react-router-dom";
export const ErrorPage = () => {
  return (
    <div className="page-not-found">
      <h1>404</h1>
      <h3>Oops, looks like the page you were looking for doesn't exist.</h3>
      <a href="/">
        <button className="btn-go-back-home">Go back home </button>
      </a>
      <img src={dinosaur} alt="Dinosaur" />
    </div>
  );
};
