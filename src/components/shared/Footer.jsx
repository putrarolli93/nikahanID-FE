// components/Footer.jsx
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div>
            <div className="footer-logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
              <div className="footer-logo-icon">D</div>
              <span className="footer-logo-text">Datangya.site</span>
            </div>
            <p className="footer-tagline">Platform pembuatan undangan digital terdepan di Indonesia.</p>
          </div>
          <div className="footer-nav">
            <span onClick={() => navigate("/templates")}>Pilihan Template</span>
            <span onClick={() => {
              navigate("/");
              setTimeout(() => document.querySelector(".features")?.scrollIntoView({ behavior: "smooth" }), 100);
            }}>Fitur</span>
            <span onClick={() => {
              navigate("/");
              setTimeout(() => document.querySelector(".pricing")?.scrollIntoView({ behavior: "smooth" }), 100);
            }}>Harga</span>
            <span onClick={() => {
              navigate("/");
              setTimeout(() => document.querySelector(".testi")?.scrollIntoView({ behavior: "smooth" }), 100);
            }}>Testimoni</span>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} Datangya.site — All rights reserved.</div>
          <div className="footer-badge">
            <span>✨ Undangan Digital Praktis &amp; Elegan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}