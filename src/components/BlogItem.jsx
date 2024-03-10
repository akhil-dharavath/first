import React from "react";
import { Link } from "react-router-dom";
import Chip from "../components/Chip";

const BlogItem = ({
  blog: {
    description,
    title,
    createdAt,
    authorName,
    authorAvatar,
    cover,
    category,
    id,
    likes,
    comments,
  },
}) => {
  return (
    <div className="blogItem-wrap">
      <img className="blogItem-cover" src={cover} alt="cover" />
      <Chip label={category} />
      <h3>{title}</h3>
      <p className="blogItem-desc">{description}</p>
      <div className="d-flex justify-content-between mx-2">
        <p style={{marginBottom:0}}>🩶 {likes}</p>
        <p style={{marginBottom:0}}>💬 {comments.length}</p>
      </div>
      <footer>
        <div className="blogItem-author">
          {/* <img src={authorAvatar} alt='avatar' /> */}
          <p style={{ fontSize: 13, color: "black" }}>
            Created by <b>{authorName}</b> on {createdAt}
          </p>
          {/* <div>
            <h6>{authorName}</h6>
            <p>{createdAt}</p>
          </div> */}
        </div>
          <Link className="blogItem-link" to={`/blog/${id}`}>
            ➝
          </Link>
        {/* <p>❤️ {likes}</p> */}
      </footer>
    </div>
  );
};

export default BlogItem;
