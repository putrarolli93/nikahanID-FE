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
import AmoreInvitationPage from "./pages/AmoreInvitationPage";
import GardenInvitationPage from "./pages/GardenInvitationPage";
import OceanicInvitationPage from "./pages/OceanicInvitationPage";
import SimpleFreeTemplate from './templates/simple-free/SimpleFreeTemplate';
import ModernFloralTemplate from './templates/modern-floral/ModernFloralTemplate';
import HeartilyTemplate from './templates/heartily/HeartilyTemplate';
import EvergreenTemplate from './templates/evergreen/EvergreenTemplate';
import JavaneseHeritageTemplate from './templates/javanese-heritage/JavaneseHeritageTemplate';


import TemplateDetailPage from "./pages/TemplateDetailPage"; // For direct access to detail page
import EventSchedulePage from "./pages/EventSchedulePage"; // Step 2: Event schedule form
import CreateWizardPage from "./pages/CreateWizardPage"; // Multi-step creation wizard
import DashboardPage from "./pages/DashboardPage";
import ActivatePage from "./pages/ActivatePage";
import SharePage from "./pages/SharePage";
import LiveScreenPage from "./pages/LiveScreenPage";
import ScanCheckInPage from "./pages/ScanCheckInPage";
import GuestbookHistoryPage from "./pages/GuestbookHistoryPage";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import { useAnalyticsTracker } from "./utils/useAnalyticsTracker";

import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/pages.css";

function AppContent() {
  const location = useLocation();
  const [hideHeader, setHideHeader] = useState(false);
  const [hideFooter, setHideFooter] = useState(false);

  // Automatically track page views
  useAnalyticsTracker();

  // Effect untuk handle body scroll saat menu terbuka (opsional)
  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo(0, 0);

    // Logic to hide header/footer based on current path
    const path = location.pathname;

    // Cek apakah path diawali /template/ tapi BUKAN /templates/
    const isPreviewMode = path.startsWith("/template/") && !path.startsWith("/templates");
    const isLiveScreen = path.startsWith("/live/");
    const isScanPage = path.startsWith("/share/") && path.endsWith("/scan");
    setHideHeader(isPreviewMode || isLiveScreen || isScanPage);
    setHideFooter(isPreviewMode || isLiveScreen || isScanPage);
  }, [location]);

  return (
    <Layout
      hideHeader={hideHeader}
      hideFooter={hideFooter}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/:templateSlug" element={<TemplateDetailPage />} />
        <Route path="/create/:templateSlug" element={<EventSchedulePage />} />
        <Route path="/create-wizard/:slug" element={<CreateWizardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/template/amore/:slug" element={<AmoreInvitationPage />} />
        <Route path="/template/garden/:slug" element={<GardenInvitationPage />} />
        <Route path="/template/oceanic/:slug" element={<OceanicInvitationPage />} />
        <Route path="/template/modern-floral/:slug" element={<ModernFloralTemplate />} />

        <Route path="/template/simple-free/:slug" element={<SimpleFreeTemplate />} />
        <Route path="/template/heartily/:slug" element={<HeartilyTemplate />} />
        <Route path="/template/evergreen/:slug" element={<EvergreenTemplate />} />
        <Route path="/template/javanese-heritage/:slug" element={<JavaneseHeritageTemplate />} />
        <Route path="/template/:templateSlug" element={<TemplatePreviewPage />} />
        <Route path="/customize/:templateSlug" element={<CustomizePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create" element={<CreateWizardPage />} />
        <Route path="/activate/:slug" element={<ActivatePage />} />
        <Route path="/share/:slug" element={<SharePage />} />
        <Route path="/share/:slug/scan" element={<ScanCheckInPage />} />
        <Route path="/share/:slug/wishes" element={<GuestbookHistoryPage />} />
        <Route path="/live/:slug" element={<LiveScreenPage />} />
        <Route path="*" element={<HomePage />} /> {/* Fallback for unknown routes */}
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}