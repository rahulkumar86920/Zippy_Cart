import React, { useState } from "react";
import { loginStyles } from "./../assets/dummyStyles";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { useEffect } from "react";
import Logout from "./Logout";
import axios from "axios";

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken"))
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const Navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("authToken")));
    };
    window.addEventListener("authStateChanged", handler);
    return () => window.removeEventListener("authStateChanged", handler);
  }, []);

  // if the user is allready login then when user clicks on logout he will redurect to logout page
  if (isAuthenticated) {
    return <Logout />;
  }

  // form handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checked" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.remember) {
      setError("You must agree all terms and condition");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(user));

        setShowToast(true);
        window.dispatchEvent(new Event("authStateChanged"));

        setTimeout(() => {
          Navigate("/");
        }, 1000);
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Login error");
      } else {
        setError("unable to reach server");
      }
    }
  };

  return (
    <div className={loginStyles.page}>
      <Link to="/" className={loginStyles.backLink}>
        <FaArrowLeft className="mr-2" />
        Back To Home
      </Link>

      {/* Toast Notification */}
      {showToast && (
        <div className={loginStyles.toast}>
          <FaCheck className="mr-2" />
          Login Successful!
        </div>
      )}

      {/* Login Cart */}
      <div className={loginStyles.loginCard}>
        <div className={loginStyles.logoContainer}>
          <div className={loginStyles.logoOuter}>
            <div className={loginStyles.logoInner}>
              <FaUser className={loginStyles.logoIcon} />
            </div>
          </div>
        </div>

        <h2 className={loginStyles.title}>Welcome Back</h2>
        <form onSubmit={handleSubmit} className={loginStyles.form}>
          {/* Email */}
          <div className={loginStyles.inputContainer}>
            <FaUser className={loginStyles.inputIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className={loginStyles.input}
            />
          </div>
          {/* password */}
          <div className={loginStyles.inputContainer}>
            <FaLock className={loginStyles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
              required
              className={loginStyles.passwordInput}
            />

            {/* password toggle hide and see */}
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={loginStyles.toggleButton}
              aria-label={showPassword ? "hide password " : "show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* remember me  */}
          <div className={loginStyles.rememberContainer}>
            <label className={loginStyles.rememberLabel}>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className={loginStyles.rememberCheckbox}
                required
              />
              Remember Me
            </label>

            <Link to="#" className={loginStyles.forgotLink}>
              Forgot?
            </Link>
          </div>

          {error && <p className={loginStyles.error}> {error}</p>}
          <button type="submit" className={loginStyles.submitButton}>
            {" "}
            Sign In
          </button>
        </form>
        <p className={loginStyles.signupText}>
          Don't have an account? {""}
          <Link to="/signup" className={loginStyles.signupLink}>
            SignUp
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
