import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
            
            const response = await fetch(`/api/invitations`, {
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
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
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
                style={{ paddingRight: '2.5rem' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>
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