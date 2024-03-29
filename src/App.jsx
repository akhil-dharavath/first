import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Blog from "./screens/Blog";
import Header from "./components/Header";
import BlogList from "./screens/BlogList";
import Register from "./screens/Register";
import Login from "./screens/Login";
import PageNotFound from "./screens/PageNotFound";

const sections = [
  { title: "Academic", url: "academic" },
  { title: "Career", url: "career" },
  { title: "Campus", url: "campus" },
  { title: "Culture", url: "culture" },
  { title: "Local Community", url: "local" },
  { title: "Social", url: "social" },
  { title: "Sports", url: "sports" },
  { title: "Health and Wellness", url: "health" },
  { title: "Technology", url: "technology" },
  { title: "Travel", url: "travel" },
  { title: "Alumni", url: "alumni" },
];

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Header title="WisdomNest" sections={sections} />
        <Routes>
          <Route path="/" exact element={<BlogList />} />
          {sections.map((section) => (
            <Route
              key={section.url}
              path={`/${section.url}`}
              exact
              element={<BlogList />}
            />
          ))}
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
