import { NavLink } from "react-router-dom";
import { BtnLogout } from "./BtnLogout";
import { Logo } from "./Logo";
import { Profile } from "./Profile";
import {
  AiOutlineDashboard,
  AiOutlineLogin,
  AiOutlineFileSearch,
  AiOutlineLogout,
} from "react-icons/ai";
import { FcAbout } from "react-icons/fc";
import { BiHelpCircle } from "react-icons/bi";

export const Navbar = () => {
  const NavLinkStyles = ({ isActive }: { isActive: boolean }) => {
    return {
      background: isActive ? "#f7f7fb" : "#ffffff",
      fontSize: isActive ? "23px" : "22px",
      borderRight: isActive ? "solid #4040f2 5px" : "none",
      color: isActive ? "#4040f2" : "#0a3749",
    };
  };

  return (
    <nav className="nav-bar" id="nav-bar">
      <a href="/">
        <Logo />
      </a>
      <div className="nav-links">
        <NavLink to="/" className="nav-link" style={NavLinkStyles}>
          <AiOutlineDashboard /> <text> Dashboard</text>
        </NavLink>
        <NavLink to="/about" className="nav-link" style={NavLinkStyles}>
          <FcAbout />
          <text> About</text>
        </NavLink>
        <NavLink to="/signup" className="nav-link" style={NavLinkStyles}>
          <AiOutlineLogin /> <text>Sign up</text>
        </NavLink>
        <NavLink to="/documentation" className="nav-link" style={NavLinkStyles}>
          <AiOutlineFileSearch /> <text>Documentation</text>
        </NavLink>
      </div>
      <div className="sticky-footer">
        <NavLink
          to="/help"
          className="nav-link nav-link-help"
          style={NavLinkStyles}
        >
          <BiHelpCircle /> <text>Help Center</text>
        </NavLink>
        <NavLink to="/" className="nav-link btn-logout">
          <AiOutlineLogout />
          <BtnLogout />
        </NavLink>
        <Profile />
      </div>
    </nav>
  );
};
