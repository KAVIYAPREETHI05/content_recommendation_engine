import React, { useState } from "react";
import "../css/login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ id: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save JWT token to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userRole", data.role);

        alert(data.message || "Login successful");

        // ✅ Redirect based on role
        if (data.role === "creator") {
          navigate(`/creator/${data.id}/dashboard`);
        } else if (data.role === "reader") {
          navigate(`/reader/${data.id}/dashboard`);
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Login to Your Account</h2>
        <p className="form-subtitle">Welcome back! Please enter your credentials.</p>

        <div className="form-group">
          <label htmlFor="id">ReaderID / CreatorID</label>
          <input
            type="text"
            name="id"
            placeholder="ReaderID / CreatorID"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Login</button>

        <p className="form-footer">
          Don’t Have An Account?{" "}
          <a href="/signup">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
