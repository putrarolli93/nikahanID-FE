// src/templates/oceanic/OceanicTemplate.jsx
//
// Completely redesigned premium Oceanic template featuring unique asymmetrical staggered layouts,
// split-card event details, left-aligned wave bubble stream timeline, underwater light rays, 
// full-bleed hero backgrounds, and IntersectionObserver scroll reveal animations.

import { useState, useEffect, useRef } from 'react';
import picAmoreSlide1 from '../amore/photos/pic_amore_slide_1.jpg';
import groomPhoto from '../amore/photos/bride_1.jpg';
import bridePhoto from '../amore/photos/bride_2.jpg';
import gallery1 from '../amore/photos/gallery_1.jpg';
import gallery2 from '../amore/photos/gallery_2.jpg';
import gallery3 from '../amore/photos/gallery_3.jpg';
import gallery4 from '../amore/photos/gallery_4.jpg';
import './Oceanic.css';

// ─── Default data (overridden by props) ────────────────────────────
const DEFAULT_DATA = {
  cover: {
    pic_amore_slide_1: picAmoreSlide1,
    groomName: 'Kai',
    brideName: 'Marina',
    verse: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.',
    verseSource: 'QS. Ar-Rum: 21',
  },
  groom: {
    photoUrl: groomPhoto,
    name: 'Kai Samudra',
    fatherName: 'Hartawan Samudra',
    motherName: 'Endang Lestari',
  },
  bride: {
    photoUrl: bridePhoto,
    name: 'Marina Permata',
    fatherName: 'Bambang Permata',
    motherName: 'Retno Wulan',
  },
  akad: { date: 14, month: 'Juni', year: 2025, time: '08.00 WIB', until: 's/d selesai' },
  resepsi: { date: 14, month: 'Juni', year: 2025, time: '11.00 WIB', until: 's/d 15.00 WIB' },
  eventTarget: '2025-06-14T08:00:00',
  venue: {
    name: 'Ocean View Chapel',
    address: 'Tebing Pecatu, Kuta Selatan, Bali',
    mapsUrl: 'https://maps.google.com',
  },
  gallery: [gallery1, gallery2, gallery3, gallery4],
  banks: [
    { bankName: 'Bank Central Asia', logoText: 'BCA', logoColor: '#fff', bgColor: '#1d2a44', accountNumber: '9876 5432 10', accountHolder: 'Kai Samudra' },
  ],
  rsvpDeadline: '7 Juni 2025',
  comments: [],
};

// Inline SVGs for Seaside / Oceanic elements
function OceanicOrnament({ type = 'coral', className = '' }) {
  if (type === 'coral') {
    return (
      <svg className={`oceanic__ornament-svg ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M50 95 C50 75, 45 60, 35 50 C25 40, 15 45, 10 35 C5 25, 15 20, 20 25 C25 30, 30 38, 38 45 C42 35, 38 25, 32 15 C28 5, 40 5, 45 12 C50 20, 48 30, 48 40 C52 30, 58 20, 68 15 C78 10, 82 20, 75 28 C68 36, 60 40, 55 48 C65 52, 75 48, 85 58 C95 68, 85 75, 80 70 C75 65, 70 58, 55 58 C54 70, 55 82, 50 95 Z" 
          fill="rgba(79, 172, 254, 0.25)" 
          stroke="rgba(0, 242, 254, 0.5)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
    );
  }
  
  // Starfish
  return (
    <svg className={`oceanic__ornament-svg ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M50 5 L58 35 L88 35 L64 53 L73 83 L50 65 L27 83 L36 53 L12 35 L42 35 Z" 
        fill="rgba(223, 195, 157, 0.3)" 
        stroke="#dfc39d" 
        strokeWidth="2.5" 
        strokeLinejoin="round" 
      />
      <circle cx="50" cy="50" r="3" fill="#dfc39d" />
    </svg>
  );
}

// Wave divider for sections
function WaveDivider({ fill = '#0a1a30', opacity = 0.5, className = '', flip = false }) {
  return (
    <div className={`oceanic__wave-wrap ${flip ? 'oceanic__wave-wrap--flip' : ''} ${className}`}>
      <svg className="oceanic__wave-svg" viewBox="0 0 1440 74" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          className="oceanic__wave-path-back"
          d="M0,32 C240,70 480,10 720,40 C960,70 1200,20 1440,45 L1440,74 L0,74 Z" 
          fill={fill} 
          opacity={opacity}
        />
        <path 
          className="oceanic__wave-path-front"
          d="M0,45 C320,15 640,65 960,35 C1280,5 1380,55 1440,40 L1440,74 L0,74 Z" 
          fill={fill} 
        />
      </svg>
    </div>
  );
}

// Custom Hook to generate rising air bubbles
const useBubbles = (count = 18) => {
  const [bubbles, setBubbles] = useState([]);
  useEffect(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${9 + Math.random() * 9}s`,
        scale: 0.3 + Math.random() * 0.7,
        opacity: 0.15 + Math.random() * 0.45
      });
    }
    setBubbles(list);
  }, [count]);
  return bubbles;
};

// Intersection Observer Reveal Component for scroll animations
function RevealSection({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`oceanic__reveal ${visible ? 'oceanic__reveal--visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="oceanic__divider">
      <span className="oceanic__divider-shell">🐚</span>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="oceanic__section-label">
      <h2>{children}</h2>
      <svg className="oceanic__label-decor" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10 C 30 18, 70 2, 90 10" stroke="#00f2fe" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="50" cy="9.5" r="3.5" fill="#dfc39d" />
      </svg>
    </div>
  );
}

function MiniCountdown({ targetISO }) {
  const [time, setTime] = useState({ d: '--', h: '--', m: '--', s: '--' });

  useEffect(() => {
    if (!targetISO) return;
    const tick = () => {
      const diff = new Date(targetISO) - new Date();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  const items = [
    { num: time.d, label: 'hari' },
    { num: time.h, label: 'jam' },
    { num: time.m, label: 'menit' },
    { num: time.s, label: 'detik' }
  ];

  return (
    <div className="oceanic__mini-countdown">
      {items.map(({ num, label }, i) => (
        <div key={i} className="oceanic__mc-box">
          <div className="oceanic__mc-num">{num}</div>
          <div className="oceanic__mc-label">{label}</div>
        </div>
      ))}
    </div>
  );
}

function CopyButton({ text, keepSpaces = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const formatted = keepSpaces ? text : text.replace(/\s/g, '');
    navigator.clipboard.writeText(formatted).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className={`oceanic__copy-btn${copied ? ' oceanic__copy-btn--copied' : ''}`}
      onClick={handleCopy}
    >
      {copied ? 'Tersalin!' : 'Salin'}
    </button>
  );
}

// Staggered couple layout components
function StaggeredPersonCard({ data, role }) {
  return (
    <div className={`oceanic__staggered-person oceanic__staggered-person--${role}`}>
      <div className="oceanic__staggered-frame-wrapper">
        <div className="oceanic__staggered-photo">
          <img
            src={data.photoUrl || (role === 'groom' ? groomPhoto : bridePhoto)}
            alt={data.name}
            onError={(e) => {
              e.target.src = role === 'groom' ? groomPhoto : bridePhoto;
            }}
          />
        </div>
        <OceanicOrnament type="starfish" className="oceanic__staggered-starfish" />
      </div>
      
      <div className="oceanic__staggered-info">
        <div className="oceanic__staggered-name">{data.name}</div>
        <div className="oceanic__staggered-parents">
          {role === 'groom' ? 'Putra dari' : 'Putri dari'}<br />
          <span className="oceanic__parent-name">{data.fatherName}</span><br />
          &amp;<br />
          <span className="oceanic__parent-name">{data.motherName}</span>
        </div>
      </div>
    </div>
  );
}

// Side-by-side Event Card layout
function EventCard({ label, event }) {
  const targetTime = event.isoDate || (label === 'Akad Nikah' ? '2025-06-14T08:00:00' : '2025-06-14T11:00:00');

  return (
    <div className="oceanic__event-card-modern">
      <div className="oceanic__event-date-side">
        <div className="oceanic__event-type-tag">{label}</div>
        <div className="oceanic__event-date-num">{event.date}</div>
        <div className="oceanic__event-date-month">{event.month}</div>
        <div className="oceanic__event-date-year">{event.year}</div>
      </div>
      
      <div className="oceanic__event-info-side">
        <div className="oceanic__event-time-row">
          <span className="icon">🕒</span> <strong>{event.time}</strong> {event.until}
        </div>
        {event.address && (
          <div className="oceanic__event-address-row">
            <span className="icon">📍</span> {event.address}
          </div>
        )}
        
        <div className="oceanic__event-countdown-row">
          <MiniCountdown targetISO={targetTime} />
        </div>
        
        {event.mapsUrl && (
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="oceanic__maps-btn-modern"
          >
            Petunjuk Arah Lokasi
          </a>
        )}
      </div>
    </div>
  );
}

function GalleryGrid({ items, onItemClick }) {
  const isEmoji = (s) => /\p{Emoji}/u.test(s) && s.length <= 4;

  return (
    <div className="oceanic__gallery">
      {items.slice(0, 5).map((item, i) => (
        <div
          key={i}
          className={`oceanic__gallery-item${i === 0 ? ' oceanic__gallery-item--wide' : ''}`}
          onClick={() => !isEmoji(item) && onItemClick(item)}
        >
          {isEmoji(item)
            ? item
            : <img
              src={item}
              alt={`Foto ${i + 1}`}
              onError={(e) => e.target.style.display = 'none'}
            />
          }
        </div>
      ))}
    </div>
  );
}

function GuestBook({ initialEntries, weddingId, onCommentSubmitted }) {
  const [entries, setEntries] = useState(initialEntries);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName) {
      alert("Nama wajib diisi");
      return;
    }
    if (!attendance) {
      alert("Konfirmasi kehadiran wajib dipilih");
      return;
    }

    if (!weddingId) {
      const newEntry = {
        id: Date.now(),
        name: trimmedName,
        message: trimmedMessage || "Mengonfirmasi kehadiran.",
        time: 'Baru saja',
      };
      setEntries(prev => [...prev, newEntry]);
      setName('');
      setMessage('');
      setAttendance('');
      setSubmitted(true);
      return;
    }

    setLoading(true);
    try {
      let willAttendVal = 1;
      if (attendance === 'tidak') willAttendVal = 0;
      else if (attendance === 'mungkin') willAttendVal = null;

      const response = await fetch(`http://localhost:5000/api/invitations/${weddingId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          guest_name: trimmedName,
          message: trimmedMessage || null,
          will_attend: willAttendVal,
          jumlah_tamu: 1
        })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setName('');
        setMessage('');
        setAttendance('');
        setSubmitted(true);
        if (onCommentSubmitted) {
          onCommentSubmitted();
        }
      } else {
        alert(result.message || "Gagal mengirim ucapan & konfirmasi");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung dengan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="oceanic__guestbook">
      <SectionLabel>RSVP &amp; Buku Tamu</SectionLabel>

      {submitted ? (
        <div className="oceanic__rsvp-success">
          Terima kasih! Konfirmasi kehadiran dan ucapan doa Anda telah terkirim. 🌊
          <button
            onClick={() => setSubmitted(false)}
            className="oceanic__rsvp-resubmit"
          >
            Kirim ucapan baru
          </button>
        </div>
      ) : (
        <form onSubmit={handleSend} className="oceanic__rsvp-form">
          <input
            type="text"
            placeholder="Nama Lengkap Anda"
            className="oceanic__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select
            className="oceanic__select"
            value={attendance}
            onChange={(e) => setAttendance(e.target.value)}
            required
          >
            <option value="" disabled>-- Konfirmasi Kehadiran --</option>
            <option value="ya">Saya Akan Hadir</option>
            <option value="tidak">Maaf, Saya Tidak Bisa Hadir</option>
            <option value="mungkin">Masih Tentatif</option>
          </select>
          <textarea
            placeholder="Tulis pesan ucapan & doa restu hangat Anda di sini..."
            className="oceanic__textarea"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="oceanic__rsvp-btn" type="submit" disabled={loading}>
            {loading ? 'Mengirim pesan...' : 'Kirim Ucapan & Konfirmasi'}
          </button>
        </form>
      )}

      <div className="oceanic__gb-entries" ref={listRef}>
        <div className="oceanic__gb-title">Ucapan Doa Restu ({entries.length})</div>
        {entries.length === 0 ? (
          <div className="oceanic__gb-empty">
            Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
          </div>
        ) : (
          entries.map(e => (
            <div className="oceanic__gb-entry" key={e.id}>
              <div className="oceanic__gb-name">{e.name}</div>
              <div className="oceanic__gb-message">"{e.message}"</div>
              <div className="oceanic__gb-time">📅 {e.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function OceanicTemplate({ data: dataProp, weddingId, onRsvpSubmitted }) {
  const [lightboxImg, setLightboxImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const bubbles = useBubbles(18); // Floating water bubbles background

  const data = {
    ...DEFAULT_DATA,
    ...dataProp,
    cover: { ...DEFAULT_DATA.cover, ...dataProp?.cover },
    groom: { ...DEFAULT_DATA.groom, ...dataProp?.groom },
    bride: { ...DEFAULT_DATA.bride, ...dataProp?.bride },
    venue: { ...DEFAULT_DATA.venue, ...dataProp?.venue },
  };

  const queryParams = new URLSearchParams(window.location.search);
  const guestName = queryParams.get('to') || queryParams.get('guest') || '';

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  const handleOpen = () => {
    setIsOpen(true);
    if (data.music?.url) {
      const player = new Audio(data.music.url);
      player.loop = true;
      player.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Audio play blocked by browser", err);
      });
      setAudio(player);
    }
  };

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  return (
    <div className={`oceanic ${isOpen ? 'oceanic--unlocked' : 'oceanic--locked'}`}>

      {/* Floating Air Bubbles Animation Background */}
      <div className="oceanic__bubbles-container">
        {bubbles.map(b => (
          <div
            key={b.id}
            className="oceanic__bubble"
            style={{
              left: b.left,
              animationDelay: b.delay,
              animationDuration: b.duration,
              transform: `scale(${b.scale})`,
              opacity: b.opacity
            }}
          />
        ))}
      </div>

      {/* Deep-sea Sunlight rays effect */}
      <div className="oceanic__light-rays">
        <div className="oceanic__ray oceanic__ray--1"></div>
        <div className="oceanic__ray oceanic__ray--2"></div>
        <div className="oceanic__ray oceanic__ray--3"></div>
      </div>

      {/* ── COVER TERBUKA / OPENING SCREEN OVERLAY (FULL-BLEED) ── */}
      <div className={`oceanic__opening-screen ${isOpen ? 'oceanic__opening-screen--hidden' : ''}`}>
        {/* Full-bleed background image for opening screen */}
        <div className="oceanic__opening-bg">
          <img
            src={data.cover.pic_amore_slide_1 || picAmoreSlide1}
            alt="Background"
            onError={(e) => { e.target.src = picAmoreSlide1; }}
          />
        </div>
        <div className="oceanic__opening-overlay" />

        <OceanicOrnament type="coral" className="oceanic__ornament-tl" />
        <OceanicOrnament type="starfish" className="oceanic__ornament-tr" />
        <OceanicOrnament type="starfish" className="oceanic__ornament-bl" />
        <OceanicOrnament type="coral" className="oceanic__ornament-br" />

        <div className="oceanic__opening-content">
          <div className="oceanic__opening-subtitle">UNDANGAN PERNIKAHAN</div>
          <h1 className="oceanic__opening-names">
            {data.cover.groomName} &amp; {data.cover.brideName}
          </h1>

          <div className="oceanic__opening-recipient">
            <span className="label-to">Kepada Yth. Bapak/Ibu/Saudara/i</span>
            {guestName && <div className="guest-name">{guestName}</div>}
          </div>

          <p className="oceanic__opening-intro">
            Dengan penuh kebahagiaan dan rasa syukur, kami mengundang Anda untuk merayakan hari istimewa kami.
          </p>

          <button className="oceanic__open-btn" onClick={handleOpen}>
            ✉️ Buka Undangan
          </button>

          <span className="oceanic__opening-apology">
            *mohon maaf apabila ada kesalahan penulisan nama/gelar
          </span>
        </div>
        
        <WaveDivider fill="#091322" opacity={0.6} className="oceanic__opening-wave" />
      </div>

      {/* ── FLOATING AUDIO BUTTON ── */}
      {audio && (
        <button
          className={`oceanic__audio-toggle ${isPlaying ? 'oceanic__audio-toggle--playing' : ''}`}
          onClick={togglePlay}
          aria-label="Toggle music"
        >
          {isPlaying ? '🎵' : '🔇'}
        </button>
      )}

      {/* ── COVER (FULL-BLEED BACKGROUND HERO) ── */}
      <div className="oceanic__cover-hero">
        <div className="oceanic__cover-bg">
          <img
            src={data.cover.pic_amore_slide_1 || picAmoreSlide1}
            alt="Hero Background"
            onError={(e) => { e.target.src = picAmoreSlide1; }}
          />
        </div>
        <div className="oceanic__cover-gradient-overlay" />

        <div className="oceanic__cover-hero-content">
          <div className="oceanic__cover-glass-card">
            <div className="oceanic__invitation-label">Undangan Pernikahan</div>
            <div className="oceanic__names">
              {data.cover.groomName} &amp; {data.cover.brideName}
            </div>
            <div className="oceanic__verse">
              "{data.cover.verse}"
              <cite>— {data.cover.verseSource}</cite>
            </div>
          </div>
        </div>
      </div>

      <WaveDivider fill="#0c1c30" opacity={0.4} />

      {/* ── MEMPELAI (STAGGERED REDESIGN) ── */}
      <div className="oceanic__section">
        <RevealSection>
          <SectionLabel>Mempelai</SectionLabel>
          {data.blessing && (
            <p className="oceanic__couple-intro">
              {data.blessing}
            </p>
          )}
        </RevealSection>
        
        <RevealSection>
          {/* Staggered offset modern layouts for the couple */}
          <div className="oceanic__couple-staggered">
            <StaggeredPersonCard data={data.groom} role="groom" />
            
            <div className="oceanic__couple-divider">
              <span className="oceanic__love-amp">&amp;</span>
            </div>
            
            <StaggeredPersonCard data={data.bride} role="bride" />
          </div>
        </RevealSection>
      </div>

      <WaveDivider fill="#07101e" opacity={0.5} flip={true} />

      {/* ── WAKTU & TEMPAT (MODERN CARD REDESIGN) ── */}
      <div className="oceanic__section">
        <RevealSection>
          <SectionLabel>Waktu &amp; Tempat</SectionLabel>
        </RevealSection>
        
        <RevealSection>
          <div className="oceanic__events-grid-modern">
            <EventCard label="Akad Nikah" event={data.akad} />
            <EventCard label="Resepsi Pernikahan" event={data.resepsi} />
          </div>
        </RevealSection>
      </div>

      <WaveDivider fill="#0c1c30" opacity={0.4} />

      {/* ── CERITA CINTA (SHORELINE TIMELINE REDESIGN) ── */}
      {data.loveStories && data.loveStories.length > 0 && (
        <>
          <div className="oceanic__section">
            <RevealSection>
              <SectionLabel>Cerita Cinta Kami</SectionLabel>
            </RevealSection>
            
            <RevealSection>
              <div className="oceanic__shoreline-timeline">
                {data.loveStories.map((story, i) => (
                  <div key={story.id || i} className="oceanic__shoreline-item">
                    <div className="oceanic__shoreline-node">
                      <span className="oceanic__node-bubble">🫧</span>
                    </div>
                    
                    <div className="oceanic__shoreline-content">
                      <div className="oceanic__shoreline-header">
                        <span className="oceanic__shoreline-date">{story.date}</span>
                        <h3 className="oceanic__shoreline-title">{story.title}</h3>
                      </div>
                      
                      {story.photoUrl && (
                        <div className="oceanic__shoreline-photo">
                          <img
                            src={story.photoUrl}
                            alt={story.title}
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      )}
                      
                      <p className="oceanic__shoreline-desc">{story.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
          <WaveDivider fill="#07101e" opacity={0.5} flip={true} />
        </>
      )}

      {/* ── GALERI ── */}
      <div className="oceanic__section">
        <RevealSection>
          <SectionLabel>Galeri Foto</SectionLabel>
        </RevealSection>
        
        <RevealSection>
          <GalleryGrid items={data.gallery} onItemClick={setLightboxImg} />
        </RevealSection>
      </div>

      <WaveDivider fill="#0c1c30" opacity={0.4} />

      {/* ── WEDDING GIFT ── */}
      <div className="oceanic__section">
        <RevealSection>
          <SectionLabel>Wedding Gift</SectionLabel>
          
          {data.giftMessage && (
            <p className="oceanic__gift-intro">
              {data.giftMessage}
            </p>
          )}
        </RevealSection>

        <RevealSection>
          {((data.banks && data.banks.length > 0) || data.shippingAddress) && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "850px",
              margin: "0 auto",
              width: "100%"
            }}>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "center",
                width: "100%"
              }}>
                {data.banks && data.banks.map((bank, i) => (
                  <div className="oceanic__bank-card" key={i}>
                    <div
                      className="oceanic__bank-logo"
                      style={{ background: '#00f2fe', color: '#07101e' }}
                    >
                      {bank.logoText}
                    </div>
                    <div className="oceanic__bank-info">
                      <div className="oceanic__bank-name">{bank.bankName}</div>
                      <div className="oceanic__bank-number">{bank.accountNumber}</div>
                      <div className="oceanic__bank-holder">a.n. {bank.accountHolder}</div>
                    </div>
                    <CopyButton text={bank.accountNumber} />
                  </div>
                ))}

                {data.shippingAddress && (
                  <div className="oceanic__bank-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="oceanic__bank-logo" style={{ background: '#00f2fe', color: '#07101e', fontSize: '14px' }}>
                        📦
                      </div>
                      <div className="oceanic__bank-info">
                        <div className="oceanic__bank-name" style={{ margin: 0, fontWeight: 700, color: '#fff' }}>Alamat Pengiriman Kado</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#a0aec0', lineHeight: 1.5, background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,242,254,0.2)', textAlign: 'left' }}>
                      {data.shippingAddress}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                      <CopyButton text={data.shippingAddress} keepSpaces={true} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </RevealSection>
      </div>

      <WaveDivider fill="#07101e" opacity={0.5} flip={true} />

      {/* ── GUESTBOOK & RSVP ── */}
      <RevealSection>
        <GuestBook
          initialEntries={data.comments || []}
          weddingId={weddingId}
          onCommentSubmitted={onRsvpSubmitted}
        />
      </RevealSection>

      <WaveDivider fill="#03080f" opacity={0.4} />

      {/* ── CLOSING SECTION ── */}
      <div className="oceanic__closing">
        <OceanicOrnament type="coral" className="oceanic__cover-decor-tl" style={{ opacity: 0.1 }} />
        
        <RevealSection>
          <p className="oceanic__closing-text">
            Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih yang sebesar-besarnya.
          </p>
        </RevealSection>

        <RevealSection>
          <div className="oceanic__closing-photo">
            <img
              src={data.cover.pic_amore_slide_1 || picAmoreSlide1}
              alt="Foto Mempelai"
              onError={(e) => { e.target.src = picAmoreSlide1; }}
            />
          </div>
        </RevealSection>

        <RevealSection>
          <div className="oceanic__closing-signature">
            <span className="label-happy">Kami yang berbahagia</span>
            <h2 className="names-happy">
              {data.cover.groomName} &amp; {data.cover.brideName}
            </h2>
          </div>
        </RevealSection>
      </div>

      {/* ── FOOTER ── */}
      <div className="oceanic__footer">
        <div className="oceanic__footer-quote">
          {data.footerQuote ? (
            data.footerQuote.split('\n').map((line, i) => (
              <span key={i}>{line}{i < data.footerQuote.split('\n').length - 1 && <br />}</span>
            ))
          ) : (
            <>
              "Bagaikan hamparan samudera yang tak bertepi,<br />
              semoga kasih sayang kita kekal abadi dalam rahmat-Nya."
            </>
          )}
        </div>
        <div className="oceanic__footer-brand">Datangya.site · Oceanic Theme</div>
      </div>

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxImg && (
        <div className="oceanic__lightbox" onClick={() => setLightboxImg(null)}>
          <div className="oceanic__lightbox-close">&times;</div>
          <img
            src={lightboxImg}
            alt="Detail foto"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
}
