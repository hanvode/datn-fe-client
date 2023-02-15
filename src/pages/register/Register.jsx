import "./register.css";
import { useState } from "react";
import { userInputs } from "../../formSource";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  checkLength,
  checkRequired,
} from "../../components/validate/ValidateForm";
import { API_URL } from "../../hooks/config";

const Register = () => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "upload");
    try {
      let newUser = {
        ...info,
      };
      if (file !== "") {
        axios.defaults.withCredentials = false;
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dnykvbriw/image/upload",
          data
        );
        const { url } = uploadRes.data;
        newUser = {
          ...info,
          img: url,
        };
      }
      let inputArr = [
        e.target.form[1],
        e.target.form[2],
        e.target.form[4],
        e.target.form[5],
      ];
      let inputClassName = "reFormInput";
      try {
        axios.defaults.withCredentials = true;
        if (!checkRequired(inputArr, inputClassName)) {
          if (!checkLength(e.target.form[4], 4, inputClassName)) {
            await axios.post(`${API_URL}/auth/register`, newUser);
            navigate("/login");
          }
        }
      } catch (error) {
        setError(error.response.data.message);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className="register">
      <div className="reContainer">
        <div className="reTop">
          <h1>REGISTER YOUR FREE ACCOUNT NOW</h1>
        </div>
        <div className="reBottom">
          <div className="reLeft">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="reRight">
            <form>
              <div className="reFormInput">
                <label htmlFor="file">
                  Image: <FontAwesomeIcon icon={faUpload} className="reIcon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  // style={{ display: "none" }}
                />
              </div>

              {userInputs.map((input) => (
                <div className="reFormInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                  <span></span>
                  <small></small>
                </div>
              ))}
              <button onClick={handleClick} className="reButton">
                Register
              </button>
              <button onClick={() => navigate("/")} className="reButton">
                Back to Home
              </button>
            </form>
            {error && <p className="reError">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
