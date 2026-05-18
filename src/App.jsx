// App.jsx
import { useState, useEffect } from "react";
import Layout from "./components/shared/Layout";
import HomePage from "./pages/HomePage";
import TemplatesPage from "./pages/TemplatesPage";
import "./styles/global.css";

export default function App() {
  const [page, setPage] = useState("home");

  // Effect untuk handle body scroll saat menu terbuka (opsional)
  useEffect(() => {
    const handleBodyScroll = () => {
      // Ini akan di-handle oleh Header component nanti
    };
    return () => {};
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home":      return <HomePage setPage={setPage}/>;
      case "templates": return <TemplatesPage setPage={setPage}/>;
      case "register":  return <RegisterPage setPage={setPage}/>;
      case "login":     return <LoginPage setPage={setPage}/>;
      default:          return <HomePage setPage={setPage}/>;
    }
  };

  const noFooterPages = [];

  return (
    <Layout 
      currentPage={page} 
      setPage={setPage}
      hideFooter={noFooterPages.includes(page)}
    >
      {renderPage()}
    </Layout>
  );
}