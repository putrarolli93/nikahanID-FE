// src/templates/aqiqah-blessing/AqiqahBlessingTemplate.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import './AqiqahBlessingTemplate.css';

// ── DEFAULT PHOTOS & AUDIO ──
const DEFAULT_BABY_PHOTOS = [
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80'
];

const DEFAULT_MUSIC = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';

export default function AqiqahBlessingTemplate({ data: customData, isPreview = false }) {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const toGuest = searchParams.get('to') || 'Bapak/Ibu/Saudara/i';

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttend, setRsvpAttend] = useState('1');
  const [rsvpMsg, setRsvpMsg] = useState('');
  const [wishes, setWishes] = useState([
    { name: 'Keluarga Besar Al-Farisi', msg: 'Selamat atas aqiqah Ananda. Semoga tumbuh menjadi anak yang sholeh, berbakti kepada orang tua dan berguna bagi sesama.' },
    { name: 'Ustadz Ahmad Fauzi', msg: 'Barakallahu laka fil mauhubi laka wa syakartal wahiba. Semoga berkah umur dan rezekinya.' }
  ]);

  const audioRef = useRef(null);

  // Prevent background scroll when cover modal is open
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'auto';
      window.scrollTo(0, 0);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Template Data merging
  const data = customData || {
    baby: {
      full_name: 'Muhammad Rayyan Al-Farisi',
      nickname: 'Rayyan',
      father_name: 'Fajar Al-Farisi',
      mother_name: 'Siti Sarah',
      birth_date: '15 Januari 2026',
      weight: '3.2 kg',
      height: '50 cm',
      photo_url: DEFAULT_BABY_PHOTOS[0],
    },
    schedules: [
      {
        event_name: 'Tasyakuran & Aqiqah',
        event_date: 'Minggu, 22 Februari 2026',
        start_time: '09:00',
        end_time: '12:00 WIB',
        event_address: 'Kediaman Bpk. Fajar Al-Farisi, Jl. Melati Raya No. 45, Jakarta Selatan',
        google_map_link: 'https://maps.google.com/?q=Jakarta',
      }
    ],
    galleries: DEFAULT_BABY_PHOTOS.map(url => ({ photo_url: url })),
    gifts: [
      { bank_name: 'BCA', account_number: '7820491823', account_name: 'Fajar Al-Farisi' }
    ]
  };

  const handleOpenInvitation = () => {
    setIsOpen(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMsg.trim()) return;
    setWishes([
      { name: rsvpName, msg: rsvpMsg },
      ...wishes
    ]);
    setRsvpName('');
    setRsvpMsg('');
    alert('Terima kasih! Doa dan ucapan kamu telah terkirim.');
  };

  return (
    <div className="aqiqah-container">
      <audio ref={audioRef} src={DEFAULT_MUSIC} loop />

      {/* ── COVER MODAL (Opening Page) ── */}
      <div className={`aq-cover-modal ${isOpen ? 'closed' : ''}`}>
        {/* Floating Clouds Background */}
        <div className="aq-cloud-group">
          <div className="aq-cloud aq-cloud-1" />
          <div className="aq-cloud aq-cloud-2" />
        </div>

        {/* Crescent Moon & Twinkling Stars */}
        <div className="aq-moon">🌙</div>
        <div className="aq-star" style={{ top: '60px', left: '40px', animationDelay: '0.2s' }}>✨</div>
        <div className="aq-star" style={{ top: '110px', right: '65px', animationDelay: '1.2s' }}>✨</div>
        <div className="aq-star" style={{ top: '210px', left: '30px', animationDelay: '0.8s' }}>✨</div>

        {/* 1 Single sheep_1.png on cover */}
        <img 
          src="/images/sheep_1.png" 
          alt="Domba Aqiqah" 
          className="aq-mascot-img aq-anim-lamb aq-lamb-cover-single" 
        />

        {/* Clean, Elegant Title (No box, no border) */}
        <div className="aq-cover-subtitle">UNDANGAN TASYAKURAN AQIQAH</div>

        <div className="aq-cover-photo-wrapper">
          <img src={data.baby?.photo_url || DEFAULT_BABY_PHOTOS[0]} alt="Foto Bayi" className="aq-cover-photo" />
        </div>

        <h1 className="aq-cover-title">{data.baby?.nickname || 'Rayyan'}</h1>
        <p className="aq-cover-sub">
          Kepada Yth. <strong>{toGuest}</strong><br />
          Kami mengundang Anda untuk hadir dalam Tasyakuran Aqiqah putra kami.
        </p>

        <button className="aq-btn-open" onClick={handleOpenInvitation}>
          <i className="ti ti-mail-opened" /> Buka Undangan
        </button>

        {/* Bottom Zooming Sheep (Visible on Mobile View) */}
        <img 
          src="/images/sheep_bottom.png" 
          alt="Domba Bottom Cover" 
          className="aq-cover-bottom-sheep" 
        />
      </div>

      {/* ── SECTION 1: HERO & BABY PROFILE CARD ── */}
      <section className="aq-hero-section">
        {/* Floating Clouds & Sky Ornaments */}
        <div className="aq-cloud-group">
          <div className="aq-cloud aq-cloud-1" />
          <div className="aq-cloud aq-cloud-2" />
        </div>

        <div className="aq-star" style={{ top: '35px', left: '25px' }}>✨</div>
        <div className="aq-star" style={{ top: '80px', right: '35px', animationDelay: '0.7s' }}>✨</div>

        <div className="aq-bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
        
        <p style={{ fontSize: '13.5px', color: 'var(--aq-muted)', lineHeight: '1.6', marginBottom: '1.25rem', position: 'relative', zIndex: 3 }}>
          Assalamu’alaikum Warahmatullahi Wabarakatuh.<br />
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan Tasyakuran Aqiqah putra kami:
        </p>

        <div className="aq-baby-card">
          {/* Peeking sheep_1.png on Baby Card */}
          <img 
            src="/images/sheep_1.png" 
            alt="Domba Aqiqah" 
            className="aq-mascot-img aq-anim-lamb aq-lamb-card-1" 
          />

          <div className="aq-baby-img-box">
            <img src={data.baby?.photo_url || DEFAULT_BABY_PHOTOS[0]} alt={data.baby?.full_name} className="aq-baby-img" />
          </div>

          <h2 className="aq-baby-name">{data.baby?.full_name}</h2>
          <div className="aq-baby-nick">"{data.baby?.nickname}"</div>

          <p style={{ fontSize: '13.5px', color: '#555' }}>
            Putra dari Pasangan:<br />
            <strong>Bpk. {data.baby?.father_name} &amp; Ibu {data.baby?.mother_name}</strong>
          </p>

          <div className="aq-baby-stats">
            <span className="aq-stat-pill">📅 {data.baby?.birth_date}</span>
            <span className="aq-stat-pill">⚖️ {data.baby?.weight}</span>
            <span className="aq-stat-pill">📏 {data.baby?.height}</span>
          </div>
        </div>

        <div className="aq-hadith-box">
          “Setiap anak tergadai (tergadaikan) dengan aqiqahnya. Disembelihkan (hewan) untuknya pada hari ketujuh, dicukur rambutnya, dan diberi nama.”<br />
          <strong style={{ fontSize: '12px', marginTop: '6px', display: 'block' }}>(HR. An-Nasa’i &amp; Tirmidzi)</strong>
        </div>

        {/* Subtle Bottom Right: sheep_bottom.png */}
        <img 
          src="/images/sheep_bottom.png" 
          alt="Domba Aqiqah Bottom" 
          className="aq-sheep-bottom aq-sheep-bottom-right" 
        />
      </section>

      {/* ── SECTION 2: WAKTU & LOKASI ACARA ── */}
      <section className="aq-section" style={{ background: '#ffffff' }}>
        <h2 className="aq-section-title">Waktu &amp; Lokasi Acara</h2>
        <p className="aq-section-sub">Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>

        {data.schedules?.map((sch, i) => (
          <div className="aq-event-card" key={i}>
            <div className="aq-event-icon">
              <i className="ti ti-calendar-event" />
            </div>
            <h3 className="aq-event-name">{sch.event_name}</h3>
            <div className="aq-event-detail">📅 {sch.event_date}</div>
            <div className="aq-event-detail">⏰ Pukul {sch.start_time} - {sch.end_time}</div>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>📍 {sch.event_address}</p>

            {sch.google_map_link && (
              <a href={sch.google_map_link} target="_blank" rel="noreferrer" className="aq-btn-map">
                <i className="ti ti-map-2" /> Buka Google Maps
              </a>
            )}
          </div>
        ))}

        {/* Subtle Bottom Left: sheep_bottom.png */}
        <img 
          src="/images/sheep_bottom.png" 
          alt="Domba Aqiqah Bottom" 
          className="aq-sheep-bottom aq-sheep-bottom-left" 
        />
      </section>

      {/* ── SECTION 3: CLICKABLE PHOTO GALLERY GRID ── */}
      {data.galleries && data.galleries.length > 0 && (
        <section className="aq-section" style={{ background: 'var(--aq-bg)' }}>
          <h2 className="aq-section-title">Galeri Kebahagiaan</h2>
          <p className="aq-section-sub">Klik foto untuk melihat ukuran penuh</p>

          <div className="aq-gallery-grid">
            {data.galleries.map((g, idx) => (
              <div 
                className="aq-gallery-item" 
                key={idx}
                onClick={() => setSelectedImg(g.photo_url)}
              >
                <img src={g.photo_url} alt={`Gallery ${idx+1}`} className="aq-gallery-img" />
                <div className="aq-gallery-overlay">
                  <i className="ti ti-search" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {selectedImg && (
        <div className="aq-lightbox-modal" onClick={() => setSelectedImg(null)}>
          <div className="aq-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="aq-lightbox-close" onClick={() => setSelectedImg(null)}>✕</button>
            <img src={selectedImg} alt="Enlarged view" className="aq-lightbox-img" />
          </div>
        </div>
      )}

      {/* ── SECTION 4: RSVP & DOA UCAPAN ── */}
      <section className="aq-section" style={{ background: '#ffffff', position: 'relative' }}>
        <h2 className="aq-section-title">Doa &amp; Konfirmasi Kehadiran</h2>
        <p className="aq-section-sub">Kirimkan doa dan ucapan terbaik untuk Sang Buah Hati</p>

        <form className="aq-rsvp-form" style={{ position: 'relative' }} onSubmit={handleRsvpSubmit}>
          {/* Peeking sheep_1.png */}
          <img 
            src="/images/sheep_1.png" 
            alt="Domba Aqiqah" 
            className="aq-mascot-img aq-anim-lamb aq-lamb-card-1" 
          />

          <div className="aq-form-group">
            <label>Nama Anda</label>
            <input 
              type="text" 
              className="aq-form-input" 
              placeholder="Masukkan nama lengkap"
              value={rsvpName}
              onChange={(e) => setRsvpName(e.target.value)}
              required 
            />
          </div>

          <div className="aq-form-group">
            <label>Konfirmasi Kehadiran</label>
            <select 
              className="aq-form-select"
              value={rsvpAttend}
              onChange={(e) => setRsvpAttend(e.target.value)}
            >
              <option value="1">Hadir</option>
              <option value="2">Ragu-ragu</option>
              <option value="0">Tidak Hadir</option>
            </select>
          </div>

          <div className="aq-form-group">
            <label>Doa &amp; Ucapan Selamat</label>
            <textarea 
              className="aq-form-textarea" 
              rows="3" 
              placeholder="Tuliskan doa terbaikmu..."
              value={rsvpMsg}
              onChange={(e) => setRsvpMsg(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="aq-btn-submit">
            Kirim Doa &amp; Ucapan
          </button>
        </form>

        <div className="aq-wishes-list">
          {wishes.map((w, idx) => (
            <div className="aq-wish-item" key={idx}>
              <div className="aq-wish-name">👶 {w.name}</div>
              <div className="aq-wish-msg">"{w.msg}"</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: HADIAH / AMPLOP DIGITAL ── */}
      {data.gifts && data.gifts.length > 0 && (
        <section className="aq-section" style={{ background: 'var(--aq-bg)' }}>
          <h2 className="aq-section-title">Hadiah &amp; Amplop Digital</h2>
          <p className="aq-section-sub">Bagi yang ingin memberikan kado / kado bayi</p>

          {data.gifts.map((g, i) => (
            <div key={i} style={{ background: '#ffffff', borderRadius: '18px', padding: '1.25rem', border: '1.5px solid var(--aq-border)', textAlign: 'center', position: 'relative' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--aq-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>{g.bank_name}</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--aq-dark)', letterSpacing: '1px', margin: '4px 0' }}>{g.account_number}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>a.n {g.account_name}</div>
            </div>
          ))}

          {/* Subtle Bottom Right: sheep_bottom.png */}
          <img 
            src="/images/sheep_bottom.png" 
            alt="Domba Aqiqah Bottom" 
            className="aq-sheep-bottom aq-sheep-bottom-right" 
          />
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="aq-footer">
        <p>Wassalamu’alaikum Warahmatullahi Wabarakatuh</p>
        <p style={{ marginTop: '1rem', fontSize: '12px', color: '#aaa' }}>© 2026 Datangya.site · Undangan Digital Aqiqah</p>
      </footer>

      {/* ── MUSIC FAB TOGGLE ── */}
      {isOpen && (
        <button className="aq-music-fab" onClick={toggleMusic} title="Toggle Musik">
          {isPlaying ? '🎵' : '🔇'}
        </button>
      )}
    </div>
  );
}
