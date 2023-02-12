import "./listFollowed.css";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import SearchItem from "../../components/searchItem/SearchItem";
import { AuthContext } from "../../context/AuthenContext";
import { API_URL } from "../../hooks/config";

const ListFollowed = () => {
  const [list, setList] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getAllHotelFollowed = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/user/all-followed/${user?._id}`
        );
        setList(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      getAllHotelFollowed();
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainerF">
        <div className="listWrapperF">
          <div className="listFollowed">
            {!user ? (
              <h1 style={{ margin: "70px 0" }}>You must login</h1>
            ) : list.length === 0 ? (
              <h1 style={{ margin: "70px 0" }}>You don't follow anything</h1>
            ) : (
              <div>
                <h2 className="fTitle">Your Followed Hotel List</h2>
                {list &&
                  list.map((item) => <SearchItem item={item} key={item._id} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <MailList />
      <Footer />
    </div>
  );
};

export default ListFollowed;
