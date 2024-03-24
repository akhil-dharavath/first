import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../api/authentication";

const Login = () => {
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginApi(details);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } else {
      // alert(response.response.data.message);
    }
  };

  return (
    <div className="login">
      <div className="login-left"></div>
      <div className="log-sign-right">
        <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <h1 className="mb-4">Login to your account</h1>
          <Form.Group className="mb-4" style={{ textAlign: "left" }}>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              name="email"
              value={details.email}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-4" style={{ textAlign: "left" }}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              name="password"
              value={details.password}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Button type="submit">Login</Button>
          </Form.Group>
          <p>
            Don't have an account?{" "}
            <Link to="/auth/register">Create account</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
