import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch.js";
import Loading from "./../images/loading.gif";
import "./propertyList.css";

const PropertyList = () => {
  const typeCount = useFetch("hotel/countByType");
  const navigate = useNavigate();
  const handleClickType = (e) => {
    navigate("/list-rice", {
      state: {
        genre: e,
      },
    });
  };
  const images = [
    "https://langchaixua.com/wp-content/uploads/2021/12/cua-hang-thuc-pham-chay-8.jpg",
    "https://www.austinchronicle.com/binary/0d3f/food_feature6.jpg",
    "https://img.freepik.com/premium-vector/free-shipping-badge-with-truck-illustrtaion_100456-1502.jpg",
  ];
  return (
    <div className="pList">
      {typeCount.loading ? (
        <div>
          <img src={Loading} alt="" style={{ width: "50%" }} />
        </div>
      ) : (
        <>
          {typeCount.data &&
            images.map((img, index) => (
              <div
                className="pListItem"
                key={index}
                onClick={() => handleClickType(typeCount.data[index]?.type)}
              >
                <img src={img} alt="" className="pListImg" />
                <div className="pListTitles">
                  <h1>{typeCount.data[index]?.genre}</h1>
                  <h2>{typeCount.data[index]?.count} hotels</h2>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default PropertyList;
