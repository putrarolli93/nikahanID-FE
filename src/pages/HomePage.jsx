// pages/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CAT_LABELS = {
  wedding: "Pernikahan",
  aqiqah: "Aqiqah",
  birthday: "Ulang Tahun",
  tasyakuran: "Tasyakuran",
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [previews, setPreviews] = useState([]);
  const [loadingPreviews, setLoadingPreviews] = useState(true);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    fetch(`/api/templates`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          setPreviews(json.data.slice(0, 6));
        } else {
          setPreviewError(true);
        }
      })
      .catch(() => setPreviewError(true))
      .finally(() => setLoadingPreviews(false));
  }, []);

  // ── STATIC DATA ─────────────────────────────────────────────
  const features = [
    { icon: "ti-template",        title: "100+ Template Dinamis",      desc: "Template cantik yang bisa digonta-ganti warna & font sesuai selera." },
    { icon: "ti-users",           title: "Nama Tamu Personal",         desc: "Tulis nama tujuan undangan tanpa batas untuk semua tamu." },
    { icon: "ti-map-pin",         title: "Peta & Lokasi Interaktif",   desc: "Tampilkan peta Google Maps langsung di dalam undangan." },
    { icon: "ti-clock",           title: "Countdown Hari H",           desc: "Hitung mundur otomatis menuju tanggal acara yang spesial." },
    { icon: "ti-music",           title: "Musik Latar",                desc: "Pilih dari ribuan lagu untuk diputar saat undangan dibuka." },
    { icon: "ti-message-circle",  title: "RSVP & Buku Tamu",          desc: "Tamu bisa konfirmasi kehadiran & kirim ucapan langsung." },
    { icon: "ti-photo",           title: "Galeri Foto",                desc: "Tampilkan foto-foto momen indah dalam galeri yang elegan." },
    { icon: "ti-share",           title: "Share ke WhatsApp",          desc: "Bagikan undangan dengan mudah lewat link atau QR code." },
  ];

  const steps = [
    { n: "1", title: "Daftar Akun",    desc: "Buat akun gratis dalam hitungan detik, tanpa kartu kredit." },
    { n: "2", title: "Pilih Template", desc: "Pilih dari 100+ template cantik dan sesuaikan warna & font." },
    { n: "3", title: "Isi Data Acara", desc: "Masukkan info acara, foto, dan detail pasangan kamu." },
    { n: "4", title: "Bagikan!",       desc: "Aktifkan undangan dan bagikan link ke seluruh tamu undangan." },
  ];

  const pricingPlans = [
    {
      name: "Gratis",
      amount: "Rp 0",
      period: "",
      popular: false,
      solid: false,
      features: [
        { text: "Undangan digital tanpa batas", active: true },
        { text: "Semua template gratis", active: true },
        { text: "Fitur RSVP & Buku Tamu", active: false },
        { text: "Tanpa Watermark", active: false },
        { text: "Background Musik", active: false },
      ],
      cta: "Mulai Gratis",
    },
    {
      name: "Premium",
      prefix: "Mulai dari ",
      amount: "Rp 50.000",
      period: "Sekali bayar",
      popular: true,
      solid: true,
      features: [
        { text: "Undangan digital tanpa batas", active: true },
        { text: "Semua template (Gratis & Premium)", active: true },
        { text: "Fitur RSVP & Buku Tamu", active: true },
        { text: "Tanpa Watermark", active: true },
        { text: "Background Musik Pilihan", active: true },
      ],
      cta: "Pilih Premium",
    },
  ];

  const testimonials = [
    { initials: "NA", name: "Nur Astuti",    event: "Pernikahan · Surabaya", text: "Ga nyesel order undangan wed disini, semua sesuai request dan memuaskan hasilnyaaaa. Recommended banget!" },
    { initials: "RN", name: "Rita Noor",     event: "Aqiqah · Bandung",     text: "Suka banget undangannya, rapi enak dilihat, fiturnya lengkap. Recommended banget deh buat semua orang!" },
    { initials: "HM", name: "Hasnawati M.", event: "Ulang Tahun · Jakarta", text: "Undangan cantik dan elegan! Nanti bikin undangan ulang tahun kaya gini lagi yaa mimin. Mantap abis!" },
    { initials: "DS", name: "Dika Santoso",  event: "Tasyakuran · Bekasi",  text: "Nyesal baru tau web ini. Next, semoga bisa beli paket Pro lagi buat acara lainnya. Harganya worth it banget!" },
  ];

  // ── SKELETON CARD ────────────────────────────────────────────
  const SkeletonCard = () => (
    <div className="preview-card skeleton-card">
      <div className="preview-thumb skeleton-thumb" />
      <div className="preview-info">
        <div className="skeleton-line" style={{ width: "55%", height: 13, marginBottom: 6 }} />
        <div className="skeleton-line" style={{ width: "75%", height: 11 }} />
      </div>
    </div>
  );

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div className="page-enter">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-badge">✦ Gratis &amp; Aktif Selamanya</div>
        <h1>
          Undangan Digital<br />
          yang <span>Cantik &amp; Elegan</span><br />
          dalam Hitungan Menit
        </h1>
        <p>
          Buat undangan pernikahan, aqiqah, ulang tahun, dan tasyakuran digital
          yang bisa langsung dibagikan ke WhatsApp — tanpa perlu keahlian desain.
        </p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={() => navigate(user ? "/templates" : "/register")}>
            Buat Undangan Sekarang
          </button>
          <button className="btn-outline" onClick={() => navigate("/templates")}>
            Lihat Contoh
          </button>
        </div>
        <div className="hero-stats">
          {[
            ["50.000+", "Undangan Dibuat"],
            ["100+",    "Template Tersedia"],
            ["4.9 ⭐",  "Rating Pengguna"],
          ].map(([n, l]) => (
            <div className="stat-item" key={l}>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PREVIEW STRIP ── */}
      <div className="preview-strip">
        <p className="preview-label">Pilihan Template</p>
        <div className="preview-scroll">
          {loadingPreviews ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : previewError ? (
            <p className="preview-error">Gagal memuat template. Coba refresh halaman.</p>
          ) : (
            previews.map((p) => (
              <div
                className="preview-card"
                key={p.id}
                onClick={() => {
                  // Arahkan ke halaman detail template dengan slug
                  navigate(`/templates/${p.slug}`);
                }}
              >
                <div className="phone-mockup-wrapper">
                  <div
                    className="phone-mockup"
                    style={{
                      backgroundImage: `url(${p.preview_url_mobile || p.preview_url})`,
                    }}
                  />
                </div>
                <div className="preview-info">
                  <div className="preview-name">{p.name}</div>
                  <div className="preview-tag" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{CAT_LABELS[p.category] ?? p.category}</span>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: '800', 
                      textTransform: 'uppercase',
                      color: '#fff',
                      background: ['free', 'gratis'].includes(p.price_type.toLowerCase()) ? '#3b82f6' : p.price_type.toLowerCase() === 'premium' ? '#eab308' : '#3b82f6',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {p.price_type}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Lihat Semua — selalu tampil */}
          {!loadingPreviews && !previewError && previews.length > 0 && (
            <div className="preview-see-all" onClick={() => navigate("/templates")}>
              <i className="ti ti-layout-grid" aria-hidden="true" />
              <span>Lihat Semua</span>
            </div>
          )}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section features">
        <div className="section-center">
          <div className="tag">Fitur Lengkap</div>
          <h2>Semua yang kamu butuhkan ada di sini</h2>
          <p>Dari undangan sederhana sampai yang penuh fitur — Datangya.site siap bantu kamu.</p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feat-card" key={f.title}>
              <div className="feat-icon">
                <i className={`ti ${f.icon}`} aria-hidden="true" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how">
        <div className="section-center">
          <div className="tag">Cara Kerja</div>
          <h2>Selesai dalam 5 menit</h2>
          <p>Tidak perlu keahlian desain atau coding. Cukup isi data, pilih template, dan bagikan.</p>
        </div>
        <div className="steps">
          {steps.map((step) => (
            <div className="step" key={step.n}>
              <div className="step-num">{step.n}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section pricing">
        <div className="section-center">
          <div className="tag">Harga</div>
          <h2>Mulai gratis, upgrade kapan saja</h2>
          <p>Harga terjangkau tanpa biaya tersembunyi.</p>
        </div>
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div
              className={`price-card${plan.popular ? " popular" : ""}`}
              key={plan.name}
            >
              {plan.popular && (
                <div className="popular-badge">Paling Populer</div>
              )}
              <div className="price-name">{plan.name}</div>
              {plan.prefix && <div style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>{plan.prefix}</div>}
              <div className="price-amount" style={{ marginTop: plan.prefix ? '0' : '0.5rem' }}>{plan.amount}</div>
              <div className="price-period">{plan.period}</div>
              <ul className="price-features">
                {plan.features.map((f) => (
                  <li key={f.text} className={f.active ? "" : "no"}>
                    {f.text}
                  </li>
                ))}
              </ul>
              <button
                className={`btn-price${plan.solid ? " solid" : ""}`}
                onClick={() => navigate(user ? "/templates" : "/register")}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section testi">
        <div className="section-center">
          <div className="tag">Testimoni</div>
          <h2>Dipercaya ribuan pasangan bahagia</h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((t) => (
            <div className="testi-card" key={t.name}>
              <div className="stars">★★★★★</div>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-author">
                <div className="avatar">{t.initials}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-event">{t.event}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <div className="cta-bottom">
        <h2>Siap buat undangan yang memukau?</h2>
        <p>Bergabung dengan 50.000+ pengguna yang sudah mempercayai Datangya.site</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <button className="btn-cta-white" onClick={() => navigate("/register")} style={{ margin: 0 }}>
            Mulai Gratis Sekarang
          </button>
          <button className="btn-cta-ghost2" onClick={() => navigate("/templates")} style={{ margin: 0 }}>
            Lihat Template
          </button>
        </div>
      </div>

    </div>
  );
}