import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./menu.css";
import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { AuthContext } from "../../context/AuthenContext";
import { API_URL } from "../../hooks/config";

const Menu = ({ setOpen, hotelId }) => {
  const { user } = useContext(AuthContext);
  const menu = useFetch(`hotel/menu/${hotelId}`);
  const menuList = useFetch(`hotel/menu-list/${hotelId}`);
  const [empty, setEmpty] = useState([]);

  // check-box example
  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value === "false" ? false : true;
    const index = e.target.id;
    setEmpty(
      checked
        ? [...empty, [index, !value]]
        : empty.filter((item) => item[0] !== index)
    );
  };

  const handleClick = async () => {
    try {
      await Promise.all(
        empty.map((foodId, index) => {
          const res = axios.put(`${API_URL}/hotel/isEmpty/${foodId[0]}`, {
            checked: foodId[1],
          });
          return res.data;
        })
      );
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {user?.isAdmin && user?.hotelOwn?.includes(hotelId) ? (
        <div className="menu">
          <div className="mContainer">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="mClose"
              onClick={() => setOpen(false)}
            />
            <h2>Select your foods: </h2>
            {menu?.data &&
              menu.data?.map((item) => (
                <div className="mItem" key={item?._id}>
                  <div className="mItemImg">
                    <img
                      src={item?.img}
                      alt="avatar of food"
                      className="foodImg"
                    />
                  </div>
                  <div className="mItemInfo">
                    <div className="mTitle">{item?.title}</div>
                    <div className="mDesc">{item?.desc}</div>
                    <div className="mPrice">{item?.price} VND</div>
                  </div>
                  <div className="mCheckEmpty">
                    {menuList?.data.map((i) => (
                      <div
                        key={i._id}
                        className={i.food === item._id ? "food" : "noFood"}
                      >
                        <label
                          htmlFor={i?._id}
                          className={i.isEmpty ? "mEmpty" : "mNoEmpty"}
                        >
                          {i.isEmpty ? "Không Có" : "Có"}
                        </label>
                        <input
                          type="checkbox"
                          id={i?._id}
                          value={i?.isEmpty}
                          onChange={handleSelect}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            <button className="mButton" onClick={handleClick}>
              Menu Now!
            </button>
          </div>
        </div>
      ) : (
        <div className="menu">
          <div className="mContainer">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="mClose"
              onClick={() => setOpen(false)}
            />
            <span>Today we have: </span>
            {menu?.data &&
              menu.data?.map((item) => (
                <div className="mItem" key={item?._id}>
                  <div className="mItemImg">
                    <img
                      src={item?.img}
                      alt="avatar of food"
                      className="foodImg"
                    />
                  </div>
                  <div className="mItemInfo">
                    <div className="mTitle">{item?.title}</div>
                    <div className="mDesc">{item?.desc}</div>
                    <div className="mPrice">{item?.price} VND</div>
                  </div>
                  <div className="mSelectedFood">
                    {menuList?.data.map((i) => (
                      <div
                        key={i._id}
                        className={i.food === item._id ? "food" : "noFood"}
                      >
                        <label
                          htmlFor={i?._id}
                          className={i.isEmpty ? "mEmpty" : "mNoEmpty"}
                        >
                          {i.isEmpty ? "Không Có" : "Có"}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
