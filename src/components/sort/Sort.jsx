import "./sort.css";

const Sort = ({ sort, setSort }) => {
  const handleChange = ({ currentTarget: input }) => {
    setSort({ sort: input.value, order: sort.order });
  };
  const handleClick = () => {
    if (sort.order === "asc") {
      setSort({ sort: sort.sort, order: "desc" });
    } else {
      setSort({ sort: sort.sort, order: "asc" });
    }
  };
  return (
    <div className="sortContainer">
      <p className="sortBy">Sort By : </p>
      <select
        className="select"
        defaultValue={sort.sort}
        onChange={handleChange}
      >
        <option value="rating">Rating</option>
        <option value="distance">Distance</option>
        <option value="cheapestPrice">Price</option>
      </select>
      <button className="arrowBtn" onClick={handleClick}>
        <p className="upArrow">&uarr;</p>
        <p className="downArrow">&darr;</p>
      </button>
    </div>
  );
};

export default Sort;
