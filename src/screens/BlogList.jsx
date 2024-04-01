import React, { useEffect, useState } from "react";
import BlogItem from "../components/BlogItem";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllBlogsApi} from "../api/blogs";
import { getUserApi } from "../api/authentication";

const BlogList = ({ search }) => {
  const navigate = useNavigate();
  const location = useLocation().pathname.slice(1);
  
  const [blogs, setBlogs] = useState([]);
  const getBlogs = async () => {
    const res = await getAllBlogsApi();
    if (res.data) {
      setBlogs(res.data);
    } else {
      alert(res.response.data.message);
    }
  };
  
  const [user, setUser] = useState([]);
  const getUser = async () => {
    const res = await getUserApi();
    if (res.data) {
      setUser(res.data);
    } else {
      alert(res.response.data.message);
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

  return (
    <>
      <div className="blogList-wrap app">
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
