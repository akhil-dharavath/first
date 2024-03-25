import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import EmptyList from "../components/EmptyList";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteBlogApi, getOneBlogApi } from "../api/blogs";
import { getUserApi } from "../api/authentication";

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState({});

  const getBlog = async () => {
    const res = await getOneBlogApi(id);
    if (res.data) {
      setBlog(res.data);
    } else {
      alert(res.response.data.messege);
    }
  };

  const getUser = async () => {
    const res = await getUserApi();
    if (res.data) {
      setUser(res.data);
    } else {
      alert(res.response.data.messege);
    }
  };

  useEffect(() => {
    getUser();
    getBlog();
    // eslint-disable-next-line
  }, []);

  const navigate = useNavigate();
  const handleDelete = async () => {
    const res = await deleteBlogApi(id);
    if (res.data) {
      navigate("/");
    } else {
      alert(res.response.data.message);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <Link className="blog-goBack" to="/">
          <span> &#8592;</span> <span>Go Back</span>
        </Link>
        {user && user.role === "Moderator" && (
          <Button
            color="error"
            variant="outlined"
            sx={{ width: "auto" }}
            onClick={() => handleDelete()}
          >
            Delete Blog
          </Button>
        )}
      </div>
      {blog ? (
        <div className="blog-wrap">
          <header>
            <p className="blog-date">
              Published by <b>{blog.authorName}</b> on{" "}
              {blog.createdAt.slice(0, 10)}
            </p>
            <h1>{blog.title}</h1>
          </header>
          <img src={blog.cover} alt="cover" />
          <p className="blog-desc">{blog.description}</p>
        </div>
      ) : (
        <EmptyList />
      )}
    </>
  );
};

export default Blog;
