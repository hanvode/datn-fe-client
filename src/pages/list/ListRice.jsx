import "./listRice.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import SearchItem from "../../components/searchItem/SearchItem";
import { useEffect } from "react";
import axios from "axios";
import Pagination from "../../components/pagination/Pagination";
import Footer from "../../components/footer/Footer";
import MailList from "../../components/mailList/MailList";
import Sort from "../../components/sort/Sort";
import Genre from "../../components/genre/Genre";

const ListRice = () => {
  const location = useLocation();
  const [options, setOptions] = useState(
    location.state.options
      ? { ...location.state.options, destination: location.state.destination }
      : {
          minimum: 10000,
          maximum: 80000,
          distance: 9999999,
          destination: "",
        }
  );
  const [obj, setObj] = useState({});
  const [list, setList] = useState([]);
  const [sort, setSort] = useState({ sort: "rating", order: "desc" });
  const [filterGenre, setFilterGenre] = useState([location.state.genre] || []);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const getAllHotels = async () => {
      try {
        const { data } = await axios.get(
          `/hotel/all?page=${page}&sort=${sort.sort},${
            sort.order
          }&genre=${filterGenre.toString()}&search=${options.destination}&min=${
            options.minimum
          }&max=${options.maximum}&distance=${options.distance}`
        );
        setList(data.hotels);
        setObj(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllHotels();
  }, [sort, page, filterGenre,options]);
  const handleClick = async () => {
    setPage(1);
    const { data } = await axios.get(
      `/hotel/all?page=${page}&sort=${sort.sort},${
        sort.order
      }&genre=${filterGenre.toString()}&search=${options.destination}&min=${
        options.minimum
      }&max=${options.maximum}&distance=${options.distance}`
    );
    setList(data.hotels);
  };
  const handleChange = (e) => {
    setOptions((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <Sort sort={sort} setSort={(sort) => setSort(sort)} />
            <Genre
              filterGenre={filterGenre}
              genres={obj.genres ? obj.genres : []}
              setFilterGenre={(genre) => setFilterGenre(genre)}
              setPage={(page) => setPage(page)}
            />
            <div className="lsItem">
              <label>Destination</label>
              <input
                type="text"
                placeholder={options.destination}
                id="destination"
                onChange={handleChange}
              />
            </div>
            <div className="lsOption">
              <label>Options</label>
              <div className="lsOption">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min Price <small> / person</small>(VND)
                  </span>
                  <input
                    type="number"
                    id="minimum"
                    min={10000}
                    placeholder={options.minimum}
                    onChange={handleChange}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max Price <small> / person</small> (VND)
                  </span>
                  <input
                    type="number"
                    id="maximum"
                    placeholder={options.maximum}
                    onChange={handleChange}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Distance </span>
                  <input
                    type="number"
                    id="distance"
                    className="lsOptionInput"
                    onChange={handleChange}
                    placeholder={options.distance}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick} className="lsSearch">
              Search
            </button>
          </div>
          <div className="listResult">
            {list.length === 0 ? (
              <h1>No information yet! Please search again</h1>
            ) : (
              <div>
                {list &&
                  list.map((item) => <SearchItem item={item} key={item._id} />)}
              </div>
            )}
            <Pagination
              page={page}
              limit={obj.limit ? obj.limit : 0}
              total={obj.total ? obj.total : 0}
              setPage={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>
      <MailList />
      <Footer />
    </div>
  );
};

export default ListRice;
