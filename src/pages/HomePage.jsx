// pages/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import SEO from "../components/shared/SEO";

const DYNAMIC_EVENTS = ["Pernikahan", "Aqiqah", "Ulang Tahun", "Tasyakuran"];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [previews, setPreviews] = useState([]);
  const [loadingPreviews, setLoadingPreviews] = useState(true);
  const [previewError, setPreviewError] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);
  const [fadeState, setFadeState] = useState("fade-in");

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Datangya.site",
    "url": "https://datangya.site/",
    "description": "Datangya.site - Platform pembuatan undangan digital elegan, praktis, & modern dengan fitur RSVP, lokasi Google Maps, dan musik background.",
    "publisher": {
      "@type": "Organization",
      "name": "Datangya.site",
      "logo": "https://datangya.site/favicon.svg"
    }
  };

  // Text animation rotator for Hero title
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("fade-out");
      setTimeout(() => {
        setEventIndex((prev) => (prev + 1) % DYNAMIC_EVENTS.length);
        setFadeState("fade-in");
      }, 300);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`/api/templates`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          setPreviews(json.data);
        } else {
          setPreviewError(true);
        }
      })
      .catch(() => setPreviewError(true))
      .finally(() => setLoadingPreviews(false));
  }, []);

  // Filter ONLY Wedding templates for Home section
  const weddingPreviews = previews
    .filter(p => p.category === 'wedding')
    .slice(0, 6);

  // ── BENTO FEATURES DATA ─────────────────────────────────────────────
  const bentoFeatures = [
    { 
      icon: "ti-palette",        
      title: "Desain Minimalis & 100+ Template Aesthetic",      
      desc: "Koleksi desain modern bernuansa romantis & elegan yang bebas kamu kustomisasi dalam hitungan detik.",
      tag: "Top Choice",
      large: true
    },
    { 
      icon: "ti-message-circle-2",  
      title: "RSVP & Buku Tamu Realtime",          
      desc: "Konfirmasi kehadiran tamu & ucapan selamat tersimpan otomatis secara rapi.",
      tag: "Auto Sync",
      large: false 
    },
    { 
      icon: "ti-map-2",         
      title: "Google Maps Navigasi",   
      desc: "Petunjuk rute akurat agar tamu tidak tersesat menuju lokasi acaramu.",
      tag: "Interactive",
      large: false 
    },
    { 
      icon: "ti-music-heart",           
      title: "Musik Latar & Galeri Foto HD",                
      desc: "Alunan musik romantis pilihan dipadu galeri momen indah resolusi tinggi.",
      tag: "Premium Experience",
      large: true 
    },
    { 
      icon: "ti-brand-whatsapp",           
      title: "Personalisasi Tamu & Share WA",         
      desc: "Kirim undangan ke ribuan nama tamu berbeda dengan format pesan WhatsApp siap pakai.",
      tag: "1-Click Share",
      large: false 
    },
  ];

  const steps = [
    { n: "01", title: "Daftar Akun",    desc: "Buat akun gratis dalam hitungan detik tanpa kartu kredit." },
    { n: "02", title: "Pilih Template", desc: "Pilih template aesthetic yang cocok dengan tema impianmu." },
    { n: "03", title: "Isi Data Acara", desc: "Masukkan detail pasangan, jadwal, lokasi, & galeri foto." },
    { n: "04", title: "Bagikan!",       desc: "Aktifkan dan sebar link undangan ke seluruh keluarga & kerabat." },
  ];

  const pricingPlans = [
    {
      name: "Gratis",
      amount: "Rp 0",
      period: "Aktif Selamanya",
      popular: false,
      solid: false,
      features: [
        { text: "Undangan digital tanpa batas", active: true },
        { text: "Semua template versi gratis", active: true },
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
      period: "Sekali Bayar",
      popular: true,
      solid: true,
      features: [
        { text: "Undangan digital tanpa batas", active: true },
        { text: "Akses semua template Premium", active: true },
        { text: "Fitur RSVP & Buku Tamu Real-time", active: true },
        { text: "Tanpa Watermark / Brand", active: true },
        { text: "Background Musik Pilihan Bebas", active: true },
      ],
      cta: "Pilih Premium",
    },
    {
      name: "Platinum",
      prefix: "Mulai dari ",
      amount: "Rp 150.000",
      period: "Sekali Bayar",
      popular: false,
      platinum: true,
      solid: true,
      features: [
        { text: "Semua fitur paket Premium", active: true },
        { text: "QR Check-in & Guestbook Selfie", active: true },
        { text: "Live Screen Proyektor Acara", active: true },
        { text: "Print Barcode Undangan Fisik", active: true },
        { text: "Moderasi Ucapan & Analytics Tamu", active: true },
      ],
      cta: "Hubungi Kami",
      waLink: "https://wa.me/6282114467118?text=Halo%20min%2C%20saya%20tertarik%20dengan%20paket%20Platinum%20datangya.site",
    },
  ];

  const testimonials = [
    { initials: "NA", name: "Nur Astuti",    event: "Pernikahan · Surabaya", text: "Ga nyesel order undangan wed disini, semua sesuai request dan memuaskan hasilnyaaaa. Recommended banget!" },
    { initials: "RN", name: "Rita Noor",     event: "Aqiqah · Bandung",     text: "Suka banget undangannya, rapi enak dilihat, fiturnya lengkap. Recommended banget deh buat semua orang!" },
    { initials: "HM", name: "Hasnawati M.", event: "Ulang Tahun · Jakarta", text: "Undangan cantik dan elegan! Nanti bikin undangan ulang tahun kaya gini lagi yaa mimin. Mantap abis!" },
    { initials: "DS", name: "Dika Santoso",  event: "Tasyakuran · Bekasi",  text: "Nyesal baru tau web ini. Next, semoga bisa beli paket Pro lagi buat acara lainnya. Harganya worth it banget!" },
  ];

  const SkeletonCard = () => (
    <div className="preview-card skeleton-card">
      <div className="preview-thumb skeleton-thumb" />
      <div className="preview-info">
        <div className="skeleton-line" style={{ width: "55%", height: 13, marginBottom: 6 }} />
        <div className="skeleton-line" style={{ width: "75%", height: 11 }} />
      </div>
    </div>
  );

  return (
    <div className="page-enter">
      <SEO 
        title="Buat Undangan Digital Elegan & Modern"
        description="Datangya.site - Platform pembuatan undangan digital elegan, praktis, & modern. Pilihan template gratis dan premium terlengkap dengan RSVP & Musik."
        keywords="undangan pernikahan digital, buat undangan online, website pernikahan, template undangan digital, nikahan id, datangya site"
        schemaData={homeSchema}
      />

      {/* ── HERO SECTION ── */}
      <section className="hero">
        {/* Animated Glowing Mesh Orbs */}
        <div className="hero-bg-animated-orbs">
          <div className="orb-1" />
          <div className="orb-2" />
          <div className="orb-3" />
        </div>

        {/* Content Container */}
        <div className="hero-content-wrapper">
          <div className="hero-badge">
            <span className="badge-sparkle">✨</span>
            <span>Undangan Digital Modern, Minimalis &amp; Elegan</span>
          </div>

          <h1>
            Buat Undangan<br />
            <span className={`hero-dynamic-word ${fadeState}`}>
              {DYNAMIC_EVENTS[eventIndex]}
            </span><br />
            dalam Hitungan Menit
          </h1>

          <p>
            Hadirkan kesan istimewa bagi tamu undanganmu dengan desain romantis yang lembut, 
            alunan musik pilihan, fitur RSVP instant, dan kemudahan berbagi ke WhatsApp.
          </p>

          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate(user ? "/templates" : "/register")}>
              Buat Undangan Sekarang
            </button>
            <button className="btn-outline" onClick={() => navigate("/templates")}>
              Lihat Katalog Template
            </button>
          </div>

          <div className="hero-trust-strip">
            <div className="trust-item">
              <i className="ti ti-shield-check" />
              <span>Tanpa Watermark</span>
            </div>
            <div className="trust-item">
              <i className="ti ti-bolt" />
              <span>Selesai 5 Menit</span>
            </div>
            <div className="trust-item">
              <i className="ti ti-device-mobile" />
              <span>Responsif Layar HP</span>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="hero-stats">
            {[
              ["50.000+", "Undangan Dibuat"],
              ["100+",    "Template Aesthetic"],
              ["4.9 ⭐",  "Rating Kepuasan"],
            ].map(([n, l]) => (
              <div className="stat-item" key={l}>
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREVIEW STRIP (EXCLUSIVE WEDDING TEMPLATES) ── */}
      <section className="preview-strip">
        <div>
          <div className="preview-header">
            <div>
              <div className="tag">Katalog Pernikahan</div>
              <div className="preview-title">Template Undangan Pernikahan Terpopuler</div>
            </div>
          </div>

          <div className="preview-scroll">
            {loadingPreviews ? (
              [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            ) : previewError ? (
              <p className="preview-error">Gagal memuat template. Coba refresh halaman.</p>
            ) : weddingPreviews.length === 0 ? (
              <p className="preview-error" style={{ color: 'var(--muted)' }}>Belum ada template pernikahan saat ini.</p>
            ) : (
              weddingPreviews.map((p) => (
                <div
                  className="preview-card"
                  key={p.id}
                  onClick={() => navigate(`/templates/${p.slug}`)}
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
                    <div className="preview-tag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span>Pernikahan</span>
                      <span className={`price-pill ${['free', 'gratis'].includes((p.price_type || '').toLowerCase()) ? 'free' : 'pro'}`}>
                        {p.price_type}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {!loadingPreviews && !previewError && (
              <div className="preview-see-all" onClick={() => navigate("/templates")}>
                <div className="see-all-icon"><i className="ti ti-arrow-right" /></div>
                <span>Lihat Semua Template</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES SECTION ── */}
      <section className="section features">
        <div className="section-center">
          <div className="tag">Fitur Lengkap</div>
          <h2>Semua Fitur Pilihan Dalam Satu Platform</h2>
          <p>Dirancang khusus untuk memberikan kenyamanan pembuatan dan pengalaman terbaik bagi tamu.</p>
        </div>

        <div className="bento-grid">
          {bentoFeatures.map((f, i) => (
            <div className={`bento-card ${f.large ? 'large' : ''}`} key={i}>
              <div className="bento-header">
                <div className="bento-card-icon">
                  <i className={`ti ${f.icon}`} />
                </div>
                <span className="bento-tag">{f.tag}</span>
              </div>
              <div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how">
        <div className="section-center">
          <div className="tag">Cara Kerja</div>
          <h2>4 Langkah Mudah Pembuatan Undangan</h2>
          <p>Praktis tanpa repot. Undangan impianmu siap dibagikan dalam waktu singkat.</p>
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
          <div className="tag">Pilihan Paket</div>
          <h2>Harga Terjangkau Tanpa Biaya Tersembunyi</h2>
          <p>Pilih paket sesuai kebutuhan acaramu dan nikmati fitur lengkapnya.</p>
        </div>
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div
              className={`price-card${plan.popular ? " popular" : ""}${plan.platinum ? " platinum" : ""}`}
              key={plan.name}
            >
              {plan.popular && <div className="popular-badge">Paling Populer</div>}
              {plan.platinum && <div className="platinum-badge">✦ Terlengkap</div>}
              
              <div>
                <div className="price-name">{plan.name}</div>
                {plan.prefix && <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{plan.prefix}</div>}
                <div className="price-amount">{plan.amount}</div>
                <div className="price-period">{plan.period}</div>
                
                <ul className="price-features">
                  {plan.features.map((f) => (
                    <li key={f.text} className={f.active ? "" : "no"}>
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`btn-price${plan.solid ? " solid" : ""}${plan.platinum ? " platinum-btn" : ""}`}
                onClick={() => {
                  if (plan.waLink) {
                    window.open(plan.waLink, '_blank');
                  } else {
                    navigate(user ? "/templates" : "/register");
                  }
                }}
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
          <div className="tag">Testimoni Pengguna</div>
          <h2>Dipercaya Ribuan Pasangan Bahagia</h2>
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
        <h2>Siap Membuat Undangan Impianmu?</h2>
        <p>Bergabung bersama 50.000+ pengguna lain yang telah mempercayakan momen bahagianya pada Datangya.site</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <button className="btn-cta-white" onClick={() => navigate("/register")}>
            Mulai Gratis Sekarang
          </button>
          <button className="btn-cta-ghost2" onClick={() => navigate("/templates")}>
            Jelajahi Template
          </button>
        </div>
      </div>

    </div>
  );
}