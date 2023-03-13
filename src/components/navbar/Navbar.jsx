import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthenContext";
import { API_URL } from "../../hooks/config";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import "./navbar.css";
import { io } from "socket.io-client";

const ENDPOINT = "https://datn-comment-realtime.onrender.com/";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getAllNotifications = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/user/notification/${user?._id}`
        );
        setNotifications(data);
      } catch (error) {
        console.log(error);
      }
    };
    user && getAllNotifications();
  }, [user?._id]);

  useEffect(() => {
    setSocket(io(ENDPOINT));
  }, []);

  useEffect(() => {
    if (socket && user) {
      socket.emit("joinRoom", user?._id);
    }
  }, [socket, user?._id]);

  useEffect(() => {
    if (socket) {
      socket.on("menuNotification", (msg) => {
        console.log(msg);
        setNotifications([msg, ...notifications]);
      });
      return () => socket.off("menuNotification");
    }
  }, [socket, notifications]);

  const handleLogout = async () => {
    await axios.post(`${API_URL}/auth/logout`);
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };
  const displayNotification = ({ content, createdAt }) => {
    return (
      <span className="notification">{`${content} vao luc ${createdAt}.`}</span>
    );
  };
  const handleRead = () => {
    setNotifications([]);
    setOpen(false);
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
              onClick={() =>
                navigate(`/edit`, { state: { user: user, dispatch: dispatch } })
              }
            >
              Hello {user.username} <img src={user.img} alt="avatar" />
            </div>
            <div className="item">
              <NotificationsNoneOutlinedIcon
                style={{ cursor: "pointer" }}
                className="icon"
                onClick={() => setOpen(!open)}
              />
              {notifications.length > 0 && (
                <div className="counter">{notifications.length}</div>
              )}
              {open && notifications.length > 0 && (
                <div className="notifications">
                  {notifications.map((n) => displayNotification(n))}
                  {notifications.length > 0 && (
                    <button className="navButton" onClick={handleRead}>
                      Mark as read
                    </button>
                  )}
                </div>
              )}
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
