import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper page-enter">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">i</div>
          <h2>Daftar Akun</h2>
          <p>Mulai buat undangan digital kamu sekarang.</p>
        </div>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input type="text" className="form-input" placeholder="Contoh: Budi Santoso" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input" placeholder="email@contoh.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-submit">Daftar Sekarang</button>
        </form>
        <div className="auth-divider">atau</div>
        <div className="auth-footer">
          Sudah punya akun? <button className="auth-link" onClick={() => navigate('/login')}>Masuk di sini</button>
        </div>
      </div>
    </div>
  );
}