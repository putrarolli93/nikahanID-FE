import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import './Heartily.css';

// Flower assets - anthurium PNG with transparent background
const FLOWER_1 = '/images/heartily_flower_1.png'; // flowers hang from top — use for top corners
const FLOWER_2 = '/images/heartily_flower_2.png'; // leaf up, flowers below — use for bottom corners

// Fallback photos
import bride1 from '../amore/photos/bride_1.jpg';
import bride2 from '../amore/photos/bride_2.jpg';
import gallery1 from '../amore/photos/gallery_1.jpg';
import gallery2 from '../amore/photos/gallery_2.jpg';
import gallery3 from '../amore/photos/gallery_3.jpg';
import gallery4 from '../amore/photos/gallery_4.jpg';

const MOCK_DATA = {
  bride_groom: [
    { type: 'groom', full_name: 'Ahmad Maulana Putra', nickname: 'Ahmad', father_name: 'Budi Santoso', mother_name: 'Sri Wahyuni', photo_url: bride1 },
    { type: 'bride', full_name: 'Siti Aminah Rahayu', nickname: 'Siti', father_name: 'Joko Purnomo', mother_name: 'Rina Astuti', photo_url: bride2 },
  ],
  schedules: [
    { event_name: 'Akad Nikah', event_date: '2026-12-20', start_time: '08:00', end_time: '10:00', event_address: 'Masjid Agung Al-Azhar, Jl. Sisingamangaraja, Jakarta', google_map_link: 'https://maps.google.com/?q=Monumen+Nasional+Jakarta' },
    { event_name: 'Resepsi', event_date: '2026-12-20', start_time: '11:00', end_time: '15:00', event_address: 'Balai Kartini, Jl. Gatot Subroto No.37, Jakarta', google_map_link: 'https://maps.google.com/?q=Monumen+Nasional+Jakarta' },
  ],
  blessings: [
    { type: 'prayer', content: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.', source: 'QS. Ar-Rum: 21' }
  ],
  quote: {
    content: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.',
    source: 'QS. Ar-Rum: 21'
  },
  footer_quote: {
    content: 'Cinta sejati tidak pernah memiliki akhir yang bahagia, karena cinta sejati tidak pernah berakhir.',
    source: ''
  },
  blessing: {
    content: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.'
  },
  galleries: [
    { photo_url: gallery1 }, { photo_url: gallery2 }, { photo_url: gallery3 }, { photo_url: gallery4 }
  ],
  comments: [
    { guest_name: 'Budi Santoso', will_attend: 1, message: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah mawaddah warahmah.' },
    { guest_name: 'Rina Astuti', will_attend: 1, message: 'Barakallahu lakuma wa baraka alaikuma.' },
  ],
  music: {
    url: '/music/default.mp3',
    title: 'Cinta Tanpa Kata',
    artist: 'pingwinkutub'
  },
  gifts: [
    {
      type: 'bank',
      bank_name: 'BCA',
      account_number: '8290381482',
      account_name: 'Ahmad'
    }
  ]
};

// FlowerCorner: renders single clean corner-snug flower cluster
function FlowerCorner({ src, position }) {
  return (
    <div className={`heartily-flower flower-${position}`}>
      <img src={src} alt="" />
    </div>
  );
}

// Butterfly: pure SVG with fluttering wings animation
function Butterfly({ className }) {
  return (
    <svg className={`heartily-butterfly ${className}`} viewBox="0 0 100 100">
      <g className="wing-left">
        <path d="M50,50 C30,20 5,30 10,60 C12,72 32,75 50,55" fill="#f8c3cd" opacity="0.85" />
        <path d="M50,50 C35,35 15,40 18,60 C20,68 35,70 50,55" fill="#e27c95" />
      </g>
      <g className="wing-right">
        <path d="M50,50 C70,20 95,30 90,60 C88,72 68,75 50,55" fill="#f8c3cd" opacity="0.85" />
        <path d="M50,50 C65,35 85,40 82,60 C80,68 65,70 50,55" fill="#e27c95" />
      </g>
      <path d="M50,35 L50,65" stroke="#7a3050" strokeWidth="3" strokeLinecap="round" />
      <path d="M50,35 Q45,20 35,15" stroke="#7a3050" strokeWidth="1.5" fill="none" />
      <path d="M50,35 Q55,20 65,15" stroke="#7a3050" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// Countdown component for Heartily Template
function HeartilyCountdown({ targetISO, isMini = false }) {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    if (!targetISO) return;
    const tick = () => {
      const diff = new Date(targetISO) - new Date();
      if (diff <= 0) {
        setTime({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }
      
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setTime({
        d: d < 10 ? `0${d}` : String(d),
        h: h < 10 ? `0${h}` : String(h),
        m: m < 10 ? `0${m}` : String(m),
        s: s < 10 ? `0${s}` : String(s)
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  const items = [
    { num: time.d, label: 'Hari' },
    { num: time.h, label: 'Jam' },
    { num: time.m, label: 'Menit' },
    { num: time.s, label: 'Detik' }
  ];

  return (
    <div className={`heartily-countdown ${isMini ? 'heartily-countdown-mini' : ''}`}>
      {items.map(({ num, label }, i) => (
        <div key={i} className="heartily-countdown-item">
          <div className="heartily-countdown-num">{num}</div>
          <div className="heartily-countdown-label">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function HeartilyTemplate({ isPreview = false }) {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to') || 'Tamu Undangan';

  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpForm, setRsvpForm] = useState({ guest_name: '', attendance_status: 'ya', message: '' });
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  
  // Section refs for direct scrolling and navigation
  const heroRef = useRef(null);
  const coupleRef = useRef(null);
  const scheduleRef = useRef(null);
  const galleryRef = useRef(null);
  const rsvpRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('hero');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const observerRef = useRef(null);

  // Desktop slider carousel transition timer
  useEffect(() => {
    const list = data?.moments || data?.galleries || [];
    if (list.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % list.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [data]);

  // Lock body scroll when opening cover screen is active
  useEffect(() => {
    if (!isOpen) {
      document.body.classList.add('heartily-locked');
    } else {
      document.body.classList.remove('heartily-locked');
    }
    return () => {
      document.body.classList.remove('heartily-locked');
    };
  }, [isOpen]);

  // Clean up audio player on component unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  const fetchInvitation = () => {
    if (isPreview || !slug || slug === 'preview') {
      setData(MOCK_DATA);
      setLoading(false);
      return;
    }
    fetch(`/api/invitations/${slug}`)
      .then(r => r.json())
      .then(d => { setData(d.data || d); setLoading(false); })
      .catch(() => { setData(MOCK_DATA); setLoading(false); });
  };

  useEffect(() => {
    fetchInvitation();
  }, [slug, isPreview]);

  // Scroll reveal observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.heartily-reveal').forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [data]);

  // Scroll listener to update active bottom tab based on scroll position
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      
      if (rsvpRef.current && scrollPos >= rsvpRef.current.offsetTop) {
        setActiveTab('rsvp');
      } else if (galleryRef.current && scrollPos >= galleryRef.current.offsetTop) {
        setActiveTab('gallery');
      } else if (scheduleRef.current && scrollPos >= scheduleRef.current.offsetTop) {
        setActiveTab('schedule');
      } else if (coupleRef.current && scrollPos >= coupleRef.current.offsetTop) {
        setActiveTab('couple');
      } else {
        setActiveTab('hero');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    if (data?.music?.url) {
      const player = new Audio(data.music.url);
      player.loop = true;
      player.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Audio blocked by browser autoplay settings", err));
      setAudio(player);
    }
  };

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Audio resume blocked", err));
    }
  };

  const scrollToSection = (section) => {
    let ref;
    if (section === 'hero') ref = heroRef;
    if (section === 'couple') ref = coupleRef;
    if (section === 'schedule') ref = scheduleRef;
    if (section === 'gallery') ref = galleryRef;
    if (section === 'rsvp') ref = rsvpRef;
    
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveTab(section);
    }
  };

  const handleRsvp = async (e) => {
    e.preventDefault();
    if (!rsvpForm.guest_name.trim()) return;
    setSubmitting(true);
    try {
      let willAttendVal = 1;
      if (rsvpForm.attendance_status === 'tidak') willAttendVal = 0;
      else if (rsvpForm.attendance_status === 'mungkin') willAttendVal = null;

      const response = await fetch(`/api/invitations/${data.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: rsvpForm.guest_name,
          will_attend: willAttendVal,
          jumlah_tamu: 1,
          message: rsvpForm.message
        }),
      });

      if (response.ok) {
        setRsvpSuccess(true);
        fetchInvitation();
      } else {
        alert('Gagal mengirim ucapan');
      }
    } catch (err) {
      console.error(err);
      setRsvpSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#c47a8a' }}>Loading...</div>;
  if (!data) return null;

  const groom = data.bride_groom?.find(p => p.type === 'groom') || {};
  const bride = data.bride_groom?.find(p => p.type === 'bride') || {};
  const akad = data.schedules?.find(s => s.event_name === 'Akad Nikah');
  const resepsi = data.schedules?.find(s => s.event_name === 'Resepsi');
  const displayQuote = data.quote || (data.quotes && data.quotes.length > 0 ? data.quotes[0] : null) || data.blessings?.find(b => b.type === 'prayer') || {
    content: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.",
    source: "QS. Ar-Rum: 21"
  };
  const displayFooterQuote = data.footer_quote || data.blessings?.find(b => b.type === 'footer_quote') || (data.quotes && data.quotes.length > 1 ? data.quotes[1] : null) || {
    content: "Cinta sejati tidak pernah memiliki akhir yang bahagia, karena cinta sejati tidak pernah berakhir.",
    source: ""
  };
  const displayBlessing = data.blessing || data.blessings?.find(b => b.type === 'prayer') || (data.blessings && data.blessings.length > 0 ? data.blessings[0] : null) || {
    content: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami."
  };
  const galleries = data.moments || data.galleries || [];
  const comments = data.comments || [];

  const getEventIsoString = (schedule) => {
    if (!schedule || !schedule.event_date) return null;
    const datePart = schedule.event_date.split("T")[0];
    const timePart = schedule.start_time ? schedule.start_time : "08:00:00";
    return `${datePart}T${timePart}`;
  };
  
  const countdownTarget = akad ? getEventIsoString(akad) : null;
  const resepsiTarget = resepsi ? getEventIsoString(resepsi) : null;

  // Normalize gifts from API or MOCK_DATA
  const normalizedGifts = [];
  const rawGifts = data.gifts || [];
  rawGifts.forEach(gift => {
    if (gift.type) {
      normalizedGifts.push(gift);
    } else {
      if (gift.bank_accounts) {
        gift.bank_accounts.forEach(bank => {
          normalizedGifts.push({
            type: 'bank',
            bank_name: bank.bank_name,
            account_number: bank.account_number,
            account_name: bank.account_holder
          });
        });
      }
      if (gift.shipping_address) {
        normalizedGifts.push({
          type: 'address',
          recipient_name: 'Penerima Hadiah',
          address: gift.shipping_address
        });
      }
    }
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="heartily-lock">
      
      {/* Desktop Left Side Image Slider */}
      <div className="heartily-desktop-slider">
        {galleries.map((img, index) => (
          <div
            key={index}
            className={`heartily-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img.photo_url || img})` }}
          />
        ))}
        <div className="heartily-slider-overlay">
          <div className="heartily-slider-content">
            <span className="heartily-slider-tag">The Wedding Of</span>
            <h1 className="heartily-slider-title">{groom.nickname || 'Groom'} & {bride.nickname || 'Bride'}</h1>
            <div className="heartily-slider-divider" />
            {akad && <p className="heartily-slider-date">{formatDate(akad.event_date)}</p>}
          </div>
        </div>
      </div>

      <div className="heartily-template">

        {/* ── OPENING SCREEN ── */}
        <div className={`heartily-opening ${isOpen ? 'hidden' : ''}`}>
          <img src={FLOWER_1} alt="" className="heartily-opening-flower-tl" />
          <img src={FLOWER_1} alt="" className="heartily-opening-flower-tr" />
          <img src={FLOWER_2} alt="" className="heartily-opening-flower-br" />

          <div className="heartily-opening-label">Wedding Invitation</div>
          <h1 className="heartily-opening-names">{groom.nickname || 'Groom'}</h1>
          <div className="heartily-opening-amp">&</div>
          <h1 className="heartily-opening-names">{bride.nickname || 'Bride'}</h1>
          
          {/* Rapiin: Di bawah nama hanya ada divider tipis elegan, tidak menumpuk gambar bunga */}
          <div className="heartily-divider" />
          {akad && <div className="heartily-opening-date">{formatDate(akad.event_date)}</div>}
          <div className="heartily-opening-invite-text">Tanpa Mengurangi Rasa Hormat,<br />Kami Mengundang Bapak/Ibu/Saudara/i:</div>
          <div className="heartily-opening-guest"><strong>{guestName}</strong></div>
          <div className="heartily-opening-apology">*Mohon maaf apabila ada kesalahan penulisan nama/gelar</div>
          <button className="heartily-btn-open" onClick={handleOpen}>Buka Undangan</button>
        </div>

        {/* ── INNER CONTENT ── */}
        <div className="heartily-inner">

          {/* ── HERO ── */}
          <section ref={heroRef} className="heartily-section section-hero heartily-reveal">
            <FlowerCorner src={FLOWER_1} position="tl" />
            <FlowerCorner src={FLOWER_1} position="tr" />
            
            {/* Fluttering butterflies inside Hero section */}
            <Butterfly className="bf-1" />
            <Butterfly className="bf-2" />

            <div className="heartily-hero-tag">The Wedding Of</div>
            <div className="heartily-hero-photo-wrapper">
              <div className="heartily-hero-photo-ring" />
              <img
                src={galleries[0]?.photo_url || gallery1}
                alt="Couple"
                className="heartily-hero-photo"
              />
            </div>
            <h1 className="heartily-hero-names">
              {groom.nickname || 'Groom'}
              <span className="heartily-hero-amp">&</span>
              {bride.nickname || 'Bride'}
            </h1>
            {akad && <div className="heartily-hero-date">{formatDate(akad.event_date)}</div>}
            {displayQuote && (
              <>
                <div className="heartily-divider" />
                <p className="heartily-verse">"{displayQuote.content || displayQuote}"</p>
                {displayQuote.source && <div style={{ fontSize: '0.72rem', color: '#c47a8a', marginTop: 8, letterSpacing: 1 }}>{displayQuote.source}</div>}
              </>
            )}
          </section>

          {/* ── COUPLE ── */}
          <section ref={coupleRef} className="heartily-section section-couple heartily-reveal">
            <FlowerCorner src={FLOWER_1} position="tr" />
            <FlowerCorner src={FLOWER_2} position="bl" />
            
            {/* Fluttering butterflies inside Couple section */}
            <Butterfly className="bf-3" />
            <Butterfly className="bf-4" />

            <div className="heartily-section-label">Mempelai</div>
            <h2 className="heartily-section-title">Dua Hati Bersatu</h2>
            <div className="heartily-divider" />

            {displayBlessing && (
              <p style={{ fontSize: '0.85rem', color: '#9a6070', maxWidth: '320px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                {displayBlessing.content || displayBlessing}
              </p>
            )}

            <div className="heartily-couple-grid">
              <div className="heartily-person">
                <img src={groom.photo_url || bride1} alt={groom.full_name} className="heartily-person-photo" />
                <div className="heartily-person-name">{groom.nickname || 'Groom'}</div>
                <div className="heartily-person-fullname">{groom.full_name}</div>
                <div className="heartily-person-parents">
                  Putra dari Bpk. {groom.father_name}<br />& Ibu {groom.mother_name}
                </div>
              </div>
              <div className="heartily-couple-and">&</div>
              <div className="heartily-person">
                <img src={bride.photo_url || bride2} alt={bride.full_name} className="heartily-person-photo" />
                <div className="heartily-person-name">{bride.nickname || 'Bride'}</div>
                <div className="heartily-person-fullname">{bride.full_name}</div>
                <div className="heartily-person-parents">
                  Putri dari Bpk. {bride.father_name}<br />& Ibu {bride.mother_name}
                </div>
              </div>
            </div>
          </section>

          {/* ── SCHEDULE ── */}
          <section ref={scheduleRef} className="heartily-section section-schedule heartily-reveal">
            <FlowerCorner src={FLOWER_1} position="tl" />
            <FlowerCorner src={FLOWER_2} position="br" />
            
            {/* Fluttering butterflies inside Schedule section */}
            <Butterfly className="bf-5" />
            <Butterfly className="bf-6" />

            <div className="heartily-section-label">Jadwal</div>
            <h2 className="heartily-section-title">Acara Pernikahan</h2>
            <div className="heartily-divider" />

            {akad && (
              <div className="heartily-event-card">
                <div className="heartily-event-name">Akad Nikah</div>
                {countdownTarget && <HeartilyCountdown targetISO={countdownTarget} isMini={true} />}
                <div className="heartily-event-row"><span className="heartily-event-icon">📅</span>{formatDate(akad.event_date)}</div>
                <div className="heartily-event-row"><span className="heartily-event-icon">⏰</span>{akad.start_time} – {akad.end_time || 'Selesai'}</div>
                <div className="heartily-event-row"><span className="heartily-event-icon">📍</span>{akad.event_address}</div>
                {akad.google_map_link && <a href={akad.google_map_link} target="_blank" rel="noreferrer" className="heartily-maps-btn">🗺 Lihat Peta</a>}
              </div>
            )}
            {resepsi && (
              <div className="heartily-event-card">
                <div className="heartily-event-name">Resepsi</div>
                {resepsiTarget && <HeartilyCountdown targetISO={resepsiTarget} isMini={true} />}
                <div className="heartily-event-row"><span className="heartily-event-icon">📅</span>{formatDate(resepsi.event_date)}</div>
                <div className="heartily-event-row"><span className="heartily-event-icon">⏰</span>{resepsi.start_time} – {resepsi.end_time || 'Selesai'}</div>
                <div className="heartily-event-row"><span className="heartily-event-icon">📍</span>{resepsi.event_address}</div>
                {resepsi.google_map_link && <a href={resepsi.google_map_link} target="_blank" rel="noreferrer" className="heartily-maps-btn">🗺 Lihat Peta</a>}
              </div>
            )}
          </section>

          {/* ── GALLERY ── */}
          {galleries.length > 0 && (
            <section ref={galleryRef} className="heartily-section section-gallery heartily-reveal">
              <FlowerCorner src={FLOWER_1} position="tr" />
              <FlowerCorner src={FLOWER_2} position="bl" />

              <div className="heartily-section-label">Galeri</div>
              <h2 className="heartily-section-title">Momen Berharga</h2>
              <div className="heartily-divider" />

              <div className="heartily-gallery">
                {galleries.map((item, i) => (
                  <div key={i} className="heartily-gallery-item" onClick={() => setActivePhoto(item.photo_url || item)}>
                    <img src={item.photo_url || item} alt={`Foto ${i + 1}`} loading="lazy" style={{ cursor: 'zoom-in' }} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── GIFTS ── */}
          {normalizedGifts.length > 0 && (
            <section className="heartily-section section-gifts heartily-reveal">
              <FlowerCorner src={FLOWER_1} position="tr" />
              <FlowerCorner src={FLOWER_2} position="bl" />
              
              <div className="heartily-section-label">Hadiah</div>
              <h2 className="heartily-section-title">Kado Digital</h2>
              <div className="heartily-divider" />
              
              <p style={{ fontSize: '0.85rem', color: '#9a6070', maxWidth: '320px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                Bagi Bapak/Ibu/Saudara/i yang ingin mengirimkan kado digital, dapat mentransfer melalui rekening atau alamat di bawah ini:
              </p>
              
              <div className="heartily-gifts-list">
                {normalizedGifts.map((gift, idx) => (
                  <div key={idx} className="heartily-gift-card">
                    {gift.type === 'bank' ? (
                      <div className="gift-bank-content">
                        <div className="gift-bank-badge">{gift.bank_name}</div>
                        <div className="gift-account-number">{gift.account_number}</div>
                        <div className="gift-account-name">a.n. {gift.account_name}</div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(gift.account_number);
                            alert('Nomor rekening berhasil disalin! 💕');
                          }}
                          className="heartily-copy-btn"
                        >
                          📋 Salin Nomor Rekening
                        </button>
                      </div>
                    ) : (
                      <div className="gift-address-content">
                        <div className="gift-address-badge">Kirim Hadiah</div>
                        <div className="gift-recipient-name">{gift.recipient_name}</div>
                        <div className="gift-address-text">{gift.address}</div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(gift.address);
                            alert('Alamat pengiriman berhasil disalin! 💕');
                          }}
                          className="heartily-copy-btn"
                        >
                          📋 Salin Alamat
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── RSVP ── */}
          <section ref={rsvpRef} className="heartily-section section-rsvp heartily-reveal">
            <FlowerCorner src={FLOWER_1} position="tl" />
            <FlowerCorner src={FLOWER_2} position="br" />
            
            {/* Additional butterflies in RSVP section */}
            <Butterfly className="bf-1" />
            <Butterfly className="bf-4" />

            <div className="heartily-section-label">Konfirmasi</div>
            <h2 className="heartily-section-title">Ucapan & Doa</h2>
            <div className="heartily-divider" />

            {rsvpSuccess ? (
              <div className="heartily-success">
                💕 Terima kasih atas ucapan dan konfirmasi kehadiranmu!
              </div>
            ) : (
              <form className="heartily-rsvp-form" onSubmit={handleRsvp}>
                <input
                  className="heartily-input"
                  type="text"
                  placeholder="Nama Anda"
                  value={rsvpForm.guest_name}
                  onChange={e => setRsvpForm({ ...rsvpForm, guest_name: e.target.value })}
                  required
                />
                <select
                  className="heartily-select"
                  value={rsvpForm.attendance_status}
                  onChange={e => setRsvpForm({ ...rsvpForm, attendance_status: e.target.value })}
                >
                  <option value="ya">✅ Ya, saya akan hadir</option>
                  <option value="tidak">❌ Maaf, tidak bisa hadir</option>
                  <option value="mungkin">🤔 Mungkin hadir</option>
                </select>
                <textarea
                  className="heartily-textarea"
                  rows={4}
                  placeholder="Tuliskan ucapan & doa untuk kedua mempelai..."
                  value={rsvpForm.message}
                  onChange={e => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                />
                <button type="submit" className="heartily-submit-btn" disabled={submitting}>
                  {submitting ? 'Mengirim...' : 'Kirim Ucapan 💕'}
                </button>
              </form>
            )}

            {comments.length > 0 && (
              <div className="heartily-comments">
                {comments.map((c, i) => (
                  <div key={i} className="heartily-comment-card">
                    <div className="heartily-comment-name">{c.guest_name}</div>
                    <span className={`heartily-comment-badge ${c.will_attend === 1 ? 'badge-hadir' : c.will_attend === 0 ? 'badge-tidak' : 'badge-mungkin'}`}>
                      {c.will_attend === 1 ? '✓ Hadir' : c.will_attend === 0 ? '✕ Tidak Hadir' : '? Mungkin'}
                    </span>
                    <div className="heartily-comment-text">{c.message}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── FOOTER ── */}
          <footer className="heartily-footer">
            <div className="heartily-divider" />
            
            {displayFooterQuote && (
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#9a6070', margin: '0 auto 20px', maxWidth: '300px', lineHeight: '1.6' }}>
                "{displayFooterQuote.content || displayFooterQuote}"
              </p>
            )}

            <div className="heartily-opening-names" style={{ fontSize: '1.8rem', margin: '20px 0 6px' }}>
              {groom.nickname} & {bride.nickname}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#c47a8a', letterSpacing: 2, marginBottom: 20 }}>
              {akad ? formatDate(akad.event_date) : ''}
            </div>
            <div className="heartily-footer-brand">
              Dibuat dengan ❤️ oleh <a href="/">datangya.site</a>
            </div>
          </footer>

        </div>

        {/* Lightbox Zoom Modal */}
        {activePhoto && (
          <div className="heartily-lightbox" onClick={() => setActivePhoto(null)}>
            <button className="heartily-lightbox-close" onClick={() => setActivePhoto(null)}>&times;</button>
            <img src={activePhoto} alt="Zoomed gallery item" />
          </div>
        )}

        {/* Sticky Bottom Tab Navigation (Glassmorphism layout) */}
        {isOpen && (
          <div className="heartily-bottom-nav">
            <button className={`nav-item ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => scrollToSection('hero')}>
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Home</span>
            </button>
            <button className={`nav-item ${activeTab === 'couple' ? 'active' : ''}`} onClick={() => scrollToSection('couple')}>
              <span className="nav-icon">👥</span>
              <span className="nav-text">Mempelai</span>
            </button>
            <button className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => scrollToSection('schedule')}>
              <span className="nav-icon">📅</span>
              <span className="nav-text">Acara</span>
            </button>
            {galleries.length > 0 && (
              <button className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => scrollToSection('gallery')}>
                <span className="nav-icon">🖼️</span>
                <span className="nav-text">Galeri</span>
              </button>
            )}
            <button className={`nav-item ${activeTab === 'rsvp' ? 'active' : ''}`} onClick={() => scrollToSection('rsvp')}>
              <span className="nav-icon">✍️</span>
              <span className="nav-text">RSVP</span>
            </button>
          </div>
        )}

        {/* Floating Glassmorphism Audio Controller Button */}
        {isOpen && audio && (
          <button 
            className={`heartily-audio-toggle ${isPlaying ? 'playing' : ''}`} 
            onClick={togglePlay}
            title={isPlaying ? "Mute Music" : "Play Music"}
          >
            {isPlaying ? '🎵' : '🔇'}
          </button>
        )}

        {/* Hidden SVG for responsive clipPath masks */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0.5, 0.28 C 0.4, 0.05, 0.08, 0.05, 0.08, 0.4 C 0.08, 0.7, 0.5, 0.92, 0.5, 0.97 C 0.5, 0.92, 0.92, 0.7, 0.92, 0.4 C 0.92, 0.05, 0.6, 0.05, 0.5, 0.28 Z" />
            </clipPath>
          </defs>
        </svg>

      </div>
    </div>
  );
}
