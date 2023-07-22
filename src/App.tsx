import "./App.scss";
import "./scss/nav-bar.scss";
import "./scss/uploadQuestions.scss";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

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
import { UploadQuestions } from "./pages/UploadQuestions";
import { ModifyBooks } from "./pages/ModifyBooks";
import { ModifyQuestions } from "./pages/ModifyQuestions";
import { CreateQuiz } from "./pages/CreateQuiz";
import { EditQuiz } from "./pages/EditQuiz";

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
          <Route path="upload-questions" element={<UploadQuestions />}></Route>
          <Route path="modify-books" element={<ModifyBooks />}></Route>
          <Route
            path="modify-questions/*"
            element={<ModifyQuestions />}
          ></Route>
          <Route path="create-quiz" element={<CreateQuiz />}></Route>
          <Route path="my-quizzes/*" element={<EditQuiz />}></Route>
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
