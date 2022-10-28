import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => { 
  const navigate = useNavigate();
  const [credential, setCredential] = useState({email : "", password : ""})
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credential.email,
        password: credential.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      // Save the authtoken and redirect
      localStorage.setItem('token', json.authtoken);
      toast("Login Successfully")
      navigate("/")
    }
    else
    {
      toast.error("Invalid Credential");
      }
  }
  const onChange = (e) => {
      setCredential({ ...credential,[e.target.name]: e.target.value });
    };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 my-4">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            name="email"
            value={credential.email}
            onChange= {onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={credential.password}
            onChange= {onChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
