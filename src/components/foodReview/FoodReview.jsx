import useFetch from "../../hooks/useFetch";
import "./foodReview.css";
import { Link } from "react-router-dom";

const FoodReview = () => {
  const featuredHotel = useFetch(`hotel?featured=true&limit=4`);
  return (
    <div className="fp">
      {featuredHotel.loading ? (
        "Loading please wait"
      ) : (
        <>
          {featuredHotel.data.map((item) => (
            <div className="fpItem" key={item._id}>
              <Link to={`/list-rice/${item._id}`}>
                <img src={item.photos[0]} alt="" className="fpImg" />
              </Link>
              <span className="fpName">{item.name}</span>
              <span className="fpCity"> {item.address} - {item.city}</span>
              <span className="fpPrice"> 
                Starting from {item.cheapestPrice}
              </span>
              {item.numReviews > 0 && (
                <div className="fpRating">
                  <button>{(item.rating / item.numReviews).toFixed(2)}</button>
                  <span>Excellent</span>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FoodReview;
