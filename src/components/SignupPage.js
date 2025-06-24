import React, { useState } from "react";
import '../css/signup.css'; // Import the CSS file

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "reader" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    alert(data.message || `Your ID: ${data.id}`);
  };

  return (
    <div className="signup-wrapper">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="form-title">Create An Account</h2>
        <p className="form-subtitle">
          Create an account to enjoy all the services<br />
         
        </p>

        <div className="form-group">
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    name="email"
    placeholder="Email Address"
    onChange={handleChange}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    name="password"
    placeholder="Password"
    onChange={handleChange}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="role">Role</label>
  <select id="role" name="role" onChange={handleChange}>
    <option value="reader">Reader</option>
    <option value="creator">Creator</option>
  </select>
</div>

        <button type="submit" className="signup-button">
          Create Account
        </button>

        <p className="login-link">
          Already Have An Account? <a href="/login">Login In</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
