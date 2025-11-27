import styles from "../../styles/signup.module.css";
import { useState } from 'react';
import { preSignup, signup } from '../../actions/auth';
import Router from 'next/router';
import Link from "next/link";

const SignupComponent = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    error: '',
    loading: false,
    message: '',
    showForm: true,
    token: ''
  });

  const {
    name,
    email,
    username,
    password,
    confirmPassword,
    error,
    loading,
    message,
    showForm,
    token
  } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  // Step 1: Send email for activation
  const handlePreSignup = async (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });

    try {
      const data = await preSignup({ name, email, username });
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({ ...values, message: data.message, showForm: false, loading: false });
      }
    } catch (err) {
      setValues({ ...values, error: 'Pre-signup failed', loading: false });
    }
  };

  // Step 2: Complete signup with password
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setValues({ ...values, error: "Passwords do not match" });
      return;
    }
    setValues({ ...values, loading: true, error: false });

    try {
      const data = await signup({ token, password });
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          message: data.message,
          showForm: false,
          loading: false,
        });
        // Optionally redirect to signin
        setTimeout(() => Router.push("/signin"), 2000);
      }
    } catch (err) {
      setValues({ ...values, error: "Signup failed", loading: false });
    }
  };

  const showLoading = () => (loading ? <div className={styles.showLoading}>Loading...</div> : null);
  const showError = () => (error ? <div className={styles.showError}>{error}</div> : null);
  const showMessage = () => (message ? <div className={styles.showMessage}>{message}</div> : null);

  // Pre-signup form
  const preSignupForm = () => (
    <form onSubmit={handlePreSignup}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={handleChange("name")}
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleChange("username")}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleChange("email")}
        autoComplete="email"
        required
      />
      <button className={styles.button}>Register</button>
    </form>
  );

  // Password setup form after email activation
  const signupForm = () => (
    <form onSubmit={handleSignup}>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChange("password")}
        autoComplete="new-password"
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={handleChange("confirmPassword")}
        autoComplete="new-password"
        required
      />
      <input
        type="hidden"
        value={token}
        onChange={handleChange("token")}
      />
      <button className={styles.button}>Complete Signup</button>
    </form>
  );

  return (
    <div className={styles.backImg}>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm ? preSignupForm() : signupForm()}
      <div style={{ marginTop: "20px" }}>
        <Link href="/signin">Already have an account? Sign in</Link>
      </div>
    </div>
  );
};

export default SignupComponent;
