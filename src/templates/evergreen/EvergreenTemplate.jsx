import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import './Evergreen.css';

// Flower assets - anthurium PNG with transparent background
const LEAF_1 = '/images/evergreen_leaf_1.png'; // flowers hang from top — use for top corners
const LEAF_2 = '/images/evergreen_leaf_2.png'; // leaf up, flowers below — use for bottom corners

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

// LeafCorner: renders single clean corner-snug flower cluster
function LeafCorner({ src, position }) {
  return (
    <div className={`evergreen-flower flower-${position}`}>
      <img src={src} alt="" />
    </div>
  );
}

// Bird: pure SVG with flapping wings animation (from bird.svg)
function Bird({ className }) {
  return (
    <svg className={`evergreen-bird ${className}`} viewBox="0 0 100 100">
      <g fill="none" stroke="#2d5a27" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 10 50 Q 50 20 50 50 Q 50 20 90 50">
          <animate attributeName="d" values="
            M 10 50 Q 50 20 50 50 Q 50 20 90 50;
            M 10 30 Q 50 60 50 50 Q 50 60 90 30;
            M 10 70 Q 50 30 50 50 Q 50 30 90 70;
            M 10 50 Q 50 20 50 50 Q 50 20 90 50"
            dur="0.4s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}

export default function EvergreenTemplate({ isPreview = false }) {
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
    if (!data?.galleries || data.galleries.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % data.galleries.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [data]);

  // Lock body scroll when opening cover screen is active
  useEffect(() => {
    if (!isOpen) {
      document.body.classList.add('evergreen-locked');
    } else {
      document.body.classList.remove('evergreen-locked');
    }
    return () => {
      document.body.classList.remove('evergreen-locked');
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

  useEffect(() => {
    if (isPreview || !slug || slug === 'preview') {
      setData(MOCK_DATA);
      setLoading(false);
      return;
    }
    fetch(`/api/invitations/${slug}`)
      .then(r => r.json())
      .then(d => { setData(d.data || d); setLoading(false); })
      .catch(() => { setData(MOCK_DATA); setLoading(false); });
  }, [slug, isPreview]);

  // Scroll reveal observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.evergreen-reveal').forEach(el => observerRef.current?.observe(el));
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
      await fetch(`/api/invitations/${slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpForm),
      });
      setRsvpSuccess(true);
    } catch {
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
  const displayQuote = data.quote || (data.quotes && data.quotes.length > 0 ? data.quotes[0] : null) || data.blessings?.find(b => b.type === 'prayer');
  const displayFooterQuote = data.footer_quote || (data.quotes && data.quotes.length > 1 ? data.quotes[1] : null);
  const displayBlessing = data.blessing || (data.blessings && data.blessings.length > 0 ? data.blessings[0] : null);
  const galleries = data.galleries || [];
  const comments = data.comments || [];

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
    <div className="evergreen-lock">

      {/* Desktop Left Side Image Slider */}
      <div className="evergreen-desktop-slider">
        {galleries.map((img, index) => (
          <div
            key={index}
            className={`evergreen-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img.photo_url || img})` }}
          />
        ))}
        <div className="evergreen-slider-overlay">
          <div className="evergreen-slider-content">
            <span className="evergreen-slider-tag">The Wedding Of</span>
            <h1 className="evergreen-slider-title">{groom.nickname || 'Groom'} & {bride.nickname || 'Bride'}</h1>
            <div className="evergreen-slider-divider" />
            {akad && <p className="evergreen-slider-date">{formatDate(akad.event_date)}</p>}
          </div>
        </div>
      </div>

      <div className="evergreen-template">

        {/* ── OPENING SCREEN ── */}
        <div className={`evergreen-opening ${isOpen ? 'hidden' : ''}`}>
          <img src={LEAF_1} alt="" className="evergreen-opening-flower-tl" />
          <img src={LEAF_1} alt="" className="evergreen-opening-flower-tr" />
          <img src={LEAF_2} alt="" className="evergreen-opening-flower-br" />

          <div className="evergreen-opening-label">Wedding Invitation</div>
          <h1 className="evergreen-opening-names">{groom.nickname || 'Groom'}</h1>
          <div className="evergreen-opening-amp">&</div>
          <h1 className="evergreen-opening-names">{bride.nickname || 'Bride'}</h1>

          {/* Rapiin: Di bawah nama hanya ada divider tipis elegan, tidak menumpuk gambar bunga */}
          <div className="evergreen-divider" />
          {akad && <div className="evergreen-opening-date">{formatDate(akad.event_date)}</div>}
          <div className="evergreen-opening-invite-text">Tanpa Mengurangi Rasa Hormat,<br />Kami Mengundang Bapak/Ibu/Saudara/i:</div>
          <div className="evergreen-opening-guest"><strong>{guestName}</strong></div>
          <div className="evergreen-opening-apology">*Mohon maaf apabila ada kesalahan penulisan nama/gelar</div>
          <button className="evergreen-btn-open" onClick={handleOpen}>Buka Undangan</button>
        </div>

        {/* ── INNER CONTENT ── */}
        <div className="evergreen-inner">

          {/* ── HERO ── */}
          <section ref={heroRef} className="evergreen-section section-hero evergreen-reveal">
            <LeafCorner src={LEAF_1} position="tl" />
            <LeafCorner src={LEAF_1} position="tr" />

            {/* Fluttering butterflies inside Hero section */}
            <Bird className="bf-1" />
            <Bird className="bf-2" />

            <div className="evergreen-hero-tag">The Wedding Of</div>
            <div className="evergreen-hero-photo-wrapper">
              <div className="evergreen-hero-photo-ring" />
              <img
                src={galleries[0]?.photo_url || gallery1}
                alt="Couple"
                className="evergreen-hero-photo"
              />
            </div>
            <h1 className="evergreen-hero-names">
              {groom.nickname || 'Groom'}
              <span className="evergreen-hero-amp">&</span>
              {bride.nickname || 'Bride'}
            </h1>
            {akad && <div className="evergreen-hero-date">{formatDate(akad.event_date)}</div>}
            {displayQuote && (
              <>
                <div className="evergreen-divider" />
                <p className="evergreen-verse">"{displayQuote.content}"</p>
                {displayQuote.source && <div style={{ fontSize: '0.72rem', color: '#c47a8a', marginTop: 8, letterSpacing: 1 }}>{displayQuote.source}</div>}
              </>
            )}
          </section>

          {/* ── COUPLE ── */}
          <section ref={coupleRef} className="evergreen-section section-couple evergreen-reveal">
            <LeafCorner src={LEAF_1} position="tr" />
            <LeafCorner src={LEAF_2} position="bl" />

            {/* Fluttering butterflies inside Couple section */}
            <Bird className="bf-3" />
            <Bird className="bf-4" />

            <div className="evergreen-section-label">Mempelai</div>
            <h2 className="evergreen-section-title">Dua Hati Bersatu</h2>
            <div className="evergreen-divider" />

            {displayBlessing && (
              <p style={{ fontSize: '0.85rem', color: '#9a6070', maxWidth: '320px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                {displayBlessing.content}
              </p>
            )}

            <div className="evergreen-couple-grid">
              <div className="evergreen-person">
                <img src={groom.photo_url || bride1} alt={groom.full_name} className="evergreen-person-photo" />
                <div className="evergreen-person-name">{groom.nickname || 'Groom'}</div>
                <div className="evergreen-person-fullname">{groom.full_name}</div>
                <div className="evergreen-person-parents">
                  Putra dari Bpk. {groom.father_name}<br />& Ibu {groom.mother_name}
                </div>
              </div>
              <div className="evergreen-couple-and">&</div>
              <div className="evergreen-person">
                <img src={bride.photo_url || bride2} alt={bride.full_name} className="evergreen-person-photo" />
                <div className="evergreen-person-name">{bride.nickname || 'Bride'}</div>
                <div className="evergreen-person-fullname">{bride.full_name}</div>
                <div className="evergreen-person-parents">
                  Putri dari Bpk. {bride.father_name}<br />& Ibu {bride.mother_name}
                </div>
              </div>
            </div>
          </section>

          {/* ── SCHEDULE ── */}
          <section ref={scheduleRef} className="evergreen-section section-schedule evergreen-reveal">
            <LeafCorner src={LEAF_1} position="tl" />
            <LeafCorner src={LEAF_2} position="br" />

            {/* Fluttering butterflies inside Schedule section */}
            <Bird className="bf-5" />
            <Bird className="bf-6" />

            <div className="evergreen-section-label">Jadwal</div>
            <h2 className="evergreen-section-title">Acara Pernikahan</h2>
            <div className="evergreen-divider" />

            {akad && (
              <div className="evergreen-event-card">
                <div className="evergreen-event-name">Akad Nikah</div>
                <div className="evergreen-event-row"><span className="evergreen-event-icon">📅</span>{formatDate(akad.event_date)}</div>
                <div className="evergreen-event-row"><span className="evergreen-event-icon">⏰</span>{akad.start_time} – {akad.end_time || 'Selesai'}</div>
                <div className="evergreen-event-row"><span className="evergreen-event-icon">📍</span>{akad.event_address}</div>
                {akad.google_map_link && <a href={akad.google_map_link} target="_blank" rel="noreferrer" className="evergreen-maps-btn">🗺 Lihat Peta</a>}
              </div>
            )}
            {resepsi && (
              <div className="evergreen-event-card">
                <div className="evergreen-event-name">Resepsi</div>
                <div className="evergreen-event-row"><span className="evergreen-event-icon">📅</span>{formatDate(resepsi.event_date)}</div>
                <div className="evergreen-event-row"><span className="evergreen-event-icon">⏰</span>{resepsi.start_time} – {resepsi.end_time || 'Selesai'}</div>
                <div className="evergreen-event-row"><span className="evergreen-event-icon">📍</span>{resepsi.event_address}</div>
                {resepsi.google_map_link && <a href={resepsi.google_map_link} target="_blank" rel="noreferrer" className="evergreen-maps-btn">🗺 Lihat Peta</a>}
              </div>
            )}
          </section>

          {/* ── GALLERY ── */}
          {galleries.length > 0 && (
            <section ref={galleryRef} className="evergreen-section section-gallery evergreen-reveal">
              <LeafCorner src={LEAF_1} position="tr" />
              <LeafCorner src={LEAF_2} position="bl" />

              <div className="evergreen-section-label">Galeri</div>
              <h2 className="evergreen-section-title">Momen Berharga</h2>
              <div className="evergreen-divider" />

              <div className="evergreen-gallery">
                {galleries.map((item, i) => (
                  <div key={i} className="evergreen-gallery-item" onClick={() => setActivePhoto(item.photo_url || item)}>
                    <img src={item.photo_url || item} alt={`Foto ${i + 1}`} loading="lazy" style={{ cursor: 'zoom-in' }} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── GIFTS ── */}
          {normalizedGifts.length > 0 && (
            <section className="evergreen-section section-gifts evergreen-reveal">
              <LeafCorner src={LEAF_1} position="tr" />
              <LeafCorner src={LEAF_2} position="bl" />

              <div className="evergreen-section-label">Hadiah</div>
              <h2 className="evergreen-section-title">Kado Digital</h2>
              <div className="evergreen-divider" />

              <p style={{ fontSize: '0.85rem', color: '#9a6070', maxWidth: '320px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                Bagi Bapak/Ibu/Saudara/i yang ingin mengirimkan kado digital, dapat mentransfer melalui rekening atau alamat di bawah ini:
              </p>

              <div className="evergreen-gifts-list">
                {normalizedGifts.map((gift, idx) => (
                  <div key={idx} className="evergreen-gift-card">
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
                          className="evergreen-copy-btn"
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
                          className="evergreen-copy-btn"
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
          <section ref={rsvpRef} className="evergreen-section section-rsvp evergreen-reveal">
            <LeafCorner src={LEAF_1} position="tl" />
            <LeafCorner src={LEAF_2} position="br" />

            {/* Additional butterflies in RSVP section */}
            <Bird className="bf-1" />
            <Bird className="bf-4" />

            <div className="evergreen-section-label">Konfirmasi</div>
            <h2 className="evergreen-section-title">Ucapan & Doa</h2>
            <div className="evergreen-divider" />

            {rsvpSuccess ? (
              <div className="evergreen-success">
                💕 Terima kasih atas ucapan dan konfirmasi kehadiranmu!
              </div>
            ) : (
              <form className="evergreen-rsvp-form" onSubmit={handleRsvp}>
                <input
                  className="evergreen-input"
                  type="text"
                  placeholder="Nama Anda"
                  value={rsvpForm.guest_name}
                  onChange={e => setRsvpForm({ ...rsvpForm, guest_name: e.target.value })}
                  required
                />
                <select
                  className="evergreen-select"
                  value={rsvpForm.attendance_status}
                  onChange={e => setRsvpForm({ ...rsvpForm, attendance_status: e.target.value })}
                >
                  <option value="ya">✅ Ya, saya akan hadir</option>
                  <option value="tidak">❌ Maaf, tidak bisa hadir</option>
                  <option value="mungkin">🤔 Mungkin hadir</option>
                </select>
                <textarea
                  className="evergreen-textarea"
                  rows={4}
                  placeholder="Tuliskan ucapan & doa untuk kedua mempelai..."
                  value={rsvpForm.message}
                  onChange={e => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                />
                <button type="submit" className="evergreen-submit-btn" disabled={submitting}>
                  {submitting ? 'Mengirim...' : 'Kirim Ucapan 💕'}
                </button>
              </form>
            )}

            {comments.length > 0 && (
              <div className="evergreen-comments">
                {comments.map((c, i) => (
                  <div key={i} className="evergreen-comment-card">
                    <div className="evergreen-comment-name">{c.guest_name}</div>
                    <span className={`evergreen-comment-badge ${c.will_attend === 1 ? 'badge-hadir' : c.will_attend === 0 ? 'badge-tidak' : 'badge-mungkin'}`}>
                      {c.will_attend === 1 ? '✓ Hadir' : c.will_attend === 0 ? '✕ Tidak Hadir' : '? Mungkin'}
                    </span>
                    <div className="evergreen-comment-text">{c.message}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── FOOTER ── */}
          <footer className="evergreen-footer">
            <div className="evergreen-divider" />

            {displayFooterQuote && displayFooterQuote.content && (
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#9a6070', margin: '0 auto 20px', maxWidth: '300px', lineHeight: '1.6' }}>
                "{displayFooterQuote.content}"
              </p>
            )}

            <div className="evergreen-opening-names" style={{ fontSize: '1.8rem', margin: '20px 0 6px' }}>
              {groom.nickname} & {bride.nickname}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#c47a8a', letterSpacing: 2, marginBottom: 20 }}>
              {akad ? formatDate(akad.event_date) : ''}
            </div>
            <div className="evergreen-footer-brand">
              Dibuat dengan 💕 oleh <a href="/">nikahanID</a>
            </div>
          </footer>

        </div>

        {/* Lightbox Zoom Modal */}
        {activePhoto && (
          <div className="evergreen-lightbox" onClick={() => setActivePhoto(null)}>
            <button className="evergreen-lightbox-close" onClick={() => setActivePhoto(null)}>&times;</button>
            <img src={activePhoto} alt="Zoomed gallery item" />
          </div>
        )}

        {/* Sticky Bottom Tab Navigation (Glassmorphism layout) */}
        {isOpen && (
          <div className="evergreen-bottom-nav">
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
            className={`evergreen-audio-toggle ${isPlaying ? 'playing' : ''}`}
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
