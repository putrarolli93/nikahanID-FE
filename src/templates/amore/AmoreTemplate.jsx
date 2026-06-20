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

function Countdown({ targetISO }) {
  const [time, setTime] = useState({ h: '--', j: '--', m: '--', d: '--' });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetISO) - new Date();
      if (diff <= 0) { setTime({ h: 0, j: 0, m: 0, d: 0 }); return; }
      setTime({
        h: Math.floor(diff / 86400000),
        j: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        d: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  const boxes = [
    { num: time.h, label: 'Hari' },
    { num: time.j, label: 'Jam' },
    { num: time.m, label: 'Menit' },
    { num: time.d, label: 'Detik' },
  ];

  return (
    <div className="amore__countdown">
      {boxes.map(({ num, label }) => (
        <div className="amore__count-box" key={label}>
          <div className="amore__count-num">{num}</div>
          <div className="amore__count-label">{label}</div>
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
  return (
    <div className="amore__event-card">
      <div className="amore__event-type">{label}</div>
      <div className="amore__event-date">{event.date}</div>
      <div className="amore__event-month">{event.month} {event.year}</div>
      <div className="amore__event-time">{event.time}</div>
      <div className="amore__event-until">{event.until}</div>
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

function GuestBook({ initialEntries }) {
  const [entries, setEntries] = useState(initialEntries);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newEntry = {
      id: Date.now(),
      name: trimmed.split(' ').slice(0, 4).join(' '),
      message: 'Semoga menjadi keluarga yang bahagia dan penuh berkah selalu!',
      time: 'Baru saja',
    };
    setEntries(prev => [...prev, newEntry]);
    setInput('');
    setTimeout(() => {
      listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="amore__guestbook">
      <SectionLabel>Ucapan & Doa</SectionLabel>
      <div className="amore__gb-entries" ref={listRef}>
        {entries.map((e) => (
          <div className="amore__gb-entry" key={e.id}>
            <div className="amore__gb-name">{e.name}</div>
            <div className="amore__gb-message">"{e.message}"</div>
            <div className="amore__gb-time">{e.time}</div>
          </div>
        ))}
      </div>
      <div className="amore__gb-input-row">
        <input
          className="amore__gb-input"
          type="text"
          placeholder="Nama & ucapan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="amore__gb-send" onClick={handleSend}>Kirim</button>
      </div>
    </div>
  );
}

function RsvpForm({ deadline }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', kehadiran: '', jumlah: '', pesan: '' });

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.kehadiran) return;
    // TODO: kirim ke API / database
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="amore__rsvp-success">
        Terima kasih, <strong>{form.name}</strong>!<br />
        Konfirmasi kehadiran Anda sudah kami terima. 🎉
      </div>
    );
  }

  return (
    <div className="amore__rsvp-form">
      <input
        className="amore__input"
        type="text"
        placeholder="Nama lengkap"
        value={form.name}
        onChange={handleChange('name')}
      />
      <select className="amore__select" value={form.kehadiran} onChange={handleChange('kehadiran')}>
        <option value="" disabled>Konfirmasi kehadiran</option>
        <option value="hadir">Hadir</option>
        <option value="tidak">Tidak hadir</option>
        <option value="ragu">Belum pasti</option>
      </select>
      <select className="amore__select" value={form.jumlah} onChange={handleChange('jumlah')}>
        <option value="" disabled>Jumlah tamu</option>
        <option value="1">1 orang</option>
        <option value="2">2 orang</option>
        <option value="3">3 orang</option>
        <option value="4+">4+ orang</option>
      </select>
      <textarea
        className="amore__textarea"
        rows={2}
        placeholder="Pesan untuk mempelai (opsional)"
        value={form.pesan}
        onChange={handleChange('pesan')}
      />
      <button className="amore__rsvp-btn" onClick={handleSubmit}>
        Kirim Konfirmasi
      </button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AmoreTemplate({ data: dataProp }) {
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
        <Countdown targetISO={data.eventTarget} />
      </div>

      <Divider />

      {/* ── LOKASI ── */}
      <div className="amore__section">
        <SectionLabel>Lokasi</SectionLabel>
        <a
          className="amore__map-placeholder"
          href={data.venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="ti ti-map-pin amore__map-icon" aria-hidden="true" />
          <div className="amore__map-name">{data.venue.name}</div>
          <div className="amore__map-sub">Klik untuk buka Google Maps</div>
        </a>
        <div className="amore__address">
          {data.venue.address.split('\n').map((line, i) => (
            <span key={i}>{line}{i < data.venue.address.split('\n').length - 1 && <br />}</span>
          ))}
        </div>
      </div>

      <Divider />

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

      {/* ── RSVP ── */}
      <div className="amore__rsvp">
        <SectionLabel>Konfirmasi Kehadiran</SectionLabel>
        <div className="amore__rsvp-intro">
          Mohon konfirmasi kehadiran Anda paling lambat {data.rsvpDeadline} agar kami
          dapat mempersiapkan dengan sebaik-baiknya.
        </div>
        <RsvpForm deadline={data.rsvpDeadline} />
      </div>

      <Divider />

      {/* ── GUESTBOOK ── */}
      <GuestBook initialEntries={data.comments.length > 0 ? data.comments : INITIAL_ENTRIES} />

      {/* ── FOOTER ── */}
      <div className="amore__footer">
        <div className="amore__footer-quote">
          "Cinta bukan tentang berapa lama kamu menunggu,<br />
          tapi tentang siapa yang membuatmu bahagia."
        </div>
        <div className="amore__footer-brand">Made with invitee.site</div>
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