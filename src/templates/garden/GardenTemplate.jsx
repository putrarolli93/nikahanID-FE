// src/templates/garden/GardenTemplate.jsx
//
// Props:
//   data = {
//     cover: {
//       pic_amore_slide_1: string | null,
//       groomName: string,
//       brideName: string,
//       verse: string,
//       verseSource: string,
//     },
//     groom: { photoUrl, name, fatherName, motherName },
//     bride:  { photoUrl, name, fatherName, motherName },
//     akad:   { date: number, month: string, year: number, time: string, until: string, address, mapsUrl },
//     resepsi:{ date: number, month: string, year: number, time: string, until: string, address, mapsUrl },
//     eventTarget: string,   // ISO date string
//     venue: { name: string, address: string, mapsUrl: string },
//     gallery: string[],
//     banks: [{ bankName, logoText, logoColor, bgColor, accountNumber, accountHolder }],
//     giftMessage: string,
//     shippingAddress: string,
//     rsvpDeadline: string,
//     comments: [{ id, name, message, time }],
//     blessing: string,      // Ucapan & doa pembuka
//     footerQuote: string,
//     loveStories: [{ id, title, date, description, photoUrl }]
//   }

import { useState, useEffect, useRef } from 'react';
import picAmoreSlide1 from '../amore/photos/pic_amore_slide_1.jpg';
import groomPhoto from '../amore/photos/bride_1.jpg';
import bridePhoto from '../amore/photos/bride_2.jpg';
import gallery1 from '../amore/photos/gallery_1.jpg';
import gallery2 from '../amore/photos/gallery_2.jpg';
import gallery3 from '../amore/photos/gallery_3.jpg';
import gallery4 from '../amore/photos/gallery_4.jpg';
import './Garden.css';

// ─── Default data ────────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  cover: {
    pic_amore_slide_1: picAmoreSlide1,
    groomName: 'Aditya',
    brideName: 'Salsabila',
    verse: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.',
    verseSource: 'QS. Ar-Rum: 21',
  },
  groom: {
    photoUrl: groomPhoto,
    name: 'Aditya Pratama',
    fatherName: 'Bpk. Ahmad Faruq',
    motherName: 'Ibu Dewi Rahayu',
  },
  bride: {
    photoUrl: bridePhoto,
    name: 'Salsabila Putri',
    fatherName: 'Bpk. Ir. Budi Santoso',
    motherName: 'Ibu Sri Wahyuni',
  },
  akad:    { date: 14, month: 'Juni', year: 2025, time: '08.00 WIB', until: 's/d selesai' },
  resepsi: { date: 14, month: 'Juni', year: 2025, time: '11.00 WIB', until: 's/d 15.00 WIB' },
  eventTarget: '2025-06-14T08:00:00',
  venue: {
    name: 'Grand Ballroom Hotel',
    address: 'Jl. Melati No. 12, Jakarta',
    mapsUrl: 'https://maps.google.com',
  },
  gallery: [gallery1, gallery2, gallery3, gallery4],
  banks: [
    { bankName: 'Bank Central Asia', logoText: 'BCA', logoColor: '#fff', bgColor: '#7fa08c', accountNumber: '1234567890', accountHolder: 'Aditya Pratama' },
  ],
  rsvpDeadline: '7 Juni 2025',
  comments: [],
};

// Inline SVG Floral Branch for corners with watercolor gradients
function FloralCorner({ className }) {
  return (
    <svg className={`garden__floral-svg ${className}`} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7fa08c" />
          <stop offset="100%" stopColor="#5b7866" />
        </linearGradient>
        <linearGradient id="flowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d896a7" />
          <stop offset="100%" stopColor="#b36f80" />
        </linearGradient>
      </defs>
      <path d="M10 110 C 30 70, 70 30, 110 10" stroke="#7fa08c" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M10 110 C 40 90, 80 80, 100 70" stroke="#7fa08c" strokeWidth="1.5" strokeLinecap="round"/>
      
      {/* Leaves */}
      <path d="M35 85 Q 25 75, 30 65 Q 40 75, 35 85 Z" fill="url(#leafGrad)"/>
      <path d="M55 65 Q 48 53, 55 45 Q 62 55, 55 65 Z" fill="url(#leafGrad)"/>
      <path d="M80 40 Q 72 30, 78 20 Q 86 30, 80 40 Z" fill="url(#leafGrad)"/>
      <path d="M50 90 Q 60 88, 65 78 Q 55 80, 50 90 Z" fill="url(#leafGrad)"/>
      <path d="M80 75 Q 90 73, 93 63 Q 83 65, 80 75 Z" fill="url(#leafGrad)"/>
      
      {/* Flowers with detailed multi-colored petals */}
      <circle cx="45" cy="55" r="4.5" fill="url(#flowerGrad)"/>
      <circle cx="41" cy="51" r="3.5" fill="#fddce4"/>
      <circle cx="49" cy="51" r="3.5" fill="#fddce4"/>
      <circle cx="41" cy="59" r="3.5" fill="#fddce4"/>
      <circle cx="49" cy="59" r="3.5" fill="#fddce4"/>
      <circle cx="45" cy="55" r="2" fill="#fff"/>

      <circle cx="78" cy="30" r="4.5" fill="url(#flowerGrad)"/>
      <circle cx="74" cy="26" r="3.5" fill="#fddce4"/>
      <circle cx="82" cy="26" r="3.5" fill="#fddce4"/>
      <circle cx="74" cy="34" r="3.5" fill="#fddce4"/>
      <circle cx="82" cy="34" r="3.5" fill="#fddce4"/>
      <circle cx="78" cy="30" r="2" fill="#fff"/>
    </svg>
  );
}

// Hook untuk generate kelopak bunga falling dan daun
const usePetals = (count = 18) => {
  const [petals, setPetals] = useState([]);
  useEffect(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        type: Math.random() > 0.45 ? 'leaf' : 'petal',
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${12 + Math.random() * 8}s`,
        scale: 0.35 + Math.random() * 0.65,
        rotate: `${Math.random() * 360}deg`
      });
    }
    setPetals(list);
  }, [count]);
  return petals;
};

function Divider() {
  return (
    <div className="garden__divider">
      <div className="garden__divider-line" />
      <div className="garden__divider-dot" />
      <div className="garden__divider-line" />
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="garden__section-label">{children}</div>;
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
    <div style={{ display: 'flex', gap: '6px', marginTop: '14px', justifyContent: 'center' }}>
      {items.map(({ num, label }, i) => (
        <div key={i} style={{ 
          background: 'rgba(127,160,140,0.08)', border: '1px solid rgba(127,160,140,0.15)',
          borderRadius: '6px', padding: '4px 6px', minWidth: '34px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#5b7866', lineHeight: 1 }}>{num}</div>
          <div style={{ fontSize: '7px', color: 'rgba(45,56,48,0.4)', textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.05em' }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function CopyButton({ text, keepSpaces = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const formatted = keepSpaces ? text : text.replace(/\s/g, '');
    navigator.clipboard.writeText(formatted).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className={`garden__copy-btn${copied ? ' garden__copy-btn--copied' : ''}`}
      onClick={handleCopy}
    >
      {copied ? 'Tersalin!' : 'Salin'}
    </button>
  );
}

function PersonCard({ data, role }) {
  return (
    <div className="garden__person">
      <div className="garden__person-photo">
        <img 
          src={data.photoUrl || (role === 'groom' ? groomPhoto : bridePhoto)} 
          alt={data.name} 
          onError={(e) => {
            e.target.src = role === 'groom' ? groomPhoto : bridePhoto;
          }}
        />
      </div>
      <div className="garden__person-name">{data.name}</div>
      <div className="garden__person-parents">
        {role === 'groom' ? 'Putra dari' : 'Putri dari'}<br />
        <span>{data.fatherName}</span><br />
        <span>{data.motherName}</span>
      </div>
    </div>
  );
}

function EventCard({ label, event }) {
  const targetTime = event.isoDate || (label === 'Akad Nikah' ? '2025-06-14T08:00:00' : '2025-06-14T11:00:00');
  
  return (
    <div className="garden__event-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '100%' }}>
        <div className="garden__event-type">{label}</div>
        <div className="garden__event-date">{event.date}</div>
        <div className="garden__event-month">{event.month} {event.year}</div>
        <div className="garden__event-time">{event.time}</div>
        <div className="garden__event-until">{event.until}</div>
        
        {/* Mini Countdown inside the Card */}
        <MiniCountdown targetISO={targetTime} />
      </div>
      
      <div style={{ width: '100%' }}>
        {event.address && (
          <div className="garden__event-address" style={{ marginTop: '14px', fontSize: '11px', color: 'rgba(45,56,48,0.7)', lineHeight: '1.6', wordBreak: 'break-word', maxWidth: '100%' }}>
            {event.address}
          </div>
        )}
        
        {event.mapsUrl && (
          <a 
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', 
              marginTop: '14px', fontSize: '10px', color: '#5b7866', 
              textDecoration: 'none', fontWeight: 700, border: '1px solid rgba(127,160,140,0.3)',
              padding: '6px 12px', borderRadius: '20px', background: 'rgba(127,160,140,0.05)',
              transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(127,160,140,0.15)';
              e.currentTarget.style.borderColor = 'rgba(127,160,140,0.6)';
              e.currentTarget.style.color = '#3d5245';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(127,160,140,0.05)';
              e.currentTarget.style.borderColor = 'rgba(127,160,140,0.3)';
              e.currentTarget.style.color = '#5b7866';
            }}
          >
            <i className="ti ti-map-pin" style={{ fontSize: '11px' }}></i>
            Buka Peta Lokasi
          </a>
        )}
      </div>
    </div>
  );
}

function GalleryGrid({ items, onItemClick }) {
  const isEmoji = (s) => /\p{Emoji}/u.test(s) && s.length <= 4;

  return (
    <div className="garden__gallery">
      {items.slice(0, 5).map((item, i) => (
        <div
          key={i}
          className={`garden__gallery-item${i === 0 ? ' garden__gallery-item--wide' : ''}`}
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
    <div className="garden__guestbook" style={{ padding: '24px 28px' }}>
      <SectionLabel>Konfirmasi Kehadiran & Doa Restu</SectionLabel>
      
      {submitted ? (
        <div className="garden__rsvp-success" style={{ marginBottom: '24px' }}>
          Terima kasih! Konfirmasi kehadiran dan ucapan doa Anda telah terkirim. 🎉
          <button 
            onClick={() => setSubmitted(false)}
            style={{ 
              display: 'block', margin: '10px auto 0', background: 'none', border: 'none', 
              color: '#5b7866', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' 
            }}
          >
            Kirim ucapan baru
          </button>
        </div>
      ) : (
        <form onSubmit={handleSend} className="garden__rsvp-form" style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            className="garden__input"
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
          <select 
            className="garden__select" 
            value={attendance} 
            onChange={(e) => setAttendance(e.target.value)} 
            disabled={loading}
            required
          >
            <option value="" disabled>Konfirmasi Kehadiran</option>
            <option value="ya">Ya, Saya Akan Hadir</option>
            <option value="tidak">Tidak, Saya Tidak Bisa Hadir</option>
            <option value="mungkin">Mungkin / Belum Pasti</option>
          </select>
          <textarea
            className="garden__textarea"
            rows={3}
            placeholder="Tulis ucapan doa restu Anda..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
          <button className="garden__rsvp-btn" type="submit" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Konfirmasi & Ucapan"}
          </button>
        </form>
      )}

      <h3 style={{ 
        fontSize: '12px', textTransform: 'uppercase', color: '#5b7866', 
        letterSpacing: '0.15em', marginBottom: '16px', borderBottom: '1px solid rgba(127,160,140,0.15)', 
        paddingBottom: '8px', fontWeight: 'bold' 
      }}>
        Ucapan & Doa Restu ({entries.length})
      </h3>

      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(45,56,48,0.3)', fontSize: '13px', fontStyle: 'italic' }}>
          Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
        </div>
      ) : (
        <div className="garden__gb-entries" ref={listRef}>
          {entries.map((e) => (
            <div className="garden__gb-entry" key={e.id}>
              <div className="garden__gb-name">{e.name}</div>
              <div className="garden__gb-message">"{e.message}"</div>
              <div className="garden__gb-time">{e.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function GardenTemplate({ data: dataProp, weddingId, onRsvpSubmitted }) {
  const [lightboxImg, setLightboxImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Prevent scroll while locked
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

  const petals = usePetals(20);

  return (
    <div className={`garden ${isOpen ? 'garden--unlocked' : 'garden--locked'}`}>
      
      {/* Falling Flower Petals & Leaves Animation Background */}
      <div className="garden__petals-container">
        {petals.map(p => (
          <div
            key={p.id}
            className={`garden__petal garden__petal--${p.type}`}
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              transform: `scale(${p.scale}) rotate(${p.rotate})`
            }}
          />
        ))}
      </div>

      {/* ── COVER TERBUKA / OPENING SCREEN OVERLAY ── */}
      <div className={`garden__opening-screen ${isOpen ? 'garden__opening-screen--hidden' : ''}`}>
        <div className="garden__corner-wrap garden__corner-wrap--tl">
          <FloralCorner />
        </div>
        <div className="garden__corner-wrap garden__corner-wrap--tr">
          <FloralCorner />
        </div>
        <div className="garden__corner-wrap garden__corner-wrap--bl">
          <FloralCorner />
        </div>
        <div className="garden__corner-wrap garden__corner-wrap--br">
          <FloralCorner />
        </div>

        <div className="garden__opening-content">
          <div className="garden__opening-frame">
            <img 
              src={data.cover.pic_amore_slide_1 || picAmoreSlide1} 
              alt="Foto Mempelai"
              onError={(e) => { e.target.src = picAmoreSlide1; }}
            />
          </div>
          
          <h1 className="garden__opening-names">
            {data.cover.groomName} <span className="amp">&amp;</span> {data.cover.brideName}
          </h1>

          <div className="garden__opening-recipient">
            <span className="label-to">Kepada Yth. Bapak/Ibu/Saudara/i</span>
            {guestName && <div className="guest-name">{guestName}</div>}
          </div>

          <p className="garden__opening-intro">
            Dengan penuh rasa syukur dan kelimpahan kasih, kami mengundang Anda untuk menghadiri perayaan pernikahan kami.
          </p>

          <button className="garden__open-btn" onClick={handleOpen}>
            <i className="ti ti-mail-open" style={{ marginRight: '8px' }}></i>
            Buka Undangan
          </button>

          <span className="garden__opening-apology">
            *mohon maaf apabila ada kesalahan penulisan nama/gelar
          </span>
        </div>
      </div>

      {/* ── FLOATING AUDIO BUTTON ── */}
      {audio && (
        <button 
          className={`garden__audio-toggle ${isPlaying ? 'garden__audio-toggle--playing' : ''}`} 
          onClick={togglePlay}
          title={isPlaying ? "Mute Music" : "Play Music"}
        >
          <i className={`ti ${isPlaying ? 'ti-music' : 'ti-music-off'}`}></i>
        </button>
      )}

      {/* ── COVER ── */}
      <div className="garden__cover">
        <div className="garden__corner-wrap garden__corner-wrap--tl" style={{ opacity: 0.7 }}><FloralCorner /></div>
        <div className="garden__corner-wrap garden__corner-wrap--br" style={{ opacity: 0.7 }}><FloralCorner /></div>
        
        <div className="garden__cover-art">
          <div className="garden__photo-frame">
            <img 
              src={data.cover.pic_amore_slide_1 || picAmoreSlide1} 
              alt="Foto mempelai" 
              onError={(e) => {
                e.target.src = picAmoreSlide1;
              }}
            />
          </div>
        </div>
        
        <div className="garden__cover-text">
          <div className="garden__invitation-label">Undangan Pernikahan</div>
          <div className="garden__names">
            {data.cover.groomName}
            <span className="garden__names-amp">&amp;</span>
            {data.cover.brideName}
          </div>
          <div className="garden__verse">
            "{data.cover.verse}"
            <cite>— {data.cover.verseSource}</cite>
          </div>
        </div>
      </div>

      <Divider />

      {/* ── MEMPELAI ── */}
      <div className="garden__section">
        <SectionLabel>Mempelai</SectionLabel>
        {data.blessing && (
          <p className="garden__couple-intro" style={{
            fontSize: '13.5px',
            color: 'rgba(45, 56, 48, 0.75)',
            textAlign: 'center',
            margin: '0 auto 30px',
            maxWidth: '600px',
            lineHeight: 1.7,
            whiteSpace: 'pre-line',
            padding: '0 20px'
          }}>
            {data.blessing}
          </p>
        )}
        <div className="garden__couple-grid">
          <PersonCard data={data.groom} role="groom" />
          <PersonCard data={data.bride} role="bride" />
        </div>
      </div>

      <Divider />

      {/* ── WAKTU & TEMPAT ── */}
      <div className="garden__section">
        <SectionLabel>Waktu &amp; Tempat</SectionLabel>
        <div className="garden__events-grid">
          <EventCard label="Akad Nikah" event={data.akad} />
          <EventCard label="Resepsi"    event={data.resepsi} />
        </div>
      </div>

      <Divider />

      {/* ── CERITA CINTA (LOVE STORIES) ── */}
      {data.loveStories && data.loveStories.length > 0 && (
        <>
          <div className="garden__section">
            <SectionLabel>Cerita Cinta Kami</SectionLabel>
            <div className="garden__timeline">
              {data.loveStories.map((story, i) => (
                <div 
                  key={story.id || i} 
                  className={`garden__timeline-item ${i % 2 === 0 ? 'garden__timeline-item--left' : 'garden__timeline-item--right'}`}
                >
                  <div className="garden__timeline-badge"></div>
                  <div className="garden__timeline-content">
                    <span className="garden__timeline-date">{story.date}</span>
                    <h3 className="garden__timeline-title">{story.title}</h3>
                    {story.photoUrl && (
                      <div className="garden__timeline-photo">
                        <img 
                          src={story.photoUrl} 
                          alt={story.title} 
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                    <p className="garden__timeline-desc">{story.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Divider />
        </>
      )}

      {/* ── GALERI ── */}
      <div className="garden__section">
        <SectionLabel>Galeri Foto</SectionLabel>
        <GalleryGrid items={data.gallery} onItemClick={setLightboxImg} />
      </div>

      <Divider />

      {/* ── WEDDING GIFT ── */}
      <div className="garden__section">
        <SectionLabel>Wedding Gift</SectionLabel>

        {data.giftMessage && (
          <p className="garden__closing-text" style={{ fontSize: '13px', color: 'rgba(45, 56, 48, 0.75)', textAlign: 'center', margin: '0 auto 20px', maxWidth: '500px', lineHeight: 1.6 }}>
            {data.giftMessage}
          </p>
        )}

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
                <div className="garden__bank-card" key={i} style={{ flex: "1 1 340px", maxWidth: "400px" }}>
                  <div
                    className="garden__bank-logo"
                    style={{ background: bank.bgColor, color: bank.logoColor }}
                  >
                    {bank.logoText}
                  </div>
                  <div className="garden__bank-info">
                    <div className="garden__bank-name">{bank.bankName}</div>
                    <div className="garden__bank-number">{bank.accountNumber}</div>
                    <div className="garden__bank-holder">a.n. {bank.accountHolder}</div>
                  </div>
                  <CopyButton text={bank.accountNumber} />
                </div>
              ))}

              {data.shippingAddress && (
                <div className="garden__bank-card" style={{ flex: "1 1 340px", maxWidth: "400px", flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="garden__bank-logo" style={{ background: '#7fa08c', color: '#fff', fontSize: '14px' }}>
                      📦
                    </div>
                    <div className="garden__bank-info">
                      <div className="garden__bank-name" style={{ margin: 0, fontWeight: 700, color: 'rgba(45,56,48,0.7)' }}>Alamat Pengiriman Kado</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#2d3830', lineHeight: 1.5, background: 'rgba(127,160,140,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(127,160,140,0.2)', textAlign: 'left' }}>
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
      </div>

      <Divider />

      {/* ── GUESTBOOK & RSVP ── */}
      <GuestBook 
        initialEntries={data.comments || []} 
        weddingId={weddingId}
        onCommentSubmitted={onRsvpSubmitted}
      />

      <Divider />

      {/* ── CLOSING SECTION ── */}
      <div className="garden__closing">
        <div className="garden__corner-wrap garden__corner-wrap--tl" style={{ opacity: 0.15 }}><FloralCorner /></div>
        <p className="garden__closing-text">
          Atas kehadiran dan do’a restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan Terima Kasih.
        </p>
        <p className="garden__closing-salam">
          Wassalamu’alaikum Wr. Wb.
        </p>
        
        <div className="garden__closing-photo">
          <img 
            src={data.cover.pic_amore_slide_1 || picAmoreSlide1} 
            alt="Foto Mempelai"
            onError={(e) => { e.target.src = picAmoreSlide1; }}
          />
        </div>

        <div className="garden__closing-signature">
          <span className="label-happy">Kami yang berbahagia</span>
          <h2 className="names-happy">
            {data.cover.groomName} &amp; {data.cover.brideName}
          </h2>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="garden__footer">
        <div className="garden__footer-quote">
          {data.footerQuote ? (
            data.footerQuote.split('\n').map((line, i) => (
              <span key={i}>{line}{i < data.footerQuote.split('\n').length - 1 && <br />}</span>
            ))
          ) : (
            <>
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri,<br />
              supaya kamu cenderung dan merasa tenteram kepadanya."
            </>
          )}
        </div>
        <div className="garden__footer-brand">Made with nikahanID</div>
      </div>

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxImg && (
        <div className="garden__lightbox" onClick={() => setLightboxImg(null)}>
          <div className="garden__lightbox-close">&times;</div>
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