import React, { useEffect, useState } from "react";
import BlogItem from "../components/BlogItem";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllBlogsApi } from "../api/blogs";

const BlogList = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname.slice(1);
  const [blogs, setBlogs] = useState([]);

  const getBlogs = async () => {
    const res = await getAllBlogsApi();
    if (res.data) {
      setBlogs(res.data);
    } else {
      // alert(res.response.data.message);
    }
  };
  // useEffect(() => {
  //   if (!localStorage.getItem("token")) {
  //     navigate("/auth/login");
  //   }
  //   // eslint-disable-next-line
  // }, [location]);
  
  useEffect(()=>{
    getBlogs();
    if (!localStorage.getItem("token")) {
      navigate("/auth/login");
    }
    // eslint-disable-next-line
  },[])

  return (
    <>
      <div className="blogList-wrap">
        {blogs && blogs.length > 0 ? (
          blogs
            .filter((blog) => blog.category.toLowerCase().includes(location))
            .map((blog) => <BlogItem key={blog._id} blog={blog} />)
        ) : (
          <p className="text-center mt-5">Trouble finding blogs</p>
        )}
      </div>
    </>
  );
};

export default BlogList;
