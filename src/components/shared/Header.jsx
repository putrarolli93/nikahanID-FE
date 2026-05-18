// components/Header.jsx
import { useState, useEffect, useRef } from "react";

export default function Header({ currentPage, setPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  
  const links = [
    { label: "Template", page: "templates" },
    { label: "Fitur", page: "home" },
    { label: "Harga", page: "home" },
    { label: "Blog", page: "home" },
  ];

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (page) => {
    setPage(page);
    closeMenu(); // Tutup menu setelah navigasi
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
        <div className="nav-logo" onClick={() => handleNavigation("home")}>
          <div className="nav-logo-icon">i</div>
          <span className="nav-logo-text">datangya.id</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          {links.map(l => (
            <button
              key={l.label}
              className={`nav-link${currentPage === l.page && l.page !== "home" ? " active" : ""}`}
              onClick={() => handleNavigation(l.page)}
            >
              {l.label}
            </button>
          ))}
          <button className="btn-ghost" onClick={() => handleNavigation("login")}>Masuk</button>
          <button className="btn-solid" onClick={() => handleNavigation("register")}>Daftar Gratis</button>
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
                className={`mobile-nav-link${currentPage === l.page && l.page !== "home" ? " active" : ""}`}
                onClick={() => handleNavigation(l.page)}
              >
                {l.label}
              </button>
            ))}
            <div className="mobile-nav-buttons">
              <button className="mobile-btn-ghost" onClick={() => handleNavigation("login")}>
                Masuk
              </button>
              <button className="mobile-btn-solid" onClick={() => handleNavigation("register")}>
                Daftar Gratis
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}