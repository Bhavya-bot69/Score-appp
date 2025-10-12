import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { validateEmail, validatePassword } from "../utils/authHelpers";
import { generateCaptcha, drawCaptcha } from "../utils/captcha";
import "../styles/Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { signUp, login } = useApp();

  useEffect(() => {
    refreshCaptcha();
  }, []);

  useEffect(() => {
    if (formData.password) {
      const { criteria } = validatePassword(formData.password);
      setPasswordCriteria(criteria);
    }
  }, [formData.password]);

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptchaText(newCaptcha);
    if (canvasRef.current) {
      drawCaptcha(canvasRef.current, newCaptcha);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    const { isValid: passwordValid } = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordValid) {
      newErrors.password = "Password does not meet all requirements";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!captchaInput) {
      newErrors.captcha = "Please enter the captcha";
    } else if (captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
      newErrors.captcha = "Captcha is incorrect";
      refreshCaptcha();
      setCaptchaInput("");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(formData.email, formData.password, formData.name);

      if (!result.success) {
        // Handle specific Supabase errors
        let errorMessage = result.error;
        if (result.error.includes("already registered")) {
          errorMessage = "Email already registered";
        }
        setErrors({ general: errorMessage });
        setLoading(false);
        return;
      }

      // For Supabase, user might need to confirm email
      if (result.data.user && !result.data.session) {
        setErrors({ 
          general: "Please check your email and click the confirmation link to complete registration." 
        });
        setLoading(false);
        return;
      }

      // If user is immediately available (email confirmation disabled)
      if (result.data.user) {
        login(result.data.user);
        navigate("/admin/events");
      }

    } catch (error) {
      console.error(error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up to get started</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message" style={{ textAlign: "center" }}>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              placeholder="Enter your full name"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setShowCriteria(true)}
              className={errors.password ? "error" : ""}
              placeholder="Create a strong password"
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}

            {showCriteria && (
              <div className="password-criteria">
                <p>Password must contain:</p>
                <div className={`criteria-item ${passwordCriteria.length ? "valid" : "invalid"}`}>
                  <span className="criteria-icon">{passwordCriteria.length ? "✓" : "✗"}</span>
                  <span>At least 8 characters</span>
                </div>
                <div className={`criteria-item ${passwordCriteria.uppercase ? "valid" : "invalid"}`}>
                  <span className="criteria-icon">{passwordCriteria.uppercase ? "✓" : "✗"}</span>
                  <span>One uppercase letter (A-Z)</span>
                </div>
                <div className={`criteria-item ${passwordCriteria.lowercase ? "valid" : "invalid"}`}>
                  <span className="criteria-icon">{passwordCriteria.lowercase ? "✓" : "✗"}</span>
                  <span>One lowercase letter (a-z)</span>
                </div>
                <div className={`criteria-item ${passwordCriteria.number ? "valid" : "invalid"}`}>
                  <span className="criteria-icon">{passwordCriteria.number ? "✓" : "✗"}</span>
                  <span>One number (0-9)</span>
                </div>
                <div className={`criteria-item ${passwordCriteria.special ? "valid" : "invalid"}`}>
                  <span className="criteria-icon">{passwordCriteria.special ? "✓" : "✗"}</span>
                  <span>One special character (!@#$%^&*...)</span>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="captcha-container">
            <label>Human Verification</label>
            <div className="captcha-display">
              <canvas
                ref={canvasRef}
                width="200"
                height="60"
                className="captcha-canvas"
              />
              <button
                type="button"
                onClick={refreshCaptcha}
                className="refresh-captcha"
                title="Refresh Captcha"
              >
                ↻
              </button>
            </div>
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className={errors.captcha ? "error" : ""}
              placeholder="Enter the text above"
              style={{
                padding: "12px 15px",
                border: errors.captcha ? "2px solid #ef4444" : "2px solid #e0e0e0",
                borderRadius: "10px",
                fontSize: "14px"
              }}
            />
            {errors.captcha && (
              <div className="error-message">{errors.captcha}</div>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;