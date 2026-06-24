// src/templates/Amore/AmoreTemplate.jsx
//
// Props:
//   data = {
//     cover: {
//       photoUrl: string | null,
//       groomName: string,
//       brideName: string,
//       verse: string,
//       verseSource: string,
//     },
//     groom: { photoUrl, name, fatherName, motherName },
//     bride:  { photoUrl, name, fatherName, motherName },
//     akad:   { date: number, month: string, year: number, time: string, until: string },
//     resepsi:{ date: number, month: string, year: number, time: string, until: string },
//     eventTarget: string,   // ISO date string untuk countdown, e.g. "2025-06-14T08:00:00"
//     venue: { name: string, address: string, mapsUrl: string },
//     gallery: string[],     // array URL foto (max 5), atau emoji placeholder
//     banks: [{ bankName, logoText, logoColor, bgColor, accountNumber, accountHolder }],
//     rsvpDeadline: string,  // e.g. "7 Juni 2025"
//   }

import { useState, useEffect, useRef } from 'react';
import picAmoreSlide1 from './photos/pic_amore_slide_1.jpg';
import groomPhoto from './photos/bride_1.jpg';
import bridePhoto from './photos/bride_2.jpg';
import gallery1 from './photos/gallery_1.jpg';
import gallery2 from './photos/gallery_2.jpg';
import gallery3 from './photos/gallery_3.jpg';
import gallery4 from './photos/gallery_4.jpg';
import './Amore.css';

// ─── Default data (bisa di-override lewat props) ────────────────────────────
const DEFAULT_DATA = {
  cover: {
    pic_amore_slide_1: picAmoreSlide1,
    groomName: 'Rizky Aditya',
    brideName: 'Salsabila Putri',
    verse: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri.',
    verseSource: 'QS. Ar-Rum: 21',
  },
  groom: {
    photoUrl: groomPhoto,
    name: 'Rizky Aditya',
    fatherName: 'Bpk. H. Ahmad Faruq',
    motherName: 'Ibu Hj. Dewi Rahayu',
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
    name: 'Grand Ballroom Mulia Hotel',
    address: 'Jl. HR. Rasuna Said Kav. X-6 No.8,\nSetiabudi, Jakarta Selatan 12950',
    mapsUrl: 'https://maps.google.com',
  },
  gallery: [gallery1, gallery2, gallery3, gallery4],
  banks: [
    { bankName: 'Bank Central Asia', logoText: 'BCA', logoColor: '#fff', bgColor: '#005baa', accountNumber: '1234 5678 90', accountHolder: 'Rizky Aditya' },
    { bankName: 'Bank Negara Indonesia', logoText: 'BNI', logoColor: '#fff', bgColor: '#f47920', accountNumber: '0987 6543 21', accountHolder: 'Salsabila Putri' },
  ],
  rsvpDeadline: '7 Juni 2025',
  comments: [],
};

const INITIAL_ENTRIES = [
  { id: 1, name: 'Anindya R.',        message: 'Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah mawaddah warahmah. Aamiin!', time: '2 hari lalu' },
  { id: 2, name: 'Fajar & Keluarga', message: 'Barakallahu lakuma wa baraka alaikuma. Semoga langgeng ya kak!', time: '5 jam lalu' },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="amore__divider">
      <div className="amore__divider-line" />
      <div className="amore__divider-dot" />
      <div className="amore__divider-line" />
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="amore__section-label">{children}</div>;
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
          background: 'rgba(181,101,42,0.08)', border: '1px solid rgba(181,101,42,0.15)',
          borderRadius: '6px', padding: '4px 6px', minWidth: '34px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e4a35a', lineHeight: 1 }}>{num}</div>
          <div style={{ fontSize: '7px', color: 'rgba(232,221,208,0.3)', textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.05em' }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text.replace(/\s/g, '')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className={`amore__copy-btn${copied ? ' amore__copy-btn--copied' : ''}`}
      onClick={handleCopy}
    >
      {copied ? 'Tersalin!' : 'Salin'}
    </button>
  );
}

function PersonCard({ data, role }) {
  return (
    <div className="amore__person">
      <div className="amore__person-photo">
        <img 
          src={data.photoUrl || (role === 'groom' ? groomPhoto : bridePhoto)} 
          alt={data.name} 
          onError={(e) => {
            e.target.src = role === 'groom' ? groomPhoto : bridePhoto;
          }}
        />
      </div>
      <div className="amore__person-name">{data.name}</div>
      <div className="amore__person-parents">
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
    <div className="amore__event-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '100%' }}>
        <div className="amore__event-type">{label}</div>
        <div className="amore__event-date">{event.date}</div>
        <div className="amore__event-month">{event.month} {event.year}</div>
        <div className="amore__event-time">{event.time}</div>
        <div className="amore__event-until">{event.until}</div>
        
        {/* Mini Countdown inside the Card */}
        <MiniCountdown targetISO={targetTime} />
      </div>
      
      <div style={{ width: '100%' }}>
        {event.address && (
          <div className="amore__event-address" style={{ marginTop: '14px', fontSize: '11px', color: 'rgba(232,221,208,0.45)', lineHeight: '1.6', wordBreak: 'break-word', maxWidth: '100%' }}>
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
              marginTop: '14px', fontSize: '10px', color: '#b5652a', 
              textDecoration: 'none', fontWeight: 700, border: '1px solid rgba(181,101,42,0.3)',
              padding: '6px 12px', borderRadius: '20px', background: 'rgba(181,101,42,0.05)',
              transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(181,101,42,0.15)';
              e.currentTarget.style.borderColor = 'rgba(181,101,42,0.6)';
              e.currentTarget.style.color = '#e4a35a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(181,101,42,0.05)';
              e.currentTarget.style.borderColor = 'rgba(181,101,42,0.3)';
              e.currentTarget.style.color = '#b5652a';
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
  // item bisa URL string atau emoji string
  const isEmoji = (s) => /\p{Emoji}/u.test(s) && s.length <= 4;

  return (
    <div className="amore__gallery">
      {items.slice(0, 5).map((item, i) => (
        <div
          key={i}
          className={`amore__gallery-item${i === 0 ? ' amore__gallery-item--wide' : ''}`}
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

function GuestBook({ initialEntries, weddingId, onCommentSubmitted, deadline }) {
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
      // Mock for static template preview
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
    <div className="amore__guestbook" style={{ padding: '24px 28px' }}>
      <SectionLabel>Konfirmasi Kehadiran & Doa Restu</SectionLabel>
      
      {deadline && (
        <div className="amore__rsvp-intro" style={{ marginBottom: '20px', textAlign: 'center', fontSize: '13px', color: 'rgba(232,221,208,0.45)' }}>
          Mohon konfirmasi kehadiran Anda paling lambat {deadline} agar kami
          dapat mempersiapkan dengan sebaik-baiknya.
        </div>
      )}

      {submitted ? (
        <div className="amore__rsvp-success" style={{ marginBottom: '24px' }}>
          Terima kasih! Konfirmasi kehadiran dan ucapan doa Anda telah terkirim. 🎉
          <button 
            onClick={() => setSubmitted(false)}
            style={{ 
              display: 'block', margin: '10px auto 0', background: 'none', border: 'none', 
              color: '#b5652a', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' 
            }}
          >
            Kirim ucapan baru
          </button>
        </div>
      ) : (
        <form onSubmit={handleSend} className="amore__rsvp-form" style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            className="amore__input"
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
          <select 
            className="amore__select" 
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
            className="amore__textarea"
            rows={3}
            placeholder="Tulis ucapan doa restu Anda..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
          <button className="amore__rsvp-btn" type="submit" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Konfirmasi & Ucapan"}
          </button>
        </form>
      )}

      <h3 style={{ 
        fontSize: '12px', textTransform: 'uppercase', color: '#b5652a', 
        letterSpacing: '0.15em', marginBottom: '16px', borderBottom: '1px solid rgba(181,101,42,0.15)', 
        paddingBottom: '8px', fontWeight: 'bold' 
      }}>
        Ucapan & Doa Restu ({entries.length})
      </h3>

      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(232,221,208,0.3)', fontSize: '13px', fontStyle: 'italic' }}>
          Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
        </div>
      ) : (
        <div className="amore__gb-entries" ref={listRef}>
          {entries.map((e) => (
            <div className="amore__gb-entry" key={e.id}>
              <div className="amore__gb-name">{e.name}</div>
              <div className="amore__gb-message">"{e.message}"</div>
              <div className="amore__gb-time">{e.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AmoreTemplate({ data: dataProp, weddingId, onRsvpSubmitted }) {
  const [lightboxImg, setLightboxImg] = useState(null);
  // Lakukan deep merge manual agar properti di dalam objek cover, groom, dll 
  // tetap memiliki nilai default jika tidak dikirim oleh API/Props
  const data = {
    ...DEFAULT_DATA,
    ...dataProp,
    cover: { ...DEFAULT_DATA.cover, ...dataProp?.cover },
    groom: { ...DEFAULT_DATA.groom, ...dataProp?.groom },
    bride: { ...DEFAULT_DATA.bride, ...dataProp?.bride },
    venue: { ...DEFAULT_DATA.venue, ...dataProp?.venue },
  };

  return (
    <div className="amore">

      {/* ── COVER ── */}
    <div className="amore__cover">
    {/* Kolom kiri: foto */}
    <div className="amore__cover-art">
        <div className="amore__ornament amore__ornament--top" />
        <span className="amore__flourish amore__flourish--tl" aria-hidden>&amp;</span>
        <span className="amore__flourish amore__flourish--br" aria-hidden>&amp;</span>
        <div className="amore__photo-frame">
          <img 
            src={data.cover.pic_amore_slide_1 || picAmoreSlide1} 
            alt="Foto mempelai" 
            onError={(e) => {
              e.target.src = picAmoreSlide1;
            }}
          />
        </div>
        <div className="amore__ornament amore__ornament--bottom" />
    </div>
    
    {/* Kolom kanan: teks */}
    <div className="amore__cover-text">
        <div className="amore__bismillah">Bismillahirrahmanirrahim</div>
        <div className="amore__invitation-label">Undangan Pernikahan</div>
        <div className="amore__names">
        {data.cover.groomName}
        <span className="amore__names-amp">&amp;</span>
        {data.cover.brideName}
        </div>
        <div className="amore__verse">
        "{data.cover.verse}"
        <cite>— {data.cover.verseSource}</cite>
        </div>
        {/* Scroll hint — hanya muncul di desktop via CSS */}
        <div className="amore__scroll-hint">Scroll untuk lihat undangan</div>
    </div>
    </div>
 

      <Divider />

      {/* ── MEMPELAI ── */}
      <div className="amore__section">
        <SectionLabel>Mempelai</SectionLabel>
        <div className="amore__couple-grid">
          <PersonCard data={data.groom} role="groom" />
          <PersonCard data={data.bride} role="bride" />
        </div>
      </div>

      <Divider />

      {/* ── WAKTU & TEMPAT ── */}
      <div className="amore__section">
        <SectionLabel>Waktu &amp; Tempat</SectionLabel>
        <div className="amore__events-grid">
          <EventCard label="Akad Nikah" event={data.akad} />
          <EventCard label="Resepsi"    event={data.resepsi} />
        </div>
      </div>

      <Divider />

      {/* ── CERITA CINTA (LOVE STORIES) ── */}
      {data.loveStories && data.loveStories.length > 0 && (
        <>
          <div className="amore__section">
            <SectionLabel>Cerita Cinta Kami</SectionLabel>
            <div className="amore__timeline">
              {data.loveStories.map((story, i) => (
                <div 
                  key={story.id || i} 
                  className={`amore__timeline-item ${i % 2 === 0 ? 'amore__timeline-item--left' : 'amore__timeline-item--right'}`}
                >
                  <div className="amore__timeline-badge"></div>
                  <div className="amore__timeline-content">
                    <span className="amore__timeline-date">{story.date}</span>
                    <h3 className="amore__timeline-title">{story.title}</h3>
                    {story.photoUrl && (
                      <div className="amore__timeline-photo">
                        <img 
                          src={story.photoUrl} 
                          alt={story.title} 
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                    <p className="amore__timeline-desc">{story.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Divider />
        </>
      )}

      {/* ── GALERI ── */}
      <div className="amore__section">
        <SectionLabel>Galeri Foto</SectionLabel>
        <GalleryGrid items={data.gallery} onItemClick={setLightboxImg} />
      </div>

      <Divider />

      {/* ── WEDDING GIFT ── */}
      <div className="amore__section">
        <SectionLabel>Wedding Gift</SectionLabel>
        <div className="amore__bank-list">
          {data.banks.map((bank, i) => (
            <div className="amore__bank-card" key={i}>
              <div
                className="amore__bank-logo"
                style={{ background: bank.bgColor, color: bank.logoColor }}
              >
                {bank.logoText}
              </div>
              <div className="amore__bank-info">
                <div className="amore__bank-name">{bank.bankName}</div>
                <div className="amore__bank-number">{bank.accountNumber}</div>
                <div className="amore__bank-holder">a.n. {bank.accountHolder}</div>
              </div>
              <CopyButton text={bank.accountNumber} />
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ── GUESTBOOK & RSVP ── */}
      <GuestBook 
        initialEntries={data.comments || []} 
        weddingId={weddingId}
        onCommentSubmitted={onRsvpSubmitted}
        deadline={data.rsvpDeadline}
      />

      {/* ── FOOTER ── */}
      <div className="amore__footer">
        <div className="amore__footer-quote">
          {data.footerQuote ? (
            data.footerQuote.split('\n').map((line, i) => (
              <span key={i}>{line}{i < data.footerQuote.split('\n').length - 1 && <br />}</span>
            ))
          ) : (
            <>
              "Cinta bukan tentang berapa lama kamu menunggu,<br />
              tapi tentang siapa yang membuatmu bahagia."
            </>
          )}
        </div>
        <div className="amore__footer-brand">Made with datangya.id</div>
      </div>

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxImg && (
        <div className="amore__lightbox" onClick={() => setLightboxImg(null)}>
          <div className="amore__lightbox-close">&times;</div>
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