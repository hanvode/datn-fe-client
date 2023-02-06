import {
  faBars,
  faBowlRice,
  faCity,
  faDollar,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
// import { DateRange } from "react-date-range";
import { useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
// import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthenContext";
import useFetch from "../../hooks/useFetch";

const Header = ({ type }) => {
  const [destination, setDestination] = useState("");
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    minimum: 10000,
    maximum: 80000,
    distance: 9999999,
  });

  const { dispatch } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const city = useFetch("hotel/findCity");
  const category = useFetch("hotel/findType");
  // console.log(city)

  const handleChangeDistance = (e) => {
    setOptions((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 5000 : options[name] - 5000,
      };
    });
  };
  const handleSearch = () => {
    dispatch({ type: "NEW_SEARCH", payload: { destination, options } });
    navigate("/list-rice", { state: { destination, options } });
  };
  const handleClickCity = (city) => {
    navigate("/list-rice", {
      state: {
        destination: city,
        options: {
          minimum: 10000,
          maximum: 80000,
          distance: 9999999,
        },
      },
    });
    window.location.reload();
  };
  const handleClickType = (type) => {
    navigate("/list-rice", {
      state: {
        genre: type,
      },
    });
    window.location.reload();
  };

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className="headerList">
          <div
            className={
              type === "list" ? "headerListItem" : "headerListItem active"
            }
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faBowlRice} />
            <span>Restaurant</span>
          </div>
          <div className="headerListItem dropdown">
            <FontAwesomeIcon icon={faCity} />
            <span className="label">District</span>
            <ul className="cities">
              {city.loading
                ? ""
                : city.data &&
                  city.data.map((item) => (
                    <li key={item} onClick={() => handleClickCity(item)}>
                      {item}
                    </li>
                  ))}
            </ul>
          </div>
          <div className="headerListItem dropdown">
            <FontAwesomeIcon icon={faBars} />
            <span className="label">Category</span>
            <ul className="cities">
              {category.loading
                ? ""
                : category.data &&
                  category.data.map((item) => (
                    <li key={item} onClick={() => handleClickType(item)}>
                      {item}
                    </li>
                  ))}
            </ul>
          </div>
          <div className="headerListItem"  onClick={() => navigate("/list-followed")} >
            <FontAwesomeIcon icon={faHeart} />
            <span>Followed</span>
          </div>
        </div>
        {type !== "list" && (
          <>
            <h1 className="headerTitle">
              Have you a delicious, nutritious and affordable MEAL!
            </h1>
            <p className="headerDesc">
              Get rewarded for your meals – unlock instant savings of 15% or
              more with a free ComQuan account
            </p>
            {/* {!user ? (
              <button className="headerBtn">Sign in / Register</button>
            ) : (
              <></>
            )} */}
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faBowlRice} className="headerIcon" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="headerSearchInput"
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faBowlRice} className="headerIcon" />
                <input
                  type="number"
                  id="distance"
                  placeholder="How far ?"
                  className="headerSearchInput"
                  onChange={handleChangeDistance}
                />
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faDollar} className="headerIcon" />
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="headerSearchText"
                >{`Price · ${options.minimum} VND · ${options.maximum} VND`}</span>
                {openOptions && (
                  <div className="options">
                    <div className="optionItem">
                      <span className="optionText">Minimum</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.minimum <= 10000}
                          className="optionCounterButton"
                          onClick={() => handleOption("minimum", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.minimum}
                        </span>
                        <button
                          disabled={options.minimum >= 75000}
                          className="optionCounterButton"
                          onClick={() => handleOption("minimum", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Maximum</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.maximum <= 15000}
                          className="optionCounterButton"
                          onClick={() => handleOption("maximum", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.maximum}
                        </span>
                        <button
                          disabled={options.maximum >= 80000}
                          className="optionCounterButton"
                          onClick={() => handleOption("maximum", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="headerSearchItem">
                <button className="headerBtn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
