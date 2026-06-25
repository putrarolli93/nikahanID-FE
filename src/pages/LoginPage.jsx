import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Format email tidak valid";
    }
    if (!password) {
      errors.password = "Password wajib diisi";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    
    if (result.success) {
      const queryParams = new URLSearchParams(window.location.search);
      const redirectParam = queryParams.get("redirect");
      
      if (redirectParam === "create-draft") {
        const pendingData = sessionStorage.getItem("pending_wedding_create");
        if (pendingData) {
          try {
            const parsed = JSON.parse(pendingData);
            const authToken = localStorage.getItem("token");
            
            const response = await fetch(`http://${window.location.hostname}:5000/api/invitations`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
              },
              body: JSON.stringify({
                templateSlug: parsed.templateSlug,
                ...parsed.form
              })
            });
            const draftResult = await response.json();
            setLoading(false);
            
            if (response.ok && draftResult.success) {
              sessionStorage.removeItem("pending_wedding_create");
              navigate(`/create-wizard/${draftResult.data.slug}`);
              return;
            }
          } catch (err) {
            console.error("Error auto-creating draft in login", err);
          }
        }
      }
      setLoading(false);
      navigate("/");
    } else {
      setLoading(false);
      if (result.errors && Array.isArray(result.errors)) {
        // Handle express-validator fields errors from BE
        const errorsObj = {};
        result.errors.forEach((err) => {
          // If express-validator returns error inside a specific field
          const path = err.path || err.param;
          if (path) {
            errorsObj[path] = err.msg;
          }
        });
        setFieldErrors(errorsObj);
      } else {
        setGeneralError(result.message);
      }
    }
  };

  return (
    <div className="auth-wrapper page-enter">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">i</div>
          <h2>Selamat Datang</h2>
          <p>Masuk untuk mengelola undangan kamu.</p>
        </div>

        {generalError && (
          <div className="auth-alert-error">
            {generalError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={`form-input ${fieldErrors.email ? "auth-input-error" : ""}`}
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors(prev => ({ ...prev, email: "" }));
                }
              }}
              disabled={loading}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <span className="auth-error-msg">{fieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`form-input ${fieldErrors.password ? "auth-input-error" : ""}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors(prev => ({ ...prev, password: "" }));
                }
              }}
              disabled={loading}
              autoComplete="current-password"
            />
            {fieldErrors.password && (
              <span className="auth-error-msg">{fieldErrors.password}</span>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-submit-spinner"></span>
                Memproses...
              </>
            ) : (
              "Masuk Sekarang"
            )}
          </button>
        </form>

        <div className="auth-divider">atau</div>
        <div className="auth-footer">
          Belum punya akun?{" "}
          <button className="auth-link" onClick={() => navigate("/register")} disabled={loading}>
            Daftar gratis
          </button>
        </div>
      </div>
    </div>
  );
}