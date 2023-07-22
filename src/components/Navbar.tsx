import { NavLink, useLocation } from "react-router-dom";
import { BtnLogout } from "./BtnLogout";
import { Logo } from "./Logo";
import { Profile } from "./Profile";
import {
  AiOutlineDashboard,
  AiOutlineLogin,
  AiOutlineFileSearch,
  AiOutlineLogout,
  AiOutlineMenu,
} from "react-icons/ai";
import { FcAbout } from "react-icons/fc";
import { BiHelpCircle } from "react-icons/bi";

import { useState } from "react";

export const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  const NavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? "nav-link active-nav-link" : "nav-link";
  };
  const ToggleClass = (toggle: Boolean) => {
    return toggle ? "nav-bar" : "nav-bar nav-bar-hidden";
  };

  const NavBarShownPages = [
    "",
    "about",
    "account",
    "help",
    "documentation",
    "upload-questions",
    "modify-books",
    "modify-questions",
    "create-quiz",
    "my-quizzes",
  ];

  return (
    <>
      <div className="nav-bar-mobile" id="nav-bar-mobile">
        <Logo />

        <div className="btn-menu" id="nav-mobile-menu">
          <AiOutlineMenu
            className="nav-bar-icon"
            onClick={() => {
              setToggle(!toggle);
            }}
          />
        </div>
      </div>

      {NavBarShownPages.includes(useLocation().pathname.split("/")[1]) && (
        <nav className={ToggleClass(toggle)} id="nav-bar">
          <div
            className="nav-bar-shadow"
            onClick={() => {
              setToggle(!toggle);
            }}
          ></div>
          <div className="nav-links">
            <Logo />
            <NavLink
              to="/"
              className={NavLinkClass}
              onClick={() => {
                setToggle(false);
              }}
            >
              <AiOutlineDashboard className="nav-link-icon" />{" "}
              <span className="nav-link-text"> Dashboard</span>
            </NavLink>
            <NavLink
              to="/about"
              className={NavLinkClass}
              onClick={() => {
                setToggle(false);
              }}
            >
              <FcAbout className="nav-link-icon" />
              <span className="nav-link-text"> About</span>
            </NavLink>
            <NavLink
              to="/signup"
              className={NavLinkClass}
              onClick={() => {
                setToggle(false);
              }}
            >
              <AiOutlineLogin className="nav-link-icon" />{" "}
              <span className="nav-link-text">Sign up</span>
            </NavLink>
            <NavLink
              to="/documentation"
              className={NavLinkClass}
              onClick={() => {
                setToggle(false);
              }}
            >
              <AiOutlineFileSearch className="nav-link-icon" />{" "}
              <span className="nav-link-text">Documentation</span>
            </NavLink>
          </div>
          <div className="sticky-footer">
            <NavLink to="/help" className={NavLinkClass}>
              <BiHelpCircle className="nav-link-icon" />{" "}
              <span className="nav-link-text">Help Center</span>
            </NavLink>
            <NavLink to="/login" className="nav-link btn-logout">
              <AiOutlineLogout className="nav-link-icon" />
              <BtnLogout />
            </NavLink>
            <span
              onClick={() => {
                setToggle(false);
              }}
            >
              <Profile />
            </span>
          </div>
        </nav>
      )}
    </>
  );
};
