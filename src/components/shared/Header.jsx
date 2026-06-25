// components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const links = [
    { label: "Template", path: "/templates" },
    { label: "Fitur", path: "/", sectionClass: ".features" },
    { label: "Harga", path: "/", sectionClass: ".pricing" },
    { label: "Testimoni", path: "/", sectionClass: ".testi" },
  ];

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (path, sectionClass) => {
    closeMenu();
    if (location.pathname === "/" && sectionClass) {
      const element = document.querySelector(sectionClass);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
      if (sectionClass) {
        // Wait for page transition/rendering to complete before scrolling
        setTimeout(() => {
          const element = document.querySelector(sectionClass);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      }
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          !burgerRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    // Lock body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="nav">
        <div className="nav-logo" onClick={() => handleNavigation("/")}>
          <div className="nav-logo-icon">D</div>
          <span className="nav-logo-text">Datangya.site</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          {links.map(l => (
            <button
              key={l.label}
              className={`nav-link${location.pathname === l.path && !l.sectionClass ? " active" : ""}`}
              onClick={() => handleNavigation(l.path, l.sectionClass)}
            >
              {l.label}
            </button>
          ))}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="user-greeting">Halo, <strong>{user.name}</strong></span>
              <button className="btn-ghost" onClick={() => { logout(); navigate("/"); }}>Keluar</button>
            </div>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate("/login")}>Masuk</button>
              <button className="btn-solid" onClick={() => navigate("/register")}>Daftar Gratis</button>
            </>
          )}
        </div>

        {/* Burger Menu Button - Mobile */}
        <button 
          ref={burgerRef}
          className={`burger-menu ${isMenuOpen ? "open" : ""}`} 
          onClick={toggleMenu}
          aria-label="Menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div 
        ref={menuRef}
        className={`mobile-nav ${isMenuOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
      >
        <div className="mobile-nav-content">
          {/* Close button inside menu */}
          <button className="mobile-close-btn" onClick={closeMenu} aria-label="Tutup menu">
            ✕
          </button>
          
          <div className="mobile-nav-links">
            {links.map(l => (
              <button
                key={l.label}
                className={`mobile-nav-link${location.pathname === l.path && !l.sectionClass ? " active" : ""}`}
                onClick={() => handleNavigation(l.path, l.sectionClass)}
              >
                {l.label}
              </button>
            ))}
            
            {user ? (
              <div className="mobile-nav-buttons">
                <span className="mobile-user-greeting">Halo, <strong>{user.name}</strong></span>
                <button className="mobile-btn-ghost" onClick={() => { logout(); closeMenu(); navigate("/"); }}>
                  Keluar
                </button>
              </div>
            ) : (
              <div className="mobile-nav-buttons">
                <button className="mobile-btn-ghost" onClick={() => { closeMenu(); navigate("/login"); }}>
                  Masuk
                </button>
                <button className="mobile-btn-solid" onClick={() => { closeMenu(); navigate("/register"); }}>
                  Daftar Gratis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}