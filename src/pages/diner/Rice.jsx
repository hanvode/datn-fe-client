import "./rice.css";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faDollar,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthenContext";
import Menu from "../../components/menu/Menu";
import Rating from "../../components/rating/Rating";
import CommentForm from "../../components/commentForm/CommentForm";
import axios from "axios";
import Heart from "../../components/images/heart.svg";
import HeartFilled from "../../components/images/heartFilled.svg";
import { API_URL } from "../../hooks/config";
import Map from "../../components/map/Map";
import Loading from "./../../components/images/loading.gif";
import ListComments from "../../components/listComment/ListComments";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";

const Rice = ({ socket }) => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [page, setPage] = useState(1);
  // const pageEnd = useRef();

  // const [coords, setCoords] = useState(null);

  const { data, loading } = useFetch(`hotel/find/${id}`);
  const { user, dispatch } = useContext(AuthContext);
  const [follow, setFollow] = useState(user?.followings.includes(id));
  // console.log(user);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);

  // console.log(comments)
  //load all Comments
  // useEffect(() => {
  //   setLoading(true);
  //   const getAllComments = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${API_URL}/comment/${id}?page=${page}`
  //       );
  //       setComments(data.comments);
  //       setTotalPage(data.total);
  //       setLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getAllComments();
  // }, [id, page]);

  // useEffect(() => {
  //   const getCoords = async () => {
  //     // eslint-disable-next-line no-undef
  //     const results = await geocodeByAddress(
  //       `${data.address}, ${data.city}, Hanoi, Vietnam`
  //     );
  //     // eslint-disable-next-line no-undef
  //     const latlng = await getLatLng(results[0]);
  //     setCoords(latlng);
  //   };
  //   getCoords();
  // }, [data]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", id);
    }
  }, [socket, id]);

  useEffect(() => {
    if (socket) {
      socket.on("sendCommentToClient", (msg) => {
        setComments([msg, ...comments]);
      });
      return () => socket.off("sendCommentToClient");
    }
  }, [socket, comments]);

  //infinity scroll
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         setPage((prev) => prev + 1);
  //       }
  //     },
  //     {
  //       threshold: 0.1,
  //     }
  //   );
  //   observer.observe(pageEnd.current);
  // }, []);

  //Reply comment
  useEffect(() => {
    if (socket) {
      socket.on("sendReplyCommentToClient", (msg) => {
        const newArr = [...comments];
        newArr.forEach((cm) => {
          if (cm._id === msg._id) {
            const newReply = {
              username: msg.username,
              content: msg.content,
              hotelId: msg.hotelId,
              createdAt: msg.createdAt,
              rating: 0,
              userId: msg.userId,
            };
            cm.reply = [newReply, ...msg.reply];
          }
        });
        setComments(newArr);
      });
      return () => socket.off("sendReplyCommentToClient");
    }
  }, [socket, comments]);

  const handleOpen = (index) => {
    setSlideNumber(index);
    setOpen(true);
  };
  const handleOpenMenu = () => {
    //case user: show menu
    //case userChef: show menu can change, add, delete
    //case guest: navigate to login
    // if (user) {
    setOpenMenu(true);
    // } else {
    //   navigate("/login");
    // }
  };
  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }
    setSlideNumber(newSlideNumber);
  };
  const handleOpenReview = () => {
    setOpenReview((prev) => !prev);
  };
  const handleFollow = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        navigate("/login");
      } else {
        if (follow) {
          let createdAt = new Date().toISOString();
          socket.emit("follow", {
            content: `${user.username} unfollow ${data.name}`,
            followOwnerId: data.hotelOwnerId,
            createdAt,
          });
          await axios.post(`${API_URL}/user/notification`, {
            content: `${user.username} unfollow ${data.name}`,
            followOwnerId: [data.hotelOwnerId],
          });
          const res = await axios.put(`${API_URL}/user/${id}/unfollow`, {
            userId: user?._id,
          });
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
          setFollow(false);
        } else {
          let createdAt = new Date().toISOString();
          socket.emit("follow", {
            content: `${user.username} follow ${data.name}`,
            followOwnerId: data.hotelOwnerId,
            createdAt,
          });
          await axios.post(`${API_URL}/user/notification`, {
            content: `${user.username} follow ${data.name}`,
            followOwnerId: [data.hotelOwnerId],
          });
          const res = await axios.put(`${API_URL}/user/${id}/follow`, {
            userId: user?._id,
          });
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
          setFollow(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(data?.photos);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      {loading ? (
        <div>
          <img src={Loading} alt="" style={{ width: "50%" }} />
        </div>
      ) : (
        <>
          <div className="hotelContainer">
            {open && (
              <div className="slider">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="close"
                  onClick={() => setOpen(false)}
                />
                <FontAwesomeIcon
                  icon={faCircleArrowLeft}
                  className="arrow"
                  onClick={() => handleMove("l")}
                />
                <div className="sliderWrapper">
                  {data?.photos[slideNumber].split("/")[4] === "video" ? (
                    <div className="slideImg">
                      <VideoPlayer
                        id="demo-player"
                        publicId={`${data?.photos[slideNumber]
                          .split("/")[7]
                          .slice(0, 20)}`}
                        width="538px"
                        height="452px"
                      />
                    </div>
                  ) : (
                    <img
                      src={data.photos[slideNumber]}
                      alt=""
                      className="slideImg"
                    />
                  )}
                </div>
                <FontAwesomeIcon
                  icon={faCircleArrowRight}
                  className="arrow"
                  onClick={() => handleMove("r")}
                />
              </div>
            )}
            <div className="hotelWrapper">
              <button className="bookNow" onClick={handleOpenMenu}>
                SEE MENU
              </button>
              <div className="hotelT">
                <h1 className="hotelTitle">{data.name}</h1>
                <img
                  src={follow ? HeartFilled : Heart}
                  alt=""
                  className="iconFollow"
                  onClick={handleFollow}
                />
              </div>
              <Rating props={data} />
              <div className="hotelAddress">
                <FontAwesomeIcon icon={faLocationDot} />
                <span>
                  {data.address} - {data.city}
                </span>
              </div>
              <span className="hotelDistance">
                Excellent location - {data.distance}m from center
              </span>
              {/* <span className="hotelTitleHighLight">{data.title}</span> */}
              <span className="hotelTitleHighLight">
                {data?.genre?.map((genre) => (
                  <span
                    style={{
                      padding: "5px 8px",
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
              <div className="hotelPriceMin">
                <FontAwesomeIcon icon={faDollar} />
                <span>Starting from {data.cheapestPrice} VND</span>
              </div>
              <div className="hotelImages">
                {data.photos?.map((photo, index) => (
                  <div className="hotelImgWrapper" key={index}>
                    {photo.split("/")[4] === "video" ? (
                      <div>
                        <VideoPlayer
                          id="demo-player"
                          publicId={`${photo.split("/")[7].slice(0, 20)}`}
                          width="338px"
                          height="452px"
                        />
                      </div>
                    ) : (
                      <img
                        onClick={() => handleOpen(index)}
                        src={photo}
                        alt=""
                        className="hotelImg"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="hotelDetails">
                <div className="hotelDetailsTexts">
                  <h1 className="hotelTitle">{data.title}</h1>
                  <p className="hotelDesc">{data.desc}</p>
                  <div>
                    <Map
                      defaultCenter={`${data.address}, ${data.city}, Hanoi, Vietnam`}
                    />
                  </div>
                  <div className="comments">
                    <h2 className="app_title">Realtime comment</h2>
                    {openReview && (
                      <>
                        <div className="reviews">
                          <input
                            type="radio"
                            name="rate"
                            id="rd-5"
                            onChange={() => setRating(5)}
                          />
                          <label htmlFor="rd-5" className="fas fa-star"></label>

                          <input
                            type="radio"
                            name="rate"
                            id="rd-4"
                            onChange={() => setRating(4)}
                          />
                          <label htmlFor="rd-4" className="fas fa-star"></label>

                          <input
                            type="radio"
                            name="rate"
                            id="rd-3"
                            onChange={() => setRating(3)}
                          />
                          <label htmlFor="rd-3" className="fas fa-star"></label>

                          <input
                            type="radio"
                            name="rate"
                            id="rd-2"
                            onChange={() => setRating(2)}
                          />
                          <label htmlFor="rd-2" className="fas fa-star"></label>

                          <input
                            type="radio"
                            name="rate"
                            id="rd-1"
                            onChange={() => setRating(1)}
                          />
                          <label htmlFor="rd-1" className="fas fa-star"></label>
                        </div>
                        <CommentForm
                          id={id}
                          socket={socket}
                          rating={rating}
                          userId={user?._id}
                        />{" "}
                      </>
                    )}
                    {/* <div className="comments_list">
                      {comments?.map((comment) => (
                        <CommentItem
                          key={comment._id}
                          comment={comment}
                          socket={socket}
                        />
                      ))}
                    </div> */}
                    <ListComments
                      id={id}
                      page={page}
                      setPage={setPage}
                      socket={socket}
                      comments={comments}
                      setComments={setComments}
                    />
                  </div>
                  {/* <Pagination
                    page={page}
                    limit={5}
                    total={totalPage}
                    setPage={(page) => setPage(page)}
                  /> */}
                </div>
                <div className="hotelDetailsPrice">
                  <h1>Perfect meal for a good day!</h1>
                  <span>
                    Thank you for visiting us and having your first meal. It is
                    our goal that you are always happy with what you bought from
                    us, so please let us know how you feel. We look forward to
                    seeing you again!
                  </span>
                  <h2>
                    Starting from <b>{data.cheapestPrice}$ </b>
                  </h2>
                  <h4>Rating: {data.numReviews} reviews</h4>
                  <button onClick={handleOpenReview}>
                    Review and make a star
                  </button>
                </div>
              </div>
            </div>
            <MailList />
          </div>
        </>
      )}
      {openMenu && <Menu setOpen={setOpenMenu} hotelId={id} />}
      <Footer />
    </div>
  );
};
export default Rice;
