// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/shared/Layout";
import HomePage from "./pages/HomePage";
import TemplatesPage from "./pages/TemplatesPage";
import CustomizePage from './pages/CustomizePage';
import TemplatePreviewPage from "./pages/TemplatePreviewPage";
import RegisterPage from "./pages/RegisterPage"; // Assuming you have these pages
import LoginPage from "./pages/LoginPage";       // Assuming you have these pages
import AmoreInvitationPage from "./pages/AmoreInvitationPage"; // Import the new page
import TemplateDetailPage from "./pages/TemplateDetailPage"; // For direct access to detail page

import "./styles/global.css";
import "./styles/components.css";
import "./styles/pages.css";

function AppContent() {
  const location = useLocation();
  const [hideHeader, setHideHeader] = useState(false);
  const [hideFooter, setHideFooter] = useState(false);

  // Effect untuk handle body scroll saat menu terbuka (opsional)
  useEffect(() => {
    // Logic to hide header/footer based on current path
    const path = location.pathname;
    
    // Cek apakah path diawali /template/ tapi BUKAN /templates/
    const isPreviewMode = path.startsWith("/template/") && !path.startsWith("/templates");
    setHideHeader(isPreviewMode);
    setHideFooter(isPreviewMode);
  }, [location]);

  return (
    <Layout 
      hideHeader={hideHeader}
      hideFooter={hideFooter}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/:templateSlug" element={<TemplateDetailPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/template/amore/:slug" element={<AmoreInvitationPage />} /> {/* New route for Amore invitations */}
        <Route path="/template/:templateSlug" element={<TemplatePreviewPage />} />
        <Route path="/customize/:templateSlug" element={<CustomizePage />} />
        <Route path="*" element={<HomePage />} /> {/* Fallback for unknown routes */}
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}