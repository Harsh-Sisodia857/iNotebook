import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
  import {toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [credential, setCredential] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credential;
    if (password !== cpassword) {
      alert("Password does not match")
    }
    else {
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const json = await response.json();
      console.log(json);
      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        toast("Sign up Successfully")
        navigate("/");
      } else {
        toast.error(json.error);
      }
    };
  }
  const onChange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3 my-4">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            onChange={onChange}
            type="text"
            className="form-control"
            id="name"
            aria-describedby="emailHelp"
            name="name"
            required
          />
        </div>
        <div className="mb-3 my-4">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            onChange={onChange}
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            name="email"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            onChange={onChange}
            type="password"
            className="form-control"
            id="password"
            name="password"
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            onChange={onChange}
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            minLength={5}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
