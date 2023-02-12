import { Link } from "react-router-dom";
import "./searchItem.css";

const SearchItem = ({ item }) => {
  return (
    <div className="searchItem">
      <img src={item?.photos[0]} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{item?.name}</h1>
        <span className="siDistance">{item?.distance} m from center</span>
        <span className="siAddress">
          {item?.address} - {item?.city}
        </span>
        <span className="siSubtitle">
          {item.genre.map((genre) => (
            <span
              style={{
                padding: "3px 5px",
                marginRight: "10px",
                border: "1px solid #008009",
                borderRadius: "10px",
                textAlign: "center",
                fontWeight: "500",
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                color: "green",
              }}
              key={genre}
            >
              {genre}
            </span>
          ))}
        </span>
        <span className="siFeatures">{item?.title}</span>
        <span className="siCancelOp">{item?.numReviews} reviews </span>
        <span className="siCancelOpSubtitle">
          {item?.followers.length === 0
            ? `You are welcome`
            : item?.followers.length === 1
            ? `1 person following`
            : `${item?.followers.length} people following`}
        </span>
      </div>
      <div className="siDetails">
        {item?.numReviews > 0 && (
          <div className="siRating">
            <span>Rating</span>
            <button>{(item.rating / item.numReviews).toFixed(2)}</button>
          </div>
        )}
        <div className="siDetailTexts">
          <span className="siPrice">{item?.cheapestPrice}VND</span>
          <Link to={`/list-rice/${item._id}`}>
            <button className="siCheckButton">See Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
