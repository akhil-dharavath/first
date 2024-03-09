import React from "react";
import EmptyList from "../../components/common/EmptyList";
import BlogList from "../../components/Home/BlogList";
import { blogList } from "../../config/data";
import './style.css'

const Home = () => {
  return (
    <div className="home">
      {/* Blog List & Empty View */}
      {!blogList.length ? <EmptyList /> : <BlogList blogs={blogList} />}
    </div>
  );
};

export default Home;
