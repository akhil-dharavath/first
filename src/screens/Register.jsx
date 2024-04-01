import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/authentication";

const Register = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    username: "",
    email: "",
    password: "",
    role:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerApi(details);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } else {
      alert(response.response.data.message);
    }
  };

  return (
    <div className="register">
      <div className="signin-left"></div>
      <div className="log-sign-right">
        <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <h1 className="mb-4">Create an account</h1>
          <Form.Group className="mb-3" style={{ textAlign: "left" }}>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Full Name"
              name="username"
              value={details.username}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-3" style={{ textAlign: "left" }}>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              name="email"
              value={details.email}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-3" style={{ textAlign: "left" }}>
            <Form.Label>Role (Administrator, Moderator, Student, Staff)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Role"
              name="role"
              value={details.role}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-5" style={{ textAlign: "left" }}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              name="password"
              value={details.password}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Button type="submit">Register</Button>
          </Form.Group>
          <p>
            Already have an account? <Link to="/auth/login">Login</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Register;
