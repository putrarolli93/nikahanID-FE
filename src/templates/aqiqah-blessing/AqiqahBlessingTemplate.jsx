// src/templates/aqiqah-blessing/AqiqahBlessingTemplate.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const [apiData, setApiData] = useState(null);
  const [invId, setInvId] = useState(null);
  const [wishes, setWishes] = useState([]);

  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttend, setRsvpAttend] = useState('1');
  const [rsvpMsg, setRsvpMsg] = useState('');

  const audioRef = useRef(null);

  // Fetch real invitation data by slug from backend API
  useEffect(() => {
    if (customData) return;
    if (!slug || slug === 'demo') return;

    fetch(`/api/invitations/${slug}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          const inv = res.data;
          setInvId(inv.id);

          const groom = inv.bride_groom?.find(p => p.type === 'groom') || inv.bride_groom?.[0] || {};
          const bride = inv.bride_groom?.find(p => p.type === 'bride') || inv.bride_groom?.[1] || {};

          const babyFullName = groom.full_name || inv.groom_name || inv.groomName || inv.title || 'Kahfi Khairan Alkautsar';
          
          let babyNickname = 'Kahfi';
          if (groom.nickname && groom.nickname !== babyFullName) {
            babyNickname = groom.nickname;
          } else if (bride.nickname && bride.nickname !== babyFullName) {
            babyNickname = bride.nickname;
          } else if (inv.bride_name && inv.bride_name !== babyFullName) {
            babyNickname = inv.bride_name;
          } else {
            babyNickname = babyFullName.trim().split(' ')[0];
          }

          const fatherName = groom.father_name || bride.father_name || inv.father_name || inv.fatherName || inv.groom_father_name || 'Putra';
          const motherName = groom.mother_name || bride.mother_name || inv.mother_name || inv.motherName || inv.groom_mother_name || 'Uswa';

          // SessionStorage backup fallbacks
          const cachedAkadStr = sessionStorage.getItem(`draft_akad_${slug}`);
          let cachedAkad = null;
          if (cachedAkadStr) {
            try { cachedAkad = JSON.parse(cachedAkadStr); } catch (e) {}
          }

          const cachedGiftStr = sessionStorage.getItem(`draft_gift_${slug}`);
          let cachedGift = null;
          if (cachedGiftStr) {
            try { cachedGift = JSON.parse(cachedGiftStr); } catch (e) {}
          }

          // Strictly 1 schedule for Aqiqah
          const rawSchedules = inv.schedules?.length > 0 ? inv.schedules.slice(0, 1) : [];
          let formattedSchedules = rawSchedules.map(s => {
            let eventName = s.event_name || 'Tasyakuran & Aqiqah';
            if (eventName === 'Akad Nikah' || eventName === 'Akad' || eventName.includes('Akad')) {
              eventName = 'Tasyakuran & Aqiqah';
            }

            const addr = s.event_address || s.address || s.location || inv.event_address || inv.address || inv.location || cachedAkad?.event_address || `Kediaman Bpk. ${fatherName}, Jakarta`;
            const maps = s.google_map_link || s.google_maps_link || s.maps_url || inv.google_map_link || inv.google_maps_link || inv.maps_url || cachedAkad?.google_map_link || 'https://maps.google.com/?q=Jakarta';

            return {
              event_name: eventName,
              event_date: s.event_date ? (s.event_date.includes('-') ? new Date(s.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : s.event_date) : (cachedAkad?.event_date || 'Minggu, 22 Februari 2026'),
              start_time: s.start_time || cachedAkad?.start_time || '09:00',
              end_time: s.end_time || '12:00 WIB',
              event_address: addr,
              google_map_link: maps,
            };
          });

          if (formattedSchedules.length === 0) {
            const addr = inv.event_address || inv.address || inv.location || cachedAkad?.event_address || `Kediaman Bpk. ${fatherName}, Jakarta`;
            const maps = inv.google_map_link || inv.google_maps_link || inv.maps_url || cachedAkad?.google_map_link || 'https://maps.google.com/?q=Jakarta';
            formattedSchedules = [{
              event_name: 'Tasyakuran & Aqiqah',
              event_date: cachedAkad?.event_date || 'Minggu, 22 Februari 2026',
              start_time: cachedAkad?.start_time || '09:00',
              end_time: '12:00 WIB',
              event_address: addr,
              google_map_link: maps,
            }];
          }

          const savedFooterQuote = inv.blessings?.find(b => b.type === 'footer_quote');
          const footerQuoteContent = savedFooterQuote?.content || `Kami Yang Berbahagia Keluarga Besar\nBpk. ${fatherName} & Ibu ${motherName}\nAtas kehadiran dan doa restunya kami ucapkan terima kasih`;

          const rawComments = inv.comments || inv.wishes || inv.guestbook || inv.rsvps || [];
          if (rawComments.length > 0) {
            setWishes(rawComments.map(c => ({
              name: c.guest_name || c.name || c.sender_name || 'Tamu',
              msg: c.message || c.msg || c.content || c.comment || ''
            })));
          }

          const galleryPhotos = inv.moments?.length > 0 ? inv.moments : DEFAULT_BABY_PHOTOS.map(url => ({ photo_url: url }));

          // Parsing Gifts & Accounts
          const giftObj = inv.gifts?.[0] || {};
          const giftTitle = giftObj.title || cachedGift?.title || "Hadiah & Amplop Digital";
          const giftMessage = giftObj.message || cachedGift?.message || "Bagi keluarga dan sahabat yang ingin memberikan kado / hadiah untuk buah hati kami, dapat disalurkan melalui rekening di bawah ini.";
          const shippingAddress = giftObj.shipping_address || cachedGift?.shipping_address || "";

          let bankList = [];
          if (giftObj.bank_accounts && giftObj.bank_accounts.length > 0) {
            bankList = giftObj.bank_accounts.map(b => ({
              bank_name: b.bank_name,
              account_number: b.account_number,
              account_name: b.account_holder || b.account_name
            }));
          } else if (inv.gifts && inv.gifts.length > 0) {
            bankList = inv.gifts.filter(g => g.bank_name).map(g => ({
              bank_name: g.bank_name,
              account_number: g.account_number,
              account_name: g.account_holder || g.account_name
            }));
          }

          if (bankList.length === 0 && cachedGift?.bank_accounts?.length > 0) {
            bankList = cachedGift.bank_accounts.map(b => ({
              bank_name: b.bank_name,
              account_number: b.account_number,
              account_name: b.account_holder || b.account_name
            }));
          }

          if (bankList.length === 0) {
            bankList = [
              { bank_name: 'BCA', account_number: '7820491823', account_name: fatherName }
            ];
          }

          const formatted = {
            id: inv.id,
            baby: {
              full_name: babyFullName,
              nickname: babyNickname,
              father_name: fatherName,
              mother_name: motherName,
              birth_date: '15 Januari 2026',
              weight: '3.2 kg',
              height: '50 cm',
              photo_url: groom.photo_url || DEFAULT_BABY_PHOTOS[0],
            },
            schedules: formattedSchedules,
            hadith: inv.quotes?.[0] || {
              content: '“Setiap anak tergadai (tergadaikan) dengan aqiqahnya. Disembelihkan (hewan) untuknya pada hari ketujuh, dicukur rambutnya, dan diberi nama.”',
              source: '(HR. An-Nasa’i & Tirmidzi)'
            },
            blessing: inv.blessings?.find(b => b.type === 'prayer') || {
              content: 'Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaaAllah kami akan menyelenggarakan acara Tasyakuran Aqiqah anak kami :'
            },
            footer_quote: {
              content: footerQuoteContent
            },
            galleries: galleryPhotos,
            gift_title: giftTitle,
            gift_message: giftMessage,
            shipping_address: shippingAddress,
            gifts: bankList
          };

          setApiData(formatted);
        }
      })
      .catch(err => console.error("Error fetching preview data:", err));
  }, [slug, customData]);

  // Prevent background scroll when cover modal is open
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
      document.body.style.overflowX = 'hidden';
      window.scrollTo(0, 0);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.overflowX = 'hidden';
    };
  }, [isOpen]);

  const cachedAkadFallback = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(`draft_akad_${slug}`) || '{}');
    } catch (e) {
      return {};
    }
  })();

  const cachedGiftFallback = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(`draft_gift_${slug}`) || '{}');
    } catch (e) {
      return {};
    }
  })();

  // Template Data merging
  const data = customData || apiData || {
    id: 1,
    baby: {
      full_name: 'Kahfi Khairan Alkautsar',
      nickname: 'Kahfi',
      father_name: 'Putra',
      mother_name: 'Uswa',
      birth_date: '15 Januari 2026',
      weight: '3.2 kg',
      height: '50 cm',
      photo_url: DEFAULT_BABY_PHOTOS[0],
    },
    schedules: [
      {
        event_name: 'Tasyakuran & Aqiqah',
        event_date: cachedAkadFallback?.event_date || 'Minggu, 22 Februari 2026',
        start_time: cachedAkadFallback?.start_time || '09:00',
        end_time: '12:00 WIB',
        event_address: cachedAkadFallback?.event_address || 'Kediaman Bpk. Putra, Jakarta',
        google_map_link: cachedAkadFallback?.google_map_link || 'https://maps.google.com/?q=Jakarta',
      }
    ],
    hadith: {
      content: '“Setiap anak tergadai (tergadaikan) dengan aqiqahnya. Disembelihkan (hewan) untuknya pada hari ketujuh, dicukur rambutnya, dan diberi nama.”',
      source: '(HR. An-Nasa’i & Tirmidzi)'
    },
    blessing: {
      content: 'Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaaAllah kami akan menyelenggarakan acara Tasyakuran Aqiqah anak kami :'
    },
    footer_quote: {
      content: 'Kami Yang Berbahagia Keluarga Besar\nBpk. Putra & Ibu Uswa\nAtas kehadiran dan doa restunya kami ucapkan terima kasih'
    },
    galleries: DEFAULT_BABY_PHOTOS.map(url => ({ photo_url: url })),
    gift_title: cachedGiftFallback?.title || 'Hadiah & Amplop Digital',
    gift_message: cachedGiftFallback?.message || 'Bagi keluarga dan sahabat yang ingin memberikan kado / hadiah untuk buah hati kami, dapat disalurkan melalui rekening di bawah ini.',
    shipping_address: cachedGiftFallback?.shipping_address || 'Bekasi Utara',
    gifts: [
      { bank_name: 'BCA', account_number: '7820491823', account_name: 'Putra' }
    ]
  };

  const mainPhoto = data.baby?.photo_url || DEFAULT_BABY_PHOTOS[0];

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

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMsg.trim()) return;

    const newWish = { name: rsvpName, msg: rsvpMsg };
    setWishes(prev => [newWish, ...prev]);

    const targetId = invId || data.id;
    if (targetId) {
      try {
        await fetch(`/api/invitations/${targetId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guest_name: rsvpName,
            will_attend: rsvpAttend === '1' ? 1 : (rsvpAttend === '0' ? 0 : null),
            message: rsvpMsg,
            jumlah_tamu: 1
          })
        });
      } catch (err) {
        console.error("Error posting RSVP comment:", err);
      }
    }

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
          <img src={mainPhoto} alt="Foto Bayi" className="aq-cover-photo" />
        </div>

        <h1 className="aq-cover-title">{data.baby?.nickname || 'Kahfi'}</h1>
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
        
        <p style={{ fontSize: '13.5px', color: 'var(--aq-muted)', lineHeight: '1.6', marginBottom: '1.25rem', position: 'relative', zIndex: 3, whiteSpace: 'pre-line' }}>
          {data.blessing?.content || "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaaAllah kami akan menyelenggarakan acara Tasyakuran Aqiqah anak kami :"}
        </p>

        <div className="aq-baby-card">
          {/* Peeking sheep_1.png on Baby Card */}
          <img 
            src="/images/sheep_1.png" 
            alt="Domba Aqiqah" 
            className="aq-mascot-img aq-anim-lamb aq-lamb-card-1" 
          />

          <div className="aq-baby-img-box">
            <img src={mainPhoto} alt={data.baby?.full_name} className="aq-baby-img" />
          </div>

          <h2 className="aq-baby-name">{data.baby?.full_name}</h2>
          <div className="aq-baby-nick">"{data.baby?.nickname}"</div>

          <p style={{ fontSize: '13.5px', color: '#555' }}>
            Putra dari Pasangan:<br />
            <strong>Bpk. {data.baby?.father_name} &amp; Ibu {data.baby?.mother_name}</strong>
          </p>

        </div>

        <div className="aq-hadith-box">
          {data.hadith?.content || "“Setiap anak tergadai (tergadaikan) dengan aqiqahnya. Disembelihkan (hewan) untuknya pada hari ketujuh, dicukur rambutnya, dan diberi nama.”"}<br />
          <strong style={{ fontSize: '12px', marginTop: '6px', display: 'block' }}>{data.hadith?.source || "(HR. An-Nasa’i & Tirmidzi)"}</strong>
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

        {data.schedules?.slice(0, 1).map((sch, i) => (
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

        {wishes.length > 0 ? (
          <div className="aq-wishes-list">
            {wishes.map((w, idx) => (
              <div className="aq-wish-item" key={idx}>
                <div className="aq-wish-name">👶 {w.name}</div>
                <div className="aq-wish-msg">"{w.msg}"</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#999', marginTop: '1.5rem', fontStyle: 'italic' }}>
            Belum ada ucapan. Jadilah yang pertama memberikan doa ucapan!
          </p>
        )}
      </section>

      {/* ── SECTION 5: HADIAH / AMPLOP DIGITAL ── */}
      {(data.gifts?.length > 0 || data.gift_message || data.shipping_address) && (
        <section className="aq-section" style={{ background: 'var(--aq-bg)' }}>
          <h2 className="aq-section-title">{data.gift_title || "Hadiah & Amplop Digital"}</h2>
          {data.gift_message && (
            <p className="aq-section-sub" style={{ maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.6, fontSize: '13.5px', color: 'var(--aq-muted)' }}>
              {data.gift_message}
            </p>
          )}

          {data.gifts?.map((g, i) => g.bank_name ? (
            <div key={i} style={{ background: '#ffffff', borderRadius: '18px', padding: '1.25rem', border: '1.5px solid var(--aq-border)', textAlign: 'center', position: 'relative', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--aq-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>{g.bank_name}</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--aq-dark)', letterSpacing: '1px', margin: '4px 0' }}>{g.account_number}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>a.n {g.account_name || g.account_holder}</div>
            </div>
          ) : null)}

          {data.shipping_address && (
            <div style={{ background: '#ffffff', borderRadius: '18px', padding: '1.25rem', border: '1.5px solid var(--aq-border)', textAlign: 'center', marginTop: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--aq-primary)', textTransform: 'uppercase', marginBottom: '6px' }}>📦 Alamat Pengiriman Kado Fisik</div>
              <div style={{ fontSize: '13.5px', color: 'var(--aq-dark)', lineHeight: 1.5, fontWeight: 600 }}>{data.shipping_address}</div>
            </div>
          )}

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
        {data.footer_quote?.content ? (
          <p style={{ whiteSpace: 'pre-line', fontWeight: 600, marginBottom: '1rem', color: 'var(--aq-dark)', lineHeight: 1.6 }}>
            {data.footer_quote.content}
          </p>
        ) : (
          <p>Wassalamu’alaikum Warahmatullahi Wabarakatuh</p>
        )}
        <p style={{ marginTop: '1rem', fontSize: '12px', color: '#aaa' }}>© 2026 Datangya.site · Undangan Digital Aqiqah</p>
      </footer>

      {/* ── MUSIC FAB TOGGLE ── */}
      {isOpen && createPortal(
        <button className="aq-music-fab" onClick={toggleMusic} title="Toggle Musik">
          {isPlaying ? '🎵' : '🔇'}
        </button>,
        document.body
      )}
    </div>
  );
}
