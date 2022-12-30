import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { auth, provider } from "./firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { createData, deleteData } from "./firebaseCRUD";

export const signInwithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      window.localStorage.setItem("logged-in", "true");
      const [user] = useAuthState(auth);
      createData("users", {
        firstName: user?.displayName,
        accountType: "free",
        isVerifiedTeacher: false,
        role: "u",
      });
      window.location.reload();
      // ...
    })
    .catch((error) => {
      // // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.customData.email;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // // ...
      // console.log(error);
    });
};

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const CreateAccountWithEmailAndPassword = (userData: UserData) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, userData.email, userData.password)
    .then((userCredential) => {
      // Signed in
      window.localStorage.setItem("logged-in", "true");
      const user = userCredential.user;
      updateUserName(userData.firstName, userData.lastName);
      createData("users", {
        firstName: userData.firstName,
        lastName: userData.lastName,
        accountType: "free",
        isVerifiedTeacher: false,
        role: "u",
      });
      sendEmailToVerify();

      // alert("you are logged in");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      // ..
    });
};

export const updateUserName = (firstName: string, lastName: string) => {
  const auth: any = getAuth();
  if (auth) {
    updateProfile(auth.currentUser, {
      displayName: firstName + " " + lastName,
    })
      .then(() => {
        console.log(auth.currentUser);
        // Profile updated!
        // ...
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  }
};

export const logInWithEmailAndPassword = (email: string, password: string) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      window.localStorage.setItem("logged-in", "true");
      alert("You have signed in");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
};

export const sendEmailToVerify = () => {
  const auth: any = getAuth();
  sendEmailVerification(auth.currentUser).then(() => {
    // Email verification sent!
    alert("email verification sent! to " + auth.currentUser.email);
    // ...
  });
};

export const sendResetPasswordEmail = (email: string) => {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      alert("Password reset email sent to " + email + "!");
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};
export const logOut = (message?: any) => {
  auth
    .signOut()
    .then(() => {
      window.localStorage.setItem("logged-in", "false");
      alert("you have logged out");
      window.location.reload();
      if (message) {
        alert(message);
      }
    })
    .catch((e) => {
      alert(e.message);
    });
};

export const DeleteUser = () => {
  const auth = getAuth();
  const user: any = auth.currentUser;

  if (!checkIfTheLoginIsMoreThanTwoDays(user)) {
    deleteUser(user)
      .then(() => {
        deleteData("users", user);
        window.localStorage.setItem("logged-in", "false");
        alert("your account has been deleted");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        // An error ocurred
        // ...
      });
  } else {
    logOut("you need to log in again in order to perform that action");
  }
};

export const checkIfTheLoginIsMoreThanTwoDays = (user: any) => {
  const lastSignInTime = user?.metadata.lastSignInTime;
  console.log(lastSignInTime);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  return lastSignInTime < twoDaysAgo;
};
