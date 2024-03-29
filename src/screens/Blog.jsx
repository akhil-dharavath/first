import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import EmptyList from "../components/EmptyList";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  deleteBlogApi,
  getOneBlogApi,
  subscribeApi,
  unSubscribeApi,
} from "../api/blogs";
import { getUserApi } from "../api/authentication";

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState({});
  const [subscribed, setSubscribed] = useState(null);

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
      const count = res.data.unSubscribed.filter((sub) => sub === id).length;
      setSubscribed(count === 0);
    } else {
      alert(res.response.data.messege);
    }
  };

  const navigate = useNavigate();
  const handleDelete = async () => {
    const res = await deleteBlogApi(id);
    if (res.data) {
      navigate("/");
    } else {
      alert(res.response.data.message);
    }
  };

  const handleSubscribe=async()=>{
    const res = await subscribeApi(id);
    if (res.data) {
      setSubscribed(true)
    } else {
      alert(res.response.data.message);
    }
  }

  const handleUnSubscribe=async()=>{
    const res = await unSubscribeApi(id);
    if (res.data) {
      setSubscribed(false)
    } else {
      alert(res.response.data.message);
    }
  }

  useEffect(() => {
    getBlog();
    getUser();
    // eslint-disable-next-line
  }, []);  

  return (
    <>
      <div className="d-flex align-items-center justify-content-between app">
        <Link className="blog-goBack" to="/">
          <span> &#8592;</span> <span>Go Back</span>
        </Link>
        <div style={{ width: "auto" }}>
          <Button
            color="primary"
            variant="outlined"
            sx={{ width: "auto" }}
            className="mx-2"
            onClick={() =>
              subscribed ? handleUnSubscribe() : handleSubscribe()
            }
          >
            {subscribed ? "Unsubscribe" : "Subscribe"}
          </Button>
          {user && user.role === "Moderator" && (
            <Button
              color="error"
              variant="outlined"
              sx={{ width: "auto" }}
              className="mx-2"
              onClick={() => handleDelete()}
            >
              Delete Blog
            </Button>
          )}
        </div>
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
          <p className="blog-desc">{blog.description} This is some dummy data Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure eum excepturi quasi corrupti doloribus quia fugit ipsam deserunt inventore iusto recusandae natus facere ipsum tempora, aliquam amet facilis aspernatur maiores! Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere fuga cupiditate ea deserunt? Molestias, accusamus assumenda. Autem minus voluptates expedita soluta molestiae, repellendus repudiandae consequuntur deserunt mollitia rerum est debitis! Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae voluptas, quis quae vitae quod assumenda aliquam porro asperiores unde hic natus a earum, mollitia soluta blanditiis debitis quasi. Ratione, architecto!</p>
        </div>
      ) : (
        <EmptyList />
      )}
    </>
  );
};

export default Blog;
