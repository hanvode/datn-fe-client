import axios from "axios";
import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthenContext";
import "./navbar.css";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await axios.post("/auth/logout")
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };
  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/">
          <span className="logo">Com Quan</span>
        </Link>
        {!user ? (
          <div className="navItems">
            <button className="navButton" onClick={() => navigate("/register")}>
              Register
            </button>
            <button className="navButton" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        ) : (
          <div className="navItems">
            <div
              className="navAvatar"
              onClick={() => navigate(`/edit`, { state: { user: user ,dispatch: dispatch} })}
            >
              Hello {user.username} <img src={user.img} alt="avatar" />
            </div>
            <button className="navButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Navbar;
