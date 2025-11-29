import { useState } from "react";

const AuthForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Update form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      console.error(err);
      setMessage("Server error during signup");
    }
  };

  // SIGNIN
  const handleSignin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setMessage("Signin successful");
      } else {
        setMessage(data.error || "Signin failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error during signin");
    }
  };

  // SIGNOUT
  const handleSignout = () => {
    localStorage.removeItem("token");
    setMessage("Signed out successfully");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Auth Form</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
      </form>

      <hr />

      <form onSubmit={handleSignin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Signin</button>
      </form>

      <hr />

      <button onClick={handleSignout}>Signout</button>
    </div>
  );
};

export default AuthForm;
