import "./App.scss";
import "./scss/nav-bar.scss";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { ErrorPage } from "./pages/ErrorPage";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { BtnLogout } from "./components/BtnLogout";
import { Logo } from "./components/Logo";
import { Profile } from "./components/Profile";

function App() {
  return (
    <Router>
      <nav className="nav-bar">
        <a href="/">
          <Logo />
        </a>
        <div className="nav-links">
          <Link to="/" className="nav-link primary-nav-link">
            Dashboard
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/signup" className="nav-link">
            Sign up
          </Link>
          <Link to="/about" className="nav-link">
            Documentation
          </Link>
        </div>
        <div className="sticky-footer">
          <BtnLogout />
          <Link to="/about" className="nav-link">
            Help Center
          </Link>
          <Profile />
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
