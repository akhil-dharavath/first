import React, { useEffect, useState } from "react";
import BlogItem from "../components/BlogItem";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllBlogsApi, getTopStoriesApi } from "../api/blogs";
import { getUserApi } from "../api/authentication";
import axios from "axios";
import Chip from "../components/Chip";

const BlogList = ({ search }) => {
  const navigate = useNavigate();
  const location = useLocation().pathname.slice(1);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState([]);
  const [address, setAddress] = useState({});
  const [topStories, setTopStories] = useState([]);

  const getBlogs = async () => {
    const res = await getAllBlogsApi();
    if (res.data) {
      setBlogs(res.data);
    } else {
      alert(res.response.data.message);
    }
  };

  const getUser = async () => {
    const res = await getUserApi();
    if (res.data) {
      setUser(res.data);
    } else {
      alert(res.response.data.message);
    }
  };

  const getAddress = async () => {
    const res = await axios({ url: "https://ipapi.co/json/", method: "GET" });
    if (res && res.data) {
      setAddress(res.data);
    } else {
      alert("trouble finding your location");
    }
  };

  const getTopStories = async () => {
    if (address && address.region) {
      const res = await getTopStoriesApi(address.region);
      if (res && res.data) {
        setTopStories(res.data);
      } else {
        console.log(res);
        // alert(res.response.data.message);
      }
    }
  };

  useEffect(() => {
    getBlogs();
    if (!localStorage.getItem("token")) {
      navigate("/auth/login");
    } else {
      getUser();
    }
    // getAddress();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // getTopStories();
    // eslint-disable-next-line
  }, [address]);

  return (
    <>
      <div className="blogList-wrap app">
        {location === "" &&
          search === "" &&
          topStories &&
          topStories.length > 0 &&
          topStories.map((story) => (
            <div className="blogItem-wrap">
              <img
                className="blogItem-cover h-full mx-auto"
                src={story.thumbnail}
                alt="cover"
              />
              <Chip label={story.source} />
              <h3>{story.title}</h3>
              <p className="blogItem-desc">published: {story.date}</p>
              <div className="d-flex justify-content-between mx-2"></div>
              <footer>
                {/* <div className="blogItem-author">
                  <p style={{ fontSize: 13, color: "black" }}>
                    Created by <b>{authorName}</b> on {createdAt.slice(0, 10)}
                  </p>
                </div> */}
                <a
                  className="blogItem-link"
                  href={story.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  ➝
                </a>
              </footer>
            </div>
          ))}

        {location === "unsubscribed" ? (
          blogs && blogs.length > 0 ? (
            blogs
              .filter((blog) => {
                // Check if user.unSubscribed exists and contains blog._id
                return !(
                  user.unSubscribed && !user.unSubscribed.includes(blog._id)
                );
              })
              .filter(
                (blog) =>
                  search === undefined ||
                  blog.title.toLowerCase().includes(search)
              )
              .map((blog) => <BlogItem key={blog._id} blog={blog} />)
          ) : (
            <p className="text-center mt-5">Trouble finding blogs</p>
          )
        ) : blogs && blogs.length > 0 ? (
          blogs
            .filter((blog) => {
              // Check if user.unSubscribed exists and contains blog._id
              return !(
                user.unSubscribed && user.unSubscribed.includes(blog._id)
              );
            })
            .filter((blog) => blog.category.toLowerCase().includes(location))
            .filter(
              (blog) =>
                search === undefined ||
                blog.title.toLowerCase().includes(search)
            )
            .map((blog) => <BlogItem key={blog._id} blog={blog} />)
        ) : (
          <p className="text-center mt-5">Trouble finding blogs</p>
        )}
      </div>
    </>
  );
};

export default BlogList;
