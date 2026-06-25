// pages/TemplatesPage.jsx
import { useState, useEffect } from "react";
import { CATEGORIES } from "../data/templates";
import { useNavigate } from "react-router-dom";

const CAT_LABELS = {
  wedding: "Pernikahan",
  aqiqah: "Aqiqah",
  birthday: "Ulang Tahun",
  tasyakuran: "Tasyakuran",
};

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    fetch("http://localhost:5000/api/templates")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          setTemplates(json.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "Semua"
    ? templates
    : templates.filter(t => (CAT_LABELS[t.category] ?? t.category) === activeCategory);
  
  return (
    <div className="page-enter">
      <div className="templates-hero">
        <div className="tag">100+ Pilihan Template</div>
        <h1>Template untuk Setiap Momen</h1>
        <p>Dari pernikahan yang mewah hingga tasyakuran yang hangat — temukan template yang paling cocok untuk acaramu.</p>
      </div>

      <div className="templates-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-btn${activeCategory === cat ? " active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >{cat}</button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:"0.5rem",alignItems:"center"}}>
          <span style={{fontSize:12,color:"var(--muted)"}}>Urutkan:</span>
          <select style={{border:"1px solid var(--border)",borderRadius:6,padding:"6px 10px",fontSize:12,color:"var(--text)",background:"#fff",outline:"none",fontFamily:"'Nunito',sans-serif"}}>
            <option>Terbaru</option>
            <option>Terpopuler</option>
            <option>Gratis Dulu</option>
          </select>
        </div>
      </div>

      <div className="templates-grid">
        {loading ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--muted)" }}>Memuat template...</div>
        ) : error ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--brand)" }}>Gagal memuat template. Coba refresh halaman.</div>
        ) : (
          filtered.map(t => (
            <div className="tmpl-card" key={t.id} onClick={() => navigate(`/templates/${t.slug}`)}>
              <div className="phone-mockup-wrapper" style={{ height: "260px" }}>
                <div 
                  className="phone-mockup"
                  style={{ 
                    width: "120px", height: "240px",
                    backgroundImage: `url(http://localhost:5000${t.preview_url_mobile || t.preview_url || t.thumbnail_url})` 
                  }} 
                />
                <span className={t.is_premium === 1 ? "tmpl-badge-pro" : "tmpl-badge-free"}>
                  {t.is_premium === 1 ? "STANDAR" : "GRATIS"}
                </span>
              </div>
              <div className="tmpl-info">
                <div className="tmpl-name">{t.name}</div>
                <div className="tmpl-meta">
                  <span>{CAT_LABELS[t.category] ?? t.category}</span>
                  <span className="tmpl-dot"/>
                  <span>{t.price_type}</span>
                </div>
                <button className="btn-tmpl" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/templates/${t.slug}`);
                }}>
                  Lihat Detail
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CTA */}
      <div className="cta-bottom" style={{marginTop:0}}>
        <h2>Belum ketemu yang pas?</h2>
        <p>Template baru ditambahkan setiap minggu. Daftar sekarang dan dapatkan notifikasi template terbaru!</p>
        <button className="btn-cta-white" onClick={() => navigate("/register")}>Daftar Gratis</button>
      </div>
    </div>
  );
}