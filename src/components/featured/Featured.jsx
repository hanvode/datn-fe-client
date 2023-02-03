import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch.js";
import "./featured.css";

const Featured = () => {
  const countCity = useFetch("hotel/countByCity");
  const navigate = useNavigate();
  const images = [
    "https://media1.nguoiduatin.vn/media/ngac-kim-giang/2021/03/28/top-5-nha-hang-sang-trong-ha-noi-steak1.jpg",
    "https://reviewtop.vn/wp-content/uploads/2021/03/quan-an-ngon-o-hoang-mai4.jpg",
    "https://foodi.com.vn/wp-content/uploads/2021/06/bo-to-quan-moc-4-1.jpg",
    "https://cdn.jamja.vn/blog/wp-content/uploads/2019/12/nha-hang-to-chuc-lien-hoan-cong-ty.jpg",
  ];
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
  };

  return (
    <div className="featured">
      {countCity.loading ? (
        "Loading data please wait"
      ) : (
        <>
          {countCity.data &&
            images.map((img, index) => (
              <div
                className="featuredItem"
                key={index}
                onClick={() => handleClickCity(countCity.data[index]?.city)}
              >
                <img src={img} alt="" className="featuredImg" />
                <div className="featuredTitles">
                  <h1>{countCity.data[index]?.city}</h1>
                  <h2>{countCity.data[index]?.count} hotels</h2>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default Featured;
