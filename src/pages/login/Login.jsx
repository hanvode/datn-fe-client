import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkLengthLogin, checkRequiredLogin } from "../../components/validate/ValidateForm";
import { AuthContext } from "../../context/AuthenContext";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });
  const navigate = useNavigate();
  const { loading, error, dispatch } = useContext(AuthContext);
  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let inputArr = [e.target.form[0], e.target.form[1]];
    let inputClassName = "lFormInput"
    if (!checkRequiredLogin(inputArr,inputClassName)) {
      if (!checkLengthLogin(e.target.form[1], 4,inputClassName)) {
        dispatch({ type: "LOGIN_START" });
        try {
          const res = await axios.post("/auth/login", credentials);
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
          navigate("/");
        } catch (error) {
          dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
        }
      }
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <h1 className="lTitle">LOGIN HERE</h1>
        <form>
          <div className="lFormInput">
            <input
              type="text"
              id="username"
              className="lInput"
              onChange={handleChange}
              placeholder="Username"
              required
            />
            <span></span>
            <small></small>
          </div>
          <div className="lFormInput">
            <input
              type="password"
              id="password"
              className="lInput"
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <span></span>
            <small></small>
          </div>

          <button disabled={loading} onClick={handleClick} className="lButton">
            Login
          </button>
          <div className="lSmallRegister">
            You don't have an account? <Link to="/register">Register</Link> now
          </div>
        </form>
          {error && <p className="lError">{error.message}</p>}
      </div>
    </div>
  );
};

export default Login;
