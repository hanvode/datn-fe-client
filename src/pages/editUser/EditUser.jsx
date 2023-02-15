import "./editUser.css";
import { useContext, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthenContext";
import {
  checkLength,
  checkRequired,
} from "../../components/validate/ValidateForm";
import { API_URL } from "../../hooks/config";

const EditUser = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [file, setFile] = useState("");
  const [info, setInfo] = useState(user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let newUser = {
        ...info,
      };
      if (file !== "") {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
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
      let inputClassName = "editFormInput";
      try {
        axios.defaults.withCredentials = true;
        if (!checkRequired(inputArr, inputClassName)) {
          if (!checkLength(e.target.form[4], 4, inputClassName)) {
            const res = await axios.put(`${API_URL}/user/${info._id}`, newUser);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
            navigate("/");
          }
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="edit">
      <div className="editContainer">
        <div className="editTop">
          <h1>YOUR PROFILE</h1>
        </div>
        <div className="editBottom">
          <div className="editLeft">
            <img src={file ? URL.createObjectURL(file) : info?.img} alt="" />
          </div>
          <div className="editRight">
            <form>
              <div className="editFormInput">
                <label htmlFor="file">
                  Image:{" "}
                  <FontAwesomeIcon icon={faUpload} className="editIcon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  // style={{ display: "none" }}
                />
              </div>
              <div className="editFormInput">
                <label>UserName</label>
                <input
                  onChange={handleChange}
                  type="text"
                  value={info.username || ""}
                  id="username"
                />
                <span></span>
                <small></small>
              </div>
              <div className="editFormInput">
                <label>Email</label>
                <input
                  onChange={handleChange}
                  type="email"
                  value={info.email || ""}
                  id="email"
                />
                <span></span>
                <small></small>
              </div>
              <div className="editFormInput">
                <label>Phone</label>
                <input
                  onChange={handleChange}
                  type="text"
                  value={info.phone || ""}
                  id="phone"
                />
              </div>
              <div className="editFormInput">
                <label>Password</label>
                <input onChange={handleChange} type="password" id="password" />
                <span></span>
                <small></small>
              </div>
              <div className="editFormInput">
                <label>Age</label>
                <input
                  onChange={handleChange}
                  type="number"
                  value={info.age}
                  id="age"
                />
                <span></span>
                <small></small>
              </div>
              <div className="editFormInput">
                <label>Address</label>
                <input
                  onChange={handleChange}
                  type="text"
                  value={info.address || ""}
                  id="address"
                />
              </div>
              <button onClick={handleClick} className="editButton">
                Update
              </button>
              <button onClick={() => navigate("/")} className="editButton">
                Back to Home
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditUser;
