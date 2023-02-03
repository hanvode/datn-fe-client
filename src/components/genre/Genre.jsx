import "./genre.css";

const Genre = ({ genres, filterGenre, setFilterGenre ,setPage}) => {
  const handleChange = ({ currentTarget: input }) => {
    if (input.checked) {
      const state = [...filterGenre, input.value];
      setFilterGenre(state);
      setPage(1)
    } else {
      const state = filterGenre.filter((val) => val !== input.value);
      setFilterGenre(state);
      setPage(1)
    }
  };
  return (
    <div className="genreWrapper">
      <h1 className="heading">Filter By Genre</h1>
      <div className="genreContainer">
        {genres.map((genre) => (
          <div className="genre" key={genre}>
            <input
              type="checkbox"
              value={genre}
              onChange={handleChange}
              className="genreInput"
            />
            <label className="genreLabel">{genre}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genre;
