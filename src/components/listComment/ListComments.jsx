import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../hooks/config";
import CommentItem from "../commentItem/CommentItem";
import Pagination from "../pagination/Pagination";
import Loading from "./../images/loading.gif";
import "./listComment.css";
const ListComments = ({ id, setComments, comments, socket, page, setPage }) => {
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllComments = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API_URL}/comment/${id}?page=${page}`
        );
        setComments(data.comments);
        setTotalPage(data.total);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getAllComments();
  }, [id, page, setComments]);
  return (
    <div>
      {loading ? (
        <div>
          <img src={Loading} alt="" style={{ width: "50%" }} />
        </div>
      ) : (
        <div className="comments_list">
          {comments?.map((comment) => (
            <CommentItem key={comment._id} comment={comment} socket={socket} />
          ))}
        </div>
      )}
      <Pagination
        page={page}
        limit={5}
        total={totalPage}
        setPage={(page) => setPage(page)}
      />
    </div>
  );
};

export default ListComments;
