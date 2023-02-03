import { useContext, useEffect, useRef } from "react";
import "./commentForm.css";
import patchData from "../../hooks/patchData";
import axios from "axios";
import { AuthContext } from "../../context/AuthenContext";

const CommentForm = ({
  id,
  socket,
  rating,
  name,
  setReply,
  send,
  comment,
  userId,
}) => {
  const { user } = useContext(AuthContext);
  const nameRef = useRef(user?.username);
  const contentRef = useRef();
  useEffect(() => {
    if (user) {
    }
    if (name) {
      contentRef.current.innerHTML = `
        <a href="#!"
              style="color: crimson;
              font-weight: 600;
              text-transform: capitalize;"
          >${name}: </a>
      `;
    }
  }, [name, user]);

  const commentSubmit = async () => {
    const username = nameRef.current.value;
    const content = contentRef.current.innerHTML;

    if (!username.trim()) return alert("Name should not EMPTY!");
    if (contentRef.current.textContent.trim().length < 15)
      return alert(
        "Comment is too short, you should type at least 15 characters!"
      );
    const createdAt = new Date().toISOString();

    socket.emit("createComment", {
      username,
      content,
      hotelId: id,
      createdAt,
      rating,
      send,
      comment,
      userId,
    });
    if (send === "replyComment") {
      await axios.post(`/comment/reply`, {
        username,
        content,
        hotelId: id,
        createdAt,
        rating,
        userId,
      });
    } else {
      await axios.post(`/comment`, {
        username,
        content,
        hotelId: id,
        createdAt,
        rating,
        userId,
      });
    }
    if (rating && rating !== 0) {
      patchData(`/hotel/${id}`, { rating });
    }
    contentRef.current.innerHTML = "";
    if (setReply) setReply(false);
  };
  return (
    <div className="form_input">
      <p>Name</p>
      <input type="text" ref={nameRef} defaultValue={nameRef.current} />

      <p>Content</p>
      <div
        ref={contentRef}
        contentEditable="true"
        style={{
          height: "100px",
          border: "1px solid #ccc",
          padding: "5px 10px",
          outline: "none",
        }}
      />
      <button className="button" onClick={commentSubmit}>
        Send
      </button>
    </div>
  );
};

export default CommentForm;
