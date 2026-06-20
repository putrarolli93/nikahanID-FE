import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper page-enter">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">i</div>
          <h2>Selamat Datang</h2>
          <p>Masuk untuk mengelola undangan kamu.</p>
        </div>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input" placeholder="email@contoh.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-submit">Masuk Sekarang</button>
        </form>
        <div className="auth-divider">atau</div>
        <div className="auth-footer">
          Belum punya akun? <button className="auth-link" onClick={() => navigate('/register')}>Daftar gratis</button>
        </div>
      </div>
    </div>
  );
}