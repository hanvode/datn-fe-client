import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthenContext";
import CommentForm from "../commentForm/CommentForm";
import CommentCard from "./CommentCard";

let showComments = [];
const CommentItem = ({ comment, socket }) => {
  const {user} = useContext(AuthContext)
  const [reply, setReply] = useState(false);
  const [name, setName] = useState("");

  const [replyComment, setReplyComment] = useState([]);
  const [hideReply, setHideReply] = useState([]);
  const [next, setNext] = useState(3);

  const loadMore = () => {
    setNext(next + 3);
  };
  useEffect(() => {
    const loopWithSlice = () => {
      let start =
        comment.reply?.length - next < 0 ? 0 : comment.reply?.length - next;
      showComments = comment.reply?.slice(start, comment.reply?.length);
      setHideReply(start);
      setReplyComment(showComments);
    };
    loopWithSlice(next);
  }, [comment.reply, next]);

  const handleReply = (username) => {
    setReply(true);
    setName(username);
  };
  const hide = () => {
    setReply(false);
    setNext(3);
  };
  return (
    <>
      <CommentCard comment={comment}>
        <div className="nav_comment">
          <p onClick={() => handleReply(comment.username)}>Reply</p>
          {hideReply > 0 && (
            <p onClick={loadMore}>Load more {hideReply} comments</p>
          )}
          <p onClick={hide}>Hide Reply</p>
        </div>
        <div className="reply_comment">
          {replyComment?.map((rep) => (
            <CommentCard comment={rep} key={rep._id}>
              <div className="nav_comment">
                <p onClick={() => handleReply(rep.username)}>Reply</p>
              </div>
            </CommentCard>
          ))}
        </div>
        {reply && (
          <CommentForm
            id={comment._id}
            socket={socket}
            name={name}
            setReply={setReply}
            send="replyComment"
            comment={comment}
            userId={user?._id}
          />
        )}
      </CommentCard>
    </>
  );
};

export default CommentItem;
