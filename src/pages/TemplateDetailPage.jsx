// pages/TemplateDetailPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CAT_LABELS = {
  wedding:    "Pernikahan",
  aqiqah:     "Aqiqah",
  birthday:   "Ulang Tahun",
  tasyakuran: "Tasyakuran",
};

const formatRupiah = (amount) => {
  if (!amount) return "Gratis";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

const API_BASE = `http://${window.location.hostname}:5000`;

export default function TemplateDetailPage() {
  const { templateSlug } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate]   = useState(null);
  const [related, setRelated]     = useState([]);
  const [activeTab, setActiveTab] = useState("preview");
  const [imgError, setImgError]   = useState(false);
  const [loading, setLoading]     = useState(true);

  // reset state tiap template ganti
  useEffect(() => {
    setImgError(false);
    setActiveTab("preview");
    setLoading(true);
    setTemplate(null); // Clear previous template data

    if (!templateSlug) {
      navigate('/templates'); // Redirect if no slug
      return;
    }

    // Fetch template details based on slug
    fetch(`${API_BASE}/api/templates/${templateSlug}`) // Assuming an API endpoint for single template by slug
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setTemplate(json.data);
          // Fetch related templates
          fetch(`${API_BASE}/api/templates?category=${json.data.category}`)
            .then((res) => res.json())
            .then((relatedJson) => {
              if (relatedJson.success) {
                setRelated(relatedJson.data.filter((t) => t.id !== json.data.id).slice(0, 3));
              }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
        } else {
          navigate('/templates'); // Redirect if template not found
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [templateSlug, navigate]);

  // scroll to top tiap buka halaman ini
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [templateSlug]);

  if (loading || !template) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  const features        = Array.isArray(template.features) && template.features.length > 0
                            ? template.features
                            : [];
  const previewUrl      = `${API_BASE}${template.preview_url}`;
  const previewUrlMobile = template.preview_url_mobile
                            ? `${API_BASE}${template.preview_url_mobile}`
                            : previewUrl;
  const thumbUrl        = `${API_BASE}${template.thumbnail_url}`;

  return (
    <div className="detail-page page-enter">

      {/* ── BREADCRUMB ── */}
      <div className="detail-breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate("/")}>Home</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-link" onClick={() => navigate("/templates")}>Template</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{template.name}</span> {/* Use template.name directly */}
      </div>

      <div className="detail-layout">

        {/* ── KIRI: PREVIEW ── */}
        <div className="detail-preview-col">
          {/* Tab */}
          <div className="detail-tabs">
            {["preview", "mobile"].map((t) => (
              <button
                key={t}
                className={`detail-tab${activeTab === t ? " active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t === "preview" ? "Desktop / Fullscreen" : "Tampilan Mobile"}
              </button>
            ))}
          </div>

          {/* Frame */}
          <div className={`detail-frame${activeTab === "mobile" ? " mobile-frame" : ""}`}>
            {imgError ? (
              // Fallback for image error
              <div className="detail-frame-fallback">Preview belum tersedia</div>
            ) : ( 
              <img
                src={activeTab === "mobile" ? previewUrlMobile : previewUrl}
                alt={`Preview template ${template.name}`}
                className="detail-preview-img"
                onError={() => setImgError(true)}
                onLoad={() => setImgError(false)}
              />
            )}
          </div>

          <p className="detail-preview-note">
            * Preview ini menggunakan data contoh. Konten akan disesuaikan dengan data kamu.
          </p>
        </div>

        {/* ── KANAN: INFO ── */}
        <div className="detail-info-col">

          {/* Badges */}
          <div className="detail-badges">
            <span className="tag">{CAT_LABELS[template.category]}</span>
            {template.is_premium ? (
              <span className="badge-pro">STANDAR</span>
            ) : (
              <span className="badge-free">GRATIS</span>
            )}
          </div>

          {/* Title */}
          <h1 className="detail-title">{template.name}</h1>

          <p className="detail-desc">
            {template.description ||
              `Template ${template.name} hadir dengan desain yang elegan dan modern, cocok untuk acara ${CAT_LABELS[template.category]?.toLowerCase()} kamu. Semua elemen bisa dikustomisasi sesuai selera.`}
          </p>

          {/* Features */}
          <div className="detail-features">
            <p className="detail-features-title">Yang ada di template ini:</p>
            <ul className="detail-features-list">
              {features.map((f) => (
                <li key={f}>
                  <span className="detail-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="detail-price-box">
            <p className="detail-price-label">Harga</p>
            {template.is_premium ? (
              <>
                <p className="detail-price-val">
                  <span className="detail-price-num">{formatRupiah(template.price)}</span>
                  <span className="detail-price-note"> / Paket Premium</span>
                </p>
                <p className="detail-price-info">
                  ℹ Template ini tersedia di paket Premium
                </p>
              </>
            ) : (
              <p className="detail-price-val">
                <span className="detail-price-num">Gratis</span>
                <span className="detail-price-note"> — tidak perlu upgrade</span>
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="detail-cta">
            <button
              className="btn-primary detail-btn-main"
              onClick={() => navigate(`/create/${template.slug}`)}
            >
              Pilih Template
            </button>
            <button 
              className="btn-outline detail-btn-sec" 
              onClick={() => navigate(`/template/${template.slug}`)}
            >
              Preview Template
            </button>
          </div>

          {/* Trust badges */}
          <div className="detail-trust">
            {[
              "✓ Bisa diedit kapan saja",
              "✓ Link aktif seumur hidup",
              "✓ Bisa ganti template",
            ].map((t) => (
              <span key={t} className="trust-badge">{t}</span>
            ))}
          </div>

        </div>
      </div>

      {/* ── RELATED TEMPLATES ── */}
      {!loading && related.length > 0 && (
        <div className="detail-related">
          <h2 className="detail-related-title">
            Template {CAT_LABELS[template.category]} Lainnya
          </h2>
          <div className="detail-related-grid">
            {related.map((t) => (
              <div
                key={t.id}
                className="preview-card"
                onClick={() => navigate(`/templates/${t.slug}`)}
              >
                <div className="phone-mockup-wrapper">
                  <div
                    className="phone-mockup"
                    style={{
                      backgroundImage: `url(${API_BASE}${t.preview_url_mobile || t.preview_url || t.thumbnail_url})`,
                    }}
                  />
                </div>
                <div className="preview-info">
                  <div className="preview-name">{t.name}</div>
                  <div className="preview-tag">
                    {CAT_LABELS[t.category]} · {t.price_type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}