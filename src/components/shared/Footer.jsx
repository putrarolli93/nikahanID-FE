// components/Footer.jsx
export default function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <div className="footer-logo-icon">D</div>
        <span className="footer-logo-text">Datangya.site</span>
      </div>
      <div className="footer-links">
        {["Template", "Fitur", "Harga", "Blog", "Bantuan", "Kontak"].map(l => (
          <button key={l} onClick={() => l === "Template" && setPage("templates")}>{l}</button>
        ))}
      </div>
      <div className="footer-copy">© 2026 Datangya.site · All rights reserved</div>
    </footer>
  );
}