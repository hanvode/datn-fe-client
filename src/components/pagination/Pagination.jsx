import "./pagination.css";

const Pagination = ({ page, total, limit, setPage }) => {
  const totalPages = Math.ceil(total / limit);
  const handleClick = (newPage) => {
    setPage(newPage + 1);
  };

  return (
    <div className="pageContainer">
      {totalPages > 0 &&
        [...Array(totalPages)].map((val, index) => (
          <button
            onClick={() => handleClick(index)}
            className={page === index + 1 ? `pageBtn active` : `pageBtn`}
            key={index}
          >
            {index + 1}
          </button>
        ))}
    </div>
  );
};

export default Pagination;
