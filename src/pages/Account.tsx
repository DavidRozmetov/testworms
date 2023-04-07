import React, { useEffect, useState } from "react";
import { DeleteUser, sendResetPasswordEmail } from "../firebase/googleAuth";
import "../scss/account.scss";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { readDocument, updateData } from "../firebase/firebaseCRUD";
import { toast } from "react-toastify";
import { BsUnlock } from "react-icons/bs";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { AiOutlineMail } from "react-icons/ai";
import { checkPasswordStrength } from "../firebase/checkPasswordStrength";
export const Account: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [collapsed, setCollapsed] = useState([false, true, true, true]); // Initially, both FAQs are collapsed

  const [toggleSave, setToggleSave] = useState(false);
  const [toggleSeeOldPassword, setToggleSeeOldPassword] = useState(false);
  const [toggleSeePassword, setToggleSeePassword] = useState(false);
  const [toggleSeeConfirmPassword, setToggleSeeConfirmPassword] =
    useState(false);
  const [lastSignInTime, setLastSignInTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userData, setUserData] = useState<{
    accountType: string;
    firstName: string;
    lastName: string;
    isVerifiedTeacher: boolean;
    role: string;
  }>();
  const [user, setUser] = useState<any>();
  const auth = getAuth();
  const [toggleAreYouSure, setToggleAreYouSure] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser?.email ? currentUser?.email : "");
        setLastSignInTime(
          currentUser &&
            currentUser.metadata &&
            currentUser.metadata.lastSignInTime
            ? new Date(currentUser.metadata.lastSignInTime)
            : new Date()
        );
        readDocument("users", currentUser.uid).then((res) => {
          setUserData(res.message);
          setFirstName(res.message.firstName);
          setLastName(res.message.lastName);
        });
      }
    });
  }, [auth]);

  return (
    <div className="account-page">
      <h1>Account</h1>
      <div className="div-form">
        <button
          onClick={(e) => {
            e.preventDefault();
            setCollapsed([!collapsed[0], true, true, true]);
          }}
          className="header-button"
        >
          <h2>{collapsed[0] ? "+" : "-"} Personal Details</h2>
        </button>
        {!collapsed[0] && (
          <div className="div-personal-details">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              onChange={(event) => {
                setFirstName(event.target.value);
                setToggleSave(
                  userData?.firstName !== event.target.value ||
                    userData?.lastName !== lastName
                );
              }}
              defaultValue={userData?.firstName}
            />
            <label htmlFor="lastName">First Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              onChange={(event) => {
                setLastName(event.target.value);

                setToggleSave(
                  userData?.firstName !== firstName ||
                    userData?.lastName !== event.target.value
                );
              }}
              defaultValue={userData?.lastName}
            />

            <button
              type="submit"
              className={`btn-submit ${
                toggleSave ? "btn-enabled" : "btn-disabled"
              }`}
              onClick={(event) => {
                if (toggleSave) {
                  if (firstName.trim().length < 2) {
                    toast.error("First Name is too Short!", {
                      autoClose: 2000,
                    });
                  } else if (lastName.trim().length < 2) {
                    toast.error("Last Name is too Short!", {
                      autoClose: 2000,
                    });
                  } else {
                    updateData("users", user.uid, {
                      firstName: firstName,
                      lastName: lastName,
                    }).then((res) => {
                      if (res.status === 200) {
                        toast.success("Updated Successfully!", {
                          autoClose: 2000,
                        });
                      } else {
                        toast.error(
                          "Something went wrong! Please refresh the page and try again",
                          {
                            autoClose: 3000,
                          }
                        );
                      }
                    });
                  }
                }
              }}
            >
              Save Changes
            </button>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setCollapsed([true, !collapsed[1], true, true]);
          }}
          className="header-button"
        >
          <h2>{collapsed[1] ? "+" : "-"} Change Password</h2>
        </button>

        {!collapsed[1] && (
          <div className="security">
            <label htmlFor="old-password">Old Password</label>
            <div className="input-line">
              <input
                className="security-input"
                type={toggleSeeOldPassword ? "text" : "password"}
                id="old-password"
                name="old-password"
                onChange={(event) => setOldPassword(event.target.value)}
              />
              {!toggleSeeOldPassword && (
                <RxEyeOpen
                  className="btn-eye"
                  onClick={(e) => {
                    setToggleSeeOldPassword(true);
                  }}
                />
              )}
              {toggleSeeOldPassword && (
                <RxEyeClosed
                  className="btn-eye"
                  onClick={(e) => {
                    setToggleSeeOldPassword(false);
                  }}
                />
              )}
            </div>
            <label htmlFor="password">Password</label>
            <div className="input-line">
              <input
                className="security-input"
                type={toggleSeePassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {!toggleSeePassword && (
                <RxEyeOpen
                  className="btn-eye"
                  onClick={(e) => {
                    setToggleSeePassword(true);
                  }}
                />
              )}
              {toggleSeePassword && (
                <RxEyeClosed
                  className="btn-eye"
                  onClick={(e) => {
                    setToggleSeePassword(false);
                  }}
                />
              )}
            </div>
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="input-line">
              <input
                className="security-input"
                type={toggleSeeConfirmPassword ? "text" : "password"}
                id="confirm-password"
                name="confirm-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              {!toggleSeeConfirmPassword && (
                <RxEyeOpen
                  className="btn-eye"
                  onClick={(e) => {
                    setToggleSeeConfirmPassword(true);
                  }}
                />
              )}
              {toggleSeeConfirmPassword && (
                <RxEyeClosed
                  className="btn-eye"
                  onClick={(e) => {
                    setToggleSeeConfirmPassword(false);
                  }}
                />
              )}
            </div>
            <div className="security-buttons">
              <button
                className="btn-change-password"
                onClick={async () => {
                  if (password !== confirmPassword) {
                    toast.error("Password and Confirm Password don't match", {
                      autoClose: 2000,
                    });
                  } else if (!checkPasswordStrength(password.trim())) {
                    toast.error("Password is too weak", {
                      autoClose: 2000,
                    });
                  } else {
                    try {
                      await signInWithEmailAndPassword(
                        auth,
                        email,
                        oldPassword
                      ).then((res) => {
                        updatePassword(user, password)
                          .then(() => {
                            toast.success("Your Password has been updated!", {
                              autoClose: 2000,
                            });
                          })
                          .catch((error) => {
                            toast.error(
                              "Something went wrong! Please ferfesh the page and try again!",
                              {
                                autoClose: 2000,
                              }
                            );
                          });
                      });
                    } catch (error) {
                      toast.error("The current password didn't match!", {
                        autoClose: 2000,
                      });
                    }
                  }
                }}
              >
                Change Password
              </button>
              <span className="break-or">or</span>
              <button
                className="btn-send-reset-email"
                onClick={() => {
                  sendResetPasswordEmail(email);
                  toast.success(
                    "Reset Password Link Has Been Sent To " + email,
                    {
                      autoClose: 2000,
                    }
                  );
                }}
              >
                <AiOutlineMail />
                <span className="btn-text">Send Reset Password Button</span>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setCollapsed([true, true, !collapsed[2], true]);

            const currentTime = new Date();
            setCurrentTime(currentTime);
          }}
          className="header-button"
        >
          <h2>{collapsed[2] ? "+" : "-"} Change Email</h2>
        </button>

        {!collapsed[2] && (
          <div className="email-div">
            {(currentTime.getTime() - lastSignInTime.getTime()) / (1000 * 60) <
              15 && (
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  defaultValue={user?.email || ""}
                />
                <button
                  className="btn-change-email"
                  onClick={(event) => {
                    console.log(email);
                    updateEmail(user, email)
                      .then(() => {
                        toast.success("Email changed successfully", {
                          autoClose: 2000,
                        });

                        sendEmailVerification(user).then(() => {
                          toast.success(
                            "Verification email sent. Please verify your new Email",
                            {
                              autoClose: 2000,
                            }
                          );
                        });
                      })
                      .catch((error) => {
                        console.log(error);
                        toast.error(
                          "Something went wrong! please try again later",
                          {
                            autoClose: 2000,
                          }
                        );
                      });
                  }}
                >
                  <BsUnlock /> Change
                </button>
              </div>
            )}

            {!(
              (currentTime.getTime() - lastSignInTime.getTime()) / (1000 * 60) <
              15
            ) && (
              <div className="div-relogin">
                <h3>Session Expired</h3>
                <p>
                  In order to change your email address, you have to be Signed
                  in in the last 15 minutes. Please Sign in again, and try again
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setCollapsed([true, true, true, !collapsed[3]]);
          }}
          className="header-button"
        >
          <h2>{collapsed[3] ? "+" : "-"} Account</h2>
        </button>
        {!collapsed[3] && (
          <div className="account-div">
            {toggleAreYouSure && (
              <div className="are-you-sure-container">
                <div
                  className="are-you-sure-background"
                  onClick={() => {
                    setToggleAreYouSure(false);
                  }}
                ></div>
                <div className="are-you-sure-div">
                  <span className="are-you-sure-message">
                    Deleting your account permenantly erases all your data. Are
                    you sure?
                  </span>
                  <div className="are-you-sure-buttons">
                    <button
                      onClick={() => {
                        setToggleAreYouSure(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-delete-my-account"
                      onClick={() => {
                        DeleteUser();
                      }}
                    >
                      Delete My account
                    </button>
                  </div>
                </div>
              </div>
            )}
            <button
              className="btn-delete-account"
              onClick={(e) => {
                setToggleAreYouSure(true);
              }}
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
