// pages/TemplatesPage.jsx
import { useState } from "react";
import { TEMPLATES, CATEGORIES } from "../data/templates";

export default function TemplatesPage({ setPage }) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filtered = activeCategory === "Semua"
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

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
        {filtered.map(t => (
          <div className="tmpl-card" key={t.id}>
            <div className={`preview-thumb ${t.theme}`} style={{height:160,fontSize:"3rem"}}>
              {t.emoji}
              <span className={t.pro ? "tmpl-badge-pro" : "tmpl-badge-free"}>{t.pro ? "PRO" : "GRATIS"}</span>
            </div>
            <div className="tmpl-info">
              <div className="tmpl-name">{t.name}</div>
              <div className="tmpl-meta">
                <span>{t.category}</span>
                <span className="tmpl-dot"/>
                <span>{t.pro ? "Premium" : "Gratis"}</span>
              </div>
              <button className="btn-tmpl" onClick={() => setPage("register")}>
                {t.pro ? "Pakai Template" : "Pakai Gratis"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="cta-bottom" style={{marginTop:0}}>
        <h2>Belum ketemu yang pas?</h2>
        <p>Template baru ditambahkan setiap minggu. Daftar sekarang dan dapatkan notifikasi template terbaru!</p>
        <button className="btn-cta-white" onClick={() => setPage("register")}>Daftar Gratis</button>
      </div>
    </div>
  );
}