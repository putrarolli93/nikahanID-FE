// pages/HomePage.jsx
export default function HomePage({ setPage }) {
  const features = [
    { icon: "ti-layout-template", title: "100+ Template Dinamis", desc: "Template cantik yang bisa digonta-ganti warna & font sesuai selera." },
    { icon: "ti-user-check", title: "Nama Tamu Personal", desc: "Tulis nama tujuan undangan tanpa batas untuk semua tamu." },
    { icon: "ti-map-pin", title: "Peta & Lokasi Interaktif", desc: "Tampilkan peta Google Maps langsung di dalam undangan." },
    { icon: "ti-clock-countdown", title: "Countdown Hari H", desc: "Hitung mundur otomatis menuju tanggal acara yang spesial." },
    { icon: "ti-music", title: "Musik Latar", desc: "Pilih dari ribuan lagu untuk diputar saat undangan dibuka." },
    { icon: "ti-message-2", title: "RSVP & Buku Tamu", desc: "Tamu bisa konfirmasi kehadiran & kirim ucapan langsung." },
    { icon: "ti-photo", title: "Galeri Foto", desc: "Tampilkan foto-foto momen indah dalam galeri yang elegan." },
    { icon: "ti-share", title: "Share ke WhatsApp", desc: "Bagikan undangan dengan mudah lewat link atau QR code." },
  ];
  
  const previews = [
    { name: "Amore", tag: "Pernikahan · Gratis", emoji: "💍", cls: "t1" },
    { name: "Oceanic", tag: "Pernikahan · Pro", emoji: "🌊", cls: "t2" },
    { name: "Sage", tag: "Aqiqah · Gratis", emoji: "🌿", cls: "t3" },
    { name: "Bloom", tag: "Ultah · Pro", emoji: "🌸", cls: "t4" },
    { name: "Madinah", tag: "Pernikahan · Pro", emoji: "🕌", cls: "t5" },
    { name: "Luxe", tag: "Tasyakuran · Pro", emoji: "✨", cls: "t6" },
  ];
  
  const steps = [
    { n: "1", title: "Daftar Akun", desc: "Buat akun gratis dalam hitungan detik, tanpa kartu kredit." },
    { n: "2", title: "Isi Data Acara", desc: "Masukkan info acara, foto, dan detail pasangan kamu." },
    { n: "3", title: "Pilih Template", desc: "Pilih dari 100+ template cantik dan sesuaikan warna & font." },
    { n: "4", title: "Bagikan!", desc: "Aktifkan undangan dan bagikan link ke seluruh tamu undangan." },
  ];
  
  const testimonials = [
    { initials: "NA", name: "Nur Astuti", event: "Pernikahan · Surabaya", text: '"Ga nyesel order undangan wed disini, semua sesuai request dan memuaskan hasilnyaaaa. Recommended banget!"' },
    { initials: "RN", name: "Rita Noor", event: "Aqiqah · Bandung", text: '"Suka banget undangannya, rapi enak dilihat, fiturnya lengkap. Recommended banget deh buat semua orang!"' },
    { initials: "HM", name: "Hasnawati M.", event: "Ulang Tahun · Jakarta", text: '"Undangan cantik dan elegan! Nanti bikin undangan ulang tahun kaya gini lagi yaa mimin. Mantap abis!"' },
    { initials: "DS", name: "Dika Santoso", event: "Tasyakuran · Bekasi", text: '"Nyesal baru tau web ini. Next, semoga bisa beli paket Pro lagi buat acara lainnya. Harganya worth it banget!"' },
  ];

  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">✦ Gratis & Aktif Selamanya</div>
        <h1>Undangan Digital<br/>yang <span>Cantik & Elegan</span><br/>dalam Hitungan Menit</h1>
        <p>Buat undangan pernikahan, aqiqah, ulang tahun, dan tasyakuran digital yang bisa langsung dibagikan ke WhatsApp — tanpa perlu keahlian desain.</p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={() => setPage("register")}>Buat Undangan Gratis</button>
          <button className="btn-outline" onClick={() => setPage("templates")}>Lihat Contoh</button>
        </div>
        <div className="hero-stats">
          {[["50.000+","Undangan Dibuat"],["100+","Template Tersedia"],["4.9 ⭐","Rating Pengguna"]].map(([n,l]) => (
            <div className="stat-item" key={l}>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW STRIP */}
      <div className="preview-strip">
        <p className="preview-label">Pilihan Template</p>
        <div className="preview-scroll">
          {previews.map(p => (
            <div className="preview-card" key={p.name} onClick={() => setPage("templates")}>
              <div className={`preview-thumb ${p.cls}`}>{p.emoji}</div>
              <div className="preview-info">
                <div className="preview-name">{p.name}</div>
                <div className="preview-tag">{p.tag}</div>
              </div>
            </div>
          ))}
          <div className="preview-see-all" onClick={() => setPage("templates")}>
            <i className="ti ti-layout-grid" style={{fontSize:22,color:"var(--brand)"}} aria-hidden="true"/>
            <span>Lihat Semua</span>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="section features">
        <div className="section-center">
          <div className="tag">Fitur Lengkap</div>
          <h2>Semua yang kamu butuhkan ada di sini</h2>
          <p>Dari undangan sederhana sampai yang penuh fitur — datangya.id siap bantu kamu.</p>
        </div>
        <div className="features-grid">
          {features.map(f => (
            <div className="feat-card" key={f.title}>
              <div className="feat-icon"><i className={`ti ${f.icon}`} aria-hidden="true"/></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how">
        <div className="section-center">
          <div className="tag">Cara Kerja</div>
          <h2>Selesai dalam 5 menit</h2>
          <p>Tidak perlu keahlian desain atau coding. Cukup isi data, pilih template, dan bagikan.</p>
        </div>
        <div className="steps">
          {steps.map(s => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="section pricing">
        <div className="section-center">
          <div className="tag">Harga</div>
          <h2>Mulai gratis, upgrade kapan saja</h2>
          <p>Harga terjangkau tanpa biaya tersembunyi. Aktif selamanya.</p>
        </div>
        <div className="pricing-grid">
          <div className="price-card">
            <div className="price-name">Gratis</div>
            <div className="price-amount">Rp 0</div>
            <div className="price-period">Aktif selamanya</div>
            <ul className="price-features">
              <li>1 undangan aktif</li>
              <li>Template gratis</li>
              <li>RSVP & buku tamu</li>
              <li>Countdown timer</li>
              <li className="no">Nama tamu personal</li>
              <li className="no">Musik latar</li>
              <li className="no">Domain custom</li>
            </ul>
            <button className="btn-price" onClick={() => setPage("register")}>Mulai Gratis</button>
          </div>
          <div className="price-card popular">
            <div className="popular-badge">Paling Populer</div>
            <div className="price-name">Standar</div>
            <div className="price-amount">Rp 75.000</div>
            <div className="price-period">Sekali bayar · aktif 1 tahun</div>
            <ul className="price-features">
              <li>1 undangan premium</li>
              <li>Semua template</li>
              <li>RSVP & buku tamu</li>
              <li>Countdown timer</li>
              <li>Nama tamu personal</li>
              <li>Musik latar</li>
              <li className="no">Domain custom</li>
            </ul>
            <button className="btn-price solid" onClick={() => setPage("register")}>Pilih Standar</button>
          </div>
          <div className="price-card">
            <div className="price-name">Pro</div>
            <div className="price-amount">Rp 200.000</div>
            <div className="price-period">Sekali bayar · aktif selamanya</div>
            <ul className="price-features">
              <li>Undangan unlimited</li>
              <li>Semua template + eksklusif</li>
              <li>RSVP & buku tamu</li>
              <li>Countdown timer</li>
              <li>Nama tamu personal</li>
              <li>Musik latar</li>
              <li>Domain custom</li>
            </ul>
            <button className="btn-price" onClick={() => setPage("register")}>Pilih Pro</button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testi">
        <div className="section-center">
          <div className="tag">Testimoni</div>
          <h2>Dipercaya ribuan pasangan bahagia</h2>
        </div>
        <div className="testi-grid">
          {testimonials.map(t => (
            <div className="testi-card" key={t.name}>
              <div className="stars">★★★★★</div>
              <p className="testi-text">{t.text}</p>
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

      {/* CTA BOTTOM */}
      <div className="cta-bottom">
        <h2>Siap buat undangan yang memukau?</h2>
        <p>Bergabung dengan 50.000+ pengguna yang sudah mempercayai datangya.id</p>
        <button className="btn-cta-white" onClick={() => setPage("register")}>Mulai Gratis Sekarang</button>
        <button className="btn-cta-ghost2" onClick={() => setPage("templates")}>Lihat Template</button>
      </div>
    </div>
  );
}