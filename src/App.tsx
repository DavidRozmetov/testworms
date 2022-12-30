import "./App.scss";
import "./scss/nav-bar.scss";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { ErrorPage } from "./pages/ErrorPage";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";

import { Navbar } from "./components/Navbar";
import Help from "./pages/Help";
import { Account } from "./pages/Account";
import { ProtectedRoutes, AuthRoutes } from "./components/ProtectedRoutes";

function App() {
  // const [user, setUser] = useState({});
  // useEffect(() => {
  //   onAuthStateChanged(auth, () => {
  //     if (auth.currentUser) {
  //       setUser(auth.currentUser);
  //       console.log(user);
  //     }
  //   });
  // });

  return (
    <Router>
      {/* <Logo /> */}

      <Navbar />
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="account" element={<Account />}></Route>
        </Route>

        <Route element={<AuthRoutes />}>
          <Route path="signup" element={<SignUp />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="forgot-password" element={<ForgotPassword />}></Route>
        </Route>

        <Route path="/about" element={<About />}></Route>
        <Route path="help" element={<Help />}></Route>
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
