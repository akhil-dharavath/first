import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chip from "../components/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { addCommentApi, openaiCommentApi } from "../api/blogs";
import { getAllUsers } from "../api/authentication";

const BlogItem = ({
  blog: {
    description,
    title,
    createdAt,
    authorName,
    cover,
    category,
    _id,
    likes,
    comments,
  },
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [comment, setComment] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment === "") {
      return;
    }
    const res = await addCommentApi(_id, comment);
    if (res.data) {
      handleClose();
      window.location.reload();
    } else {
      alert(res.response.data.message);
    }
  };

  const [users, setUsers] = useState({});
  const fetchAllUsers = async () => {
    const res = await getAllUsers();
    if (res.data) {
      setUsers(res.data);
    } else {
      alert("You are not Authorized");
    }
  };

  const generateComment = async () => {
    const res = await openaiCommentApi(title, description);
    if (res.data) {
      setComment(res.data);
    } else {
      alert(res.response.data.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="blogItem-wrap">
      <img className="blogItem-cover" src={cover} alt="cover" />
      <Chip label={category} />
      <h3>{title}</h3>
      <p className="blogItem-desc">{description}</p>
      <div className="d-flex justify-content-between mx-2">
        <p style={{ marginBottom: 0 }}>🩶 {likes}</p>
        <p
          style={{ marginBottom: 0, cursor: "pointer" }}
          onClick={handleClickOpen}
        >
          💬 {comments.length}
        </p>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          fullWidth
        >
          <DialogTitle id="responsive-dialog-title">
            Comments section
          </DialogTitle>
          <DialogContent>
            <div className="comments">
              {comments.length > 0 &&
                comments.map((comment, index) => (
                  // <div key={index}>{comment.user} {comment.comment}</div>
                  <div key={index} className="d-flex">
                    <img
                      src={require("../assets/author.jpg")}
                      alt="author"
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        marginRight: 10,
                        marginBottom: 10,
                      }}
                    />
                    <div className="text-black">
                    <b>
                      {users &&
                      users.length > 0 &&
                      users.filter((user) => user._id === comment.user).length >
                        0
                        ? users.filter((user) => user._id === comment.user)[0]
                            .username
                        : "Unknown"}
                    </b>
                    <br />
                    {comment.comment}
                  </div>
                  </div>
                ))}
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  width: "100%",
                  position: "relative",
                }}
              >
                <input
                  placeholder="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="comment-input"
                />
                {/*<button
                  className="btn btn-primary my-2 w-auto position-absolute"
                  style={{ right: "2%", top: "-3%" }}
                  type="submit"
                >
                  Post
              </button>*/}
              <div className="comment-buttons">
                <button
                  className="btn btn-primary my-2 mx-2 w-auto text-white"
                  onClick={() => generateComment()}
                >
                  Auto Generate
                </button>
                <button className="btn btn-primary my-2 w-auto" type="submit">
                  Post
                </button>
              </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <footer>
        <div className="blogItem-author">
          <p style={{ fontSize: 13, color: "black" }}>
            Created by <b>{authorName}</b> on {createdAt.slice(0, 10)}
          </p>
        </div>
        <Link className="blogItem-link" to={`/blog/${_id}`}>
          ➝
        </Link>
      </footer>
    </div>
  );
};

export default BlogItem;
