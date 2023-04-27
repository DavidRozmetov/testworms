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

import { auth, provider, db } from "./firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { createData, deleteData } from "./firebaseCRUD";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export const SignInwithGoogle = async (): Promise<{
  status: number;
  message: string;
}> => {
  try {
    let status = 0;
    let message = "";
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    window.localStorage.setItem("logged-in", "true");
    console.log(result);

    const user = result.user;
    const data = {
      firstName: user?.displayName?.split(" ")[0],
      lastName: user?.displayName?.split(" ")[1],
      accountType: "free",
      isVerifiedTeacher: false,
      role: "u",
    };
    await setDoc(doc(db, "users", user.uid), data).then(() => {
      status = 400;
      message = "account has been created successfully";
    });

    return {
      status: status,
      message: "account has been created successfully",
    };
  } catch (error: any) {
    return {
      status: 400,
      message: error.message,
    };
  }
};

export const useAuth = () => {
  const [user] = useAuthState(auth);
  return user;
};

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const CreateAccountWithEmailAndPassword = (
  userData: UserData
): Promise<{ status: number; message: string }> => {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, userData.email, userData.password)
    .then(async (userCredential) => {
      window.localStorage.setItem("logged-in", "true");
      const user = userCredential.user;
      updateUserName(userData.firstName, userData.lastName);
      const data = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        accountType: "free",
        isVerifiedTeacher: false,
        role: "u",
      };
      await setDoc(doc(db, "users", userCredential.user.uid), data);

      sendEmailToVerify();

      return {
        status: 200,
        message: "Your account has been created successfully!",
      };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      return {
        status: 400,
        message: error.message,
      };
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

export const logInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<{
  status: number;
  message: string;
}> => {
  const auth = getAuth();
  let status = 0;
  let message = "";
  try {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        window.localStorage.setItem("logged-in", "true");

        status = 200;
        message = "You have signed in";
      })
      .catch((error: any) => {
        status = 400;

        if (error.code === "auth/invalid-email") {
          message = "Wrong Email or Password!";
        } else {
          message = "Something went wrong! Please try again!";
        }
      });

    return {
      status: status,
      message: message,
    };
  } catch (error: any) {
    return {
      status: 400,
      message: "Something went wrong! Please try again!",
    };
  }
};

export const sendEmailToVerify = (): Promise<{
  status: number;
  message: string;
}> => {
  return new Promise((resolve, reject) => {
    const auth: any = getAuth();
    let status = 0;
    let message = "";
    try {
      sendEmailVerification(auth.currentUser).then(() => {
        // Email verification sent!
        // ...
        status = 200;
        message = "email verification sent! to " + auth.currentUser.email;
        resolve({ status, message });
      });
    } catch (error) {
      status = 400;
      message = "something went wrong! Please try again";
      reject({ status, message });
    }
  });
};

export const sendResetPasswordEmail = (email: string) => {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      toast.info("Password reset email sent to " + email + "!");
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      toast.error(errorMessage);
      // ..
    });
};
export const logOut = (message?: any) => {
  auth
    .signOut()
    .then(() => {
      window.localStorage.setItem("logged-in", "false");
      toast.success("you have logged out");
      window.location.reload();
      if (message) {
        toast.success(message);
      }
    })
    .catch((e) => {
      toast.error(e.message);
    });
};

export const DeleteUser = () => {
  const auth = getAuth();
  const user: any = auth.currentUser;

  if (!checkIfTheLoginIsMoreThanTwoDays(user)) {
    deleteUser(user)
      .then(() => {
        deleteData("users", user.uid).then((res) => {
          if (res.status === 200) {
            toast.success("Your account has been deleted");
          } else {
            toast.error(
              "Something went wrong! Please Log out and log in again"
            );
          }

          window.localStorage.setItem("logged-in", "false");
          window.location.reload();
        });
      })
      .catch((error) => {
        toast.error(error.message);
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
