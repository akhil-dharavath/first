import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Blog from "./pages/Blog";
import Home from "./pages/Home";
import Header from "./components/common/Header";

const sections = [
  { title: 'Academic', url: '#' },
  { title: 'Career', url: '#' },
  { title: 'Campus', url: '#' },
  { title: 'Culture', url: '#' },
  { title: 'Local Community', url: '#' },
  { title: 'Social', url: '#' },
  { title: 'Sports', url: '#' },
  { title: 'Health and Wellness', url: '#' },
  { title: 'Technology', url: '#' },
  { title: 'Travel', url: '#' },
  { title: 'Alumni', url: '#' },
];












const App = () => {
  return (
    <div className="app">
    <BrowserRouter>
      <Header title="Blog" sections={sections} />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
};

export default App;
