import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { compressImage } from '../../utils/selfieCompressor';
import './JavaneseHeritage.css';

// Javanese Adat Assets from public/images
const WAYANG_KIRI = '/images/jawa_wayang_kiri.png';
const WAYANG_KANAN = '/images/jawa_wayang_kanan.png';
const GUNUNGAN = '/images/jawa_gunungan.png';
const AWAN_BAWAH = '/images/jawa_awan_bawah.png';
const JAVANESE_BG = '/images/javanese_bg.png';
const AWAN_KIRI_TOP = '/images/jawa_awan_kiri.png';
const AWAN_KANAN_TOP = '/images/jawa_awan_kanan.png';
const WAYANG_PUPPET = '/images/jawa_wayang.png';

// Fallback Photos
import bride1 from '../amore/photos/bride_1.jpg';
import bride2 from '../amore/photos/bride_2.jpg';
import gallery1 from '../amore/photos/gallery_1.jpg';
import gallery2 from '../amore/photos/gallery_2.jpg';
import gallery3 from '../amore/photos/gallery_3.jpg';
import gallery4 from '../amore/photos/gallery_4.jpg';

const MOCK_DATA = {
  bride_groom: [
    { type: 'groom', full_name: 'Raden Ahmad Maulana', nickname: 'Ahmad', father_name: 'Budi Santoso', mother_name: 'Sri Wahyuni', photo_url: bride1 },
    { type: 'bride', full_name: 'Sekar Aminah Rahayu', nickname: 'Sekar', father_name: 'Joko Purnomo', mother_name: 'Rina Astuti', photo_url: bride2 },
  ],
  schedules: [
    { event_name: 'Akad Nikah', event_date: '2026-12-20', start_time: '08:00', end_time: '10:00', event_address: 'Pendopo Agung Yogyakarta, Jl. Ambarrukmo, Yogyakarta', google_map_link: 'https://maps.google.com/?q=Monumen+Nasional+Jakarta' },
    { event_name: 'Resepsi', event_date: '2026-12-20', start_time: '11:00', end_time: '15:00', event_address: 'Ndalem Ngabean, Jl. Ngadisuryan, Yogyakarta', google_map_link: 'https://maps.google.com/?q=Monumen+Nasional+Jakarta' },
  ],
  quote: {
    content: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21'
  },
  footer_quote: {
    content: 'Cinta itu bukan sekadar kata-kata, melainkan pembuktian yang tulus dari lubuk hati.',
    source: 'Pepatah Jawa'
  },
  blessing: {
    content: 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri rangkaian acara pernikahan kami.'
  },
  galleries: [
    { photo_url: gallery1 }, { photo_url: gallery2 }, { photo_url: gallery3 }, { photo_url: gallery4 }, { photo_url: gallery1 }
  ],
  comments: [
    { guest_name: 'Ki Hajar Dewantara', will_attend: 1, message: 'Selamat menempuh hidup baru! Semoga dilimpahi kebahagiaan dan keberkahan selalu.' },
    { guest_name: 'Rara Mendut', will_attend: 1, message: 'Selamat ya Sekar & Ahmad! Semoga sakinah mawaddah warahmah selamanya.' },
  ],
  music: {
    url: '/music/default.mp3',
    title: 'Gending Ladrang Wilujeng',
    artist: 'Karawitan Djawa'
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

// Custom SVG component representing a traditional Mega Mendung cloud
function MegaMendungSVG({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer largest layer */}
      <path d="M 20,60 C 20,40 50,30 80,45 C 100,25 140,25 160,40 C 180,40 190,55 175,70 C 150,85 100,80 80,70 C 60,85 30,80 20,60 Z" fill="#8b5a2b" opacity="0.12" />
      {/* Middle layer */}
      <path d="M 35,58 C 35,43 60,35 83,48 C 98,33 130,33 147,45 C 163,45 172,57 159,68 C 138,80 97,76 80,67 C 64,78 43,74 35,58 Z" fill="#c59b27" opacity="0.22" />
      {/* Inner layer */}
      <path d="M 50,56 C 50,47 70,40 86,50 C 97,38 120,38 132,48 C 145,48 152,58 141,66 C 124,76 93,72 80,64 C 67,73 55,69 50,56 Z" fill="#22140d" opacity="0.18" />
    </svg>
  );
}

// Drifting cloud simulator hook
const useClouds = (count = 5) => {
  const [clouds, setClouds] = useState([]);
  useEffect(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        top: `${10 + (i * (80 / count)) + (Math.random() * 5)}%`,
        delay: `${-Math.random() * 25}s`,
        duration: `${25 + Math.random() * 20}s`,
        scale: 0.5 + Math.random() * 0.7,
        opacity: 0.4 + Math.random() * 0.4
      });
    }
    setClouds(list);
  }, [count]);
  return list => list;
};

// Traditional Countdown component
function JavaneseCountdown({ targetISO, isMini = false }) {
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
    <div className={`javanese-countdown ${isMini ? 'javanese-countdown-mini' : ''}`}>
      {items.map(({ num, label }, i) => (
        <div key={i} className="javanese-countdown-item">
          <div className="javanese-countdown-num">{num}</div>
          <div className="javanese-countdown-label">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function JavaneseHeritageTemplate({ isPreview = false }) {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const guestName = searchParams.get('to') || 'Tamu Undangan';

  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpForm, setRsvpForm] = useState({ guest_name: '', attendance_status: 'ya', message: '' });
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showSelfieModal, setShowSelfieModal] = useState(false);
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [selfieSubmittedLocal, setSelfieSubmittedLocal] = useState(false);

  // Section Refs
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

  // Clouds generator
  const [cloudsList, setCloudsList] = useState([]);
  useEffect(() => {
    const count = 6;
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        top: `${5 + (i * (90 / count))}%`,
        delay: `${-Math.random() * 30}s`,
        duration: `${30 + Math.random() * 25}s`,
        scale: 0.6 + Math.random() * 0.6,
        reverse: Math.random() > 0.5
      });
    }
    setCloudsList(list);
  }, []);

  // Desktop Left Side Slider Timer
  useEffect(() => {
    const list = data?.moments || data?.galleries || [];
    if (list.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % list.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [data]);

  // Lock body scroll on opening cover screen
  useEffect(() => {
    if (!isOpen) {
      document.body.classList.add('javanese-locked');
    } else {
      document.body.classList.remove('javanese-locked');
    }
    return () => {
      document.body.classList.remove('javanese-locked');
    };
  }, [isOpen]);

  // Clean up audio
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
      .then(d => {
        const invData = d.data || d;
        if (invData && invData.template_slug && invData.template_slug !== 'javanese-heritage') {
          navigate(`/template/${invData.template_slug}/${slug}${window.location.search}`);
          return;
        }
        setData(invData);
        setLoading(false);
      })
      .catch(() => { setData(MOCK_DATA); setLoading(false); });
  };

  useEffect(() => {
    fetchInvitation();
  }, [slug, isPreview]);

  const guestCode = searchParams.get('code') || '';

  // Sync rsvpForm guest name
  useEffect(() => {
    if (guestName && guestName !== 'Tamu Undangan') {
      setRsvpForm(prev => ({ ...prev, guest_name: guestName }));
    }
  }, [guestName]);

  // Poll check-in status
  useEffect(() => {
    if (isPreview || !guestCode || !data || data.template_is_guestbook_active !== 1) return;
    const checkCheckInStatus = async () => {
      try {
        const response = await fetch(`/api/invitations/guests/check-status/${guestCode}`);
        const result = await response.json();
        if (result.success && result.data.is_checked_in === 1) {
          setIsCheckedIn(true);
        }
      } catch (err) {
        console.error("Error checking check-in status", err);
      }
    };
    checkCheckInStatus();
    const interval = setInterval(checkCheckInStatus, 4000);
    return () => clearInterval(interval);
  }, [guestCode, isPreview, data]);

  const handleSelfieChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file, 1.0);
    setSelfieFile(compressed);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelfiePreview(reader.result);
    };
    reader.readAsDataURL(compressed);
  };

  const handleSelfieSubmit = async (e) => {
    e.preventDefault();
    if (!selfieFile || submitting) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('guest_name', guestName);
      formData.append('will_attend', 1);
      formData.append('jumlah_tamu', 1);
      formData.append('message', rsvpForm.message);
      formData.append('passcode', guestCode);
      formData.append('photo_selfie', selfieFile);

      const response = await fetch(`/api/invitations/${data.id}/comments-with-selfie`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Ucapan dan selfie Anda berhasil dikirim ke layar proyektor!');
        setShowSelfieModal(false);
        setSelfieFile(null);
        setSelfiePreview(null);
        setRsvpForm(prev => ({ ...prev, message: '' }));
        setSelfieSubmittedLocal(true);
        fetchInvitation();
      } else {
        alert('Gagal mengirim selfie');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengirim.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadQRCode = async () => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${guestCode}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_Checkin_${guestName.replace(/\s+/g, '_')}_${guestCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mendownload QR Code", err);
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${guestCode}`, '_blank');
    }
  };

  // Intersection Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.javanese-reveal').forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [data]);

  // Active Bottom Tab Sync
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
        .catch(err => console.log("Audio blocked by autoplay settings", err));
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
        .catch(err => console.log("Audio play blocked", err));
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

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#c59b27', fontFamily: 'serif' }}>Loading...</div>;
  if (!data) return null;

  const groom = data.bride_groom?.find(p => p.type === 'groom') || {};
  const bride = data.bride_groom?.find(p => p.type === 'bride') || {};
  const akad = data.schedules?.find(s => s.event_name === 'Akad Nikah');
  const resepsi = data.schedules?.find(s => s.event_name === 'Resepsi');
  const displayQuote = data.quote || (data.quotes && data.quotes.length > 0 ? data.quotes[0] : null) || {
    content: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.",
    source: "QS. Ar-Rum: 21"
  };
  const displayFooterQuote = data.footer_quote || data.blessings?.find(b => b.type === 'footer_quote') || (data.quotes && data.quotes.length > 1 ? data.quotes[1] : null) || {
    content: "Cinta itu bukan sekadar kata-kata, melainkan pembuktian yang tulus dari lubuk hati.",
    source: "Pepatah Jawa"
  };
  const displayBlessing = data.blessing || data.blessings?.find(b => b.type === 'prayer') || (data.blessings && data.blessings.length > 0 ? data.blessings[0] : null) || {
    content: "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri rangkaian acara pernikahan kami."
  };
  const galleries = data.moments || data.galleries || [];
  const comments = data.comments || [];
  const hasSentSelfie = selfieSubmittedLocal || comments.some(c => c.guest_name === guestName && c.photo_selfie_url);

  const getEventIsoString = (schedule) => {
    if (!schedule || !schedule.event_date) return null;
    const datePart = schedule.event_date.split("T")[0];
    const timePart = schedule.start_time ? schedule.start_time : "08:00:00";
    return `${datePart}T${timePart}`;
  };
  
  const countdownTarget = akad ? getEventIsoString(akad) : null;
  const resepsiTarget = resepsi ? getEventIsoString(resepsi) : null;

  const cachedGiftFallback = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(`draft_gift_${slug}`) || '{}');
    } catch (e) {
      return {};
    }
  })();

  const giftObj = data.gifts?.[0] || {};
  const displayGiftTitle = data.gift_title || giftObj.title || cachedGiftFallback?.title || "Kado Digital";
  const displayGiftMessage = data.gift_message || giftObj.message || cachedGiftFallback?.message || "Bagi Bapak/Ibu/Saudara/i yang ingin mengirimkan hadiah, dapat mengirimkan melalui rekening atau alamat di bawah ini:";

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
    <div className="javanese-lock">
      {/* Desktop Left Side Image Slider */}
      <div className="javanese-desktop-slider">
        {galleries.map((img, index) => (
          <div
            key={index}
            className={`javanese-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img.photo_url || img})` }}
          />
        ))}
        <div className="javanese-slider-overlay">
          <div className="javanese-slider-content">
            <span className="javanese-slider-tag">Serat Ulem Pernikahan</span>
            <h1 className="javanese-slider-title">{groom.nickname || 'Groom'} & {bride.nickname || 'Bride'}</h1>
            <div className="javanese-slider-divider" />
            {akad && <p className="javanese-slider-date">{formatDate(akad.event_date)}</p>}
          </div>
        </div>
      </div>

      <div className="javanese-template">
        {/* Top traditional cloud border ornaments */}
        <img src={AWAN_KIRI_TOP} className="javanese-decor-awan-kiri" alt="" />
        <img src={AWAN_KANAN_TOP} className="javanese-decor-awan-kanan" alt="" />
        {/* Drifting Mega Mendung background clouds */}
        <div className="javanese-clouds-layer">
          {cloudsList.map(cloud => (
            <MegaMendungSVG
              key={cloud.id}
              className={cloud.reverse ? "javanese-cloud-item-reverse" : "javanese-cloud-item"}
              style={{
                top: cloud.top,
                animationDelay: cloud.delay,
                animationDuration: cloud.duration,
                transform: `scale(${cloud.scale})`
              }}
            />
          ))}
        </div>

        {/* ── OPENING SCREEN ── */}
        <div className={`javanese-opening ${isOpen ? 'hidden' : ''}`}>
          {/* Drifting Mega Mendung clouds for opening cover */}
          <div className="javanese-opening-clouds-layer">
            <img src={AWAN_KIRI_TOP} className="javanese-opening-cloud-kiri" style={{ top: '2%' }} alt="" />
            <img src={AWAN_KANAN_TOP} className="javanese-opening-cloud-kanan" style={{ top: '22%' }} alt="" />
          </div>

          {/* Top Joglo cloud frame */}
          <div className="javanese-opening-corner-tl" />
          <div className="javanese-opening-corner-tr" />
          
          <img src={GUNUNGAN} alt="Gunungan" className="javanese-opening-gunungan" />
          
          <img src={WAYANG_KIRI} alt="Wayang Kiri" className="javanese-opening-wayang-kiri" />
          <img src={WAYANG_KANAN} alt="Wayang Kanan" className="javanese-opening-wayang-kanan" />

          <div className="javanese-opening-label">Undangan Pernikahan</div>
          <h1 className="javanese-opening-names">
            {groom.nickname || 'Groom'}
            <span className="javanese-opening-amp">&</span>
            {bride.nickname || 'Bride'}
          </h1>

          <div className="javanese-divider" />
          {akad && <div className="javanese-opening-date">{formatDate(akad.event_date)}</div>}
          <div className="javanese-opening-invite-text">Kepada Yth. Bapak/Ibu/Saudara/i:</div>
          <div className="javanese-opening-guest"><strong>{guestName}</strong></div>
          <div className="javanese-opening-apology">*Mohon maaf apabila ada kesalahan penulisan nama/gelar</div>
          <button className="javanese-btn-open" onClick={handleOpen}>Buka Undangan</button>
          
          {/* Bottom cloud cover for opening page */}
          <img src={AWAN_BAWAH} className="javanese-opening-awan-bawah" alt="" />
        </div>

        {/* ── INNER CONTENT ── */}
        <div className="javanese-inner">
          {/* ── HERO ── */}
          <section ref={heroRef} className="javanese-section section-hero javanese-reveal">
            <img src={WAYANG_KIRI} alt="" className="javanese-section-decor-kiri" />
            <img src={WAYANG_KANAN} alt="" className="javanese-section-decor-kanan" />

            <div className="javanese-hero-tag">Pernikahan</div>
            <div className="javanese-hero-photo-wrapper">
              <img src={GUNUNGAN} className="javanese-hero-bg-gunungan-left" alt="" />
              <img src={GUNUNGAN} className="javanese-hero-bg-gunungan-right" alt="" />
              <img
                src={galleries[0]?.photo_url || gallery1}
                alt="Couple"
                className="javanese-hero-photo"
              />
            </div>
            <h1 className="javanese-hero-names">
              {groom.nickname || 'Groom'}
              <span className="javanese-hero-amp">&</span>
              {bride.nickname || 'Bride'}
            </h1>
            {akad && <div className="javanese-hero-date">{formatDate(akad.event_date)}</div>}
            {displayQuote && (
              <>
                <div className="javanese-divider" />
                <p className="javanese-verse">"{displayQuote.content || displayQuote}"</p>
                {displayQuote.source && <div className="javanese-verse-source">{displayQuote.source}</div>}
              </>
            )}
            
            <div className="javanese-cloud-wayang-divider">
              <img src={AWAN_BAWAH} className="divider-cloud-base" alt="" />
            </div>
          </section>

          {/* ── COUPLE ── */}
          <section ref={coupleRef} className="javanese-section section-couple javanese-reveal">
            <img src={GUNUNGAN} alt="" className="javanese-couple-gunungan-decor" />
            <div className="javanese-section-label">Mempelai</div>
            <h2 className="javanese-section-title">Kedua Mempelai</h2>
            <div className="javanese-divider" />

            {displayBlessing && (
              <p className="javanese-blessing-text">
                {displayBlessing.content || displayBlessing}
              </p>
            )}

            <div className="javanese-couple-grid">
              <div className="javanese-person">
                <img src={groom.photo_url || bride1} alt={groom.full_name} className="javanese-person-photo" />
                <div className="javanese-person-name">{groom.nickname || 'Groom'}</div>
                <div className="javanese-person-fullname">{groom.full_name}</div>
                <div className="javanese-person-parents">
                  Putra dari Bpk. {groom.father_name}<br />& Ibu {groom.mother_name}
                </div>
              </div>
              <div className="javanese-couple-and">&</div>
              <div className="javanese-person">
                <img src={bride.photo_url || bride2} alt={bride.full_name} className="javanese-person-photo" />
                <div className="javanese-person-name">{bride.nickname || 'Bride'}</div>
                <div className="javanese-person-fullname">{bride.full_name}</div>
                <div className="javanese-person-parents">
                  Putri dari Bpk. {bride.father_name}<br />& Ibu {bride.mother_name}
                </div>
              </div>
            </div>
            
            <div className="javanese-cloud-wayang-divider">
              <div className="divider-gunungans-wrapper">
                <img src={GUNUNGAN} className="divider-wayang-gunungan-left" alt="" />
                <img src={GUNUNGAN} className="divider-wayang-gunungan-right" alt="" />
              </div>
              <img src={AWAN_BAWAH} className="divider-cloud-base" alt="" />
            </div>
          </section>

          {/* ── SCHEDULE ── */}
          <section ref={scheduleRef} className="javanese-section section-schedule javanese-reveal">
            <img src={WAYANG_KIRI} alt="" className="javanese-section-decor-kiri" />
            <img src={WAYANG_KANAN} alt="" className="javanese-section-decor-kanan" />
            
            <div className="javanese-section-label">Acara</div>
            <h2 className="javanese-section-title">Rangkaian Acara</h2>
            <div className="javanese-divider" />

            {akad && (
              <div className="javanese-event-card">
                <div className="javanese-event-name">Akad Nikah</div>
                {countdownTarget && <JavaneseCountdown targetISO={countdownTarget} isMini={true} />}
                <div className="javanese-event-row"><span className="javanese-event-icon">📅</span>{formatDate(akad.event_date)}</div>
                <div className="javanese-event-row"><span className="javanese-event-icon">⏰</span>{akad.start_time} – {akad.end_time || 'Selesai'}</div>
                <div className="javanese-event-row"><span className="javanese-event-icon">📍</span>{akad.event_address}</div>
                {akad.google_map_link && <a href={akad.google_map_link} target="_blank" rel="noreferrer" className="javanese-maps-btn">🗺️ Buka Peta</a>}
              </div>
            )}
            {resepsi && (
              <div className="javanese-event-card">
                <div className="javanese-event-name">Resepsi</div>
                {resepsiTarget && <JavaneseCountdown targetISO={resepsiTarget} isMini={true} />}
                <div className="javanese-event-row"><span className="javanese-event-icon">📅</span>{formatDate(resepsi.event_date)}</div>
                <div className="javanese-event-row"><span className="javanese-event-icon">⏰</span>{resepsi.start_time} – {resepsi.end_time || 'Selesai'}</div>
                <div className="javanese-event-row"><span className="javanese-event-icon">📍</span>{resepsi.event_address}</div>
                {resepsi.google_map_link && <a href={resepsi.google_map_link} target="_blank" rel="noreferrer" className="javanese-maps-btn">🗺️ Buka Peta</a>}
              </div>
            )}

            {guestCode && data?.template_is_guestbook_active === 1 && (
              <div className="javanese-event-card" style={{ border: '2px dashed #c59b27', background: 'rgba(34, 20, 13, 0.65)', marginTop: '28px', padding: '24px 20px', borderRadius: '16px' }}>
                <div className="javanese-event-name" style={{ color: '#c59b27', fontSize: '1.2rem', marginBottom: '8px', letterSpacing: '1px' }}>🏷️ TIKET CHECK-IN TAMU</div>
                <div style={{ fontSize: '0.85rem', color: '#eaeaea', marginBottom: '16px' }}>Hai <strong>{guestName}</strong>, simpan QR Code di bawah untuk masuk ke acara pernikahan.</div>
                
                <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', display: 'inline-block', margin: '0 auto 16px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${guestCode}`} 
                    alt="QR Check-in" 
                    style={{ display: 'block', width: '150px', height: '150px' }} 
                  />
                </div>
                
                <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 'bold', color: '#c59b27', letterSpacing: '2px', marginBottom: '8px' }}>
                  KODE: {guestCode}
                </div>
                
                <button 
                  onClick={downloadQRCode}
                  style={{
                    background: 'linear-gradient(135deg, #c59b27 0%, #a8811d 100%)',
                    color: '#22140d',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 10px rgba(197, 155, 39, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'inherit'
                  }}
                >
                  📥 Simpan / Download Barcode
                </button>
                <div style={{ fontSize: '0.75rem', color: '#c4c4c4', marginTop: '12px', fontStyle: 'italic' }}>
                  *Tunjukkan barcode ini kepada petugas penerima tamu untuk check-in cepat.
                </div>
              </div>
            )}
            
            <div className="javanese-cloud-wayang-divider">
              <img src={AWAN_BAWAH} className="divider-cloud-base" alt="" />
            </div>
          </section>

          {/* ── GALLERY ── */}
          {galleries.length > 0 && (
            <section ref={galleryRef} className="javanese-section section-gallery javanese-reveal">
              <img src={GUNUNGAN} alt="" className="javanese-gallery-gunungan-decor" />
              <div className="javanese-section-label">Galeri</div>
              <h2 className="javanese-section-title">Momen Bahagia</h2>
              <div className="javanese-divider" />

              <div className="javanese-gallery">
                {galleries.map((item, i) => (
                  <div key={i} className="javanese-gallery-item" onClick={() => setActivePhoto(item.photo_url || item)}>
                    <img src={item.photo_url || item} alt={`Foto ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
              
              <div className="javanese-cloud-wayang-divider">
                <div className="divider-gunungans-wrapper">
                  <img src={GUNUNGAN} className="divider-wayang-gunungan-left" alt="" />
                  <img src={GUNUNGAN} className="divider-wayang-gunungan-right" alt="" />
                </div>
                <img src={AWAN_BAWAH} className="divider-cloud-base" alt="" />
              </div>
            </section>
          )}

          {/* ── GIFTS ── */}
          {(normalizedGifts.length > 0 || displayGiftMessage) && (
            <section className="javanese-section section-gifts javanese-reveal">
              <div className="javanese-section-label">Kirim Kado</div>
              <h2 className="javanese-section-title">{displayGiftTitle}</h2>
              <div className="javanese-divider" />

              <p className="javanese-gifts-intro">
                {displayGiftMessage}
              </p>

              <div className="javanese-gifts-list">
                {normalizedGifts.map((gift, idx) => (
                  <div key={idx} className="javanese-gift-card">
                    {gift.type === 'bank' ? (
                      <div className="gift-bank-content">
                        <div className="gift-bank-badge">{gift.bank_name}</div>
                        <div className="gift-account-number">{gift.account_number}</div>
                        <div className="gift-account-name">a.n. {gift.account_name}</div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(gift.account_number);
                            alert('Nomor rekening berhasil disalin! 🙏');
                          }}
                          className="javanese-copy-btn"
                        >
                          📋 Salin Rekening
                        </button>
                      </div>
                    ) : (
                      <div className="gift-address-content">
                        <div className="gift-address-badge">Kirim Paket</div>
                        <div className="gift-recipient-name">{gift.recipient_name}</div>
                        <div className="gift-address-text">{gift.address}</div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(gift.address);
                            alert('Alamat berhasil disalin! 🙏');
                          }}
                          className="javanese-copy-btn"
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
          <section ref={rsvpRef} className="javanese-section section-rsvp javanese-reveal">
            
            <div className="javanese-section-label">Konfirmasi Kehadiran</div>
            <h2 className="javanese-section-title">Kirim Doa Restu</h2>
            <div className="javanese-divider" />

            {rsvpSuccess ? (
              <div className="javanese-success">
                Terima kasih atas doa restu dan konfirmasi kehadiran Anda! 🙏
              </div>
            ) : (
              <form className="javanese-rsvp-form" onSubmit={handleRsvp}>
                <input
                  className="javanese-input"
                  type="text"
                  placeholder="Nama Anda"
                  value={rsvpForm.guest_name}
                  onChange={e => setRsvpForm({ ...rsvpForm, guest_name: e.target.value })}
                  required
                />
                <select
                  className="javanese-select"
                  value={rsvpForm.attendance_status}
                  onChange={e => setRsvpForm({ ...rsvpForm, attendance_status: e.target.value })}
                >
                  <option value="ya">✔️ Saya akan hadir</option>
                  <option value="tidak">❌ Mohon maaf, tidak bisa hadir</option>
                  <option value="mungkin">🤔 Masih ragu-ragu</option>
                </select>
                <textarea
                  className="javanese-textarea"
                  rows={4}
                  placeholder="Tulis ucapan dan doa restu untuk kedua mempelai..."
                  value={rsvpForm.message}
                  onChange={e => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                />
                <button type="submit" className="javanese-submit-btn" disabled={submitting}>
                  {submitting ? 'Mengirim...' : 'Kirim Ucapan 🙏'}
                </button>
              </form>
            )}

            {comments.filter(c => !c.photo_selfie_url).length > 0 && (
              <div className="javanese-comments">
                {comments.filter(c => !c.photo_selfie_url).map((c, i) => (
                  <div key={i} className="javanese-comment-card">
                    <div className="javanese-comment-name">{c.guest_name}</div>
                    <span className={`javanese-comment-badge ${c.will_attend === 1 ? 'badge-hadir' : c.will_attend === 0 ? 'badge-tidak' : 'badge-mungkin'}`}>
                      {c.will_attend === 1 ? 'Hadir' : c.will_attend === 0 ? 'Tidak Hadir' : 'Ragu-Ragu'}
                    </span>
                    <div className="javanese-comment-text">{c.message}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── FOOTER ── */}
          <footer className="javanese-footer">
            <div className="javanese-divider" />
            {displayFooterQuote && (
              <p className="javanese-footer-quote">
                "{displayFooterQuote.content || displayFooterQuote}"
              </p>
            )}
            <div className="javanese-opening-names" style={{ fontSize: '1.8rem', margin: '20px 0 6px' }}>
              {groom.nickname} & {bride.nickname}
            </div>
            <div className="javanese-footer-date">
              {akad ? formatDate(akad.event_date) : ''}
            </div>
            <img src={GUNUNGAN} alt="" className="javanese-footer-gunungan" />
            <div className="javanese-footer-brand">
              Dibuat dengan ❤️ oleh <a href="/">datangya.site</a>
            </div>
          </footer>
        </div>

        {/* Lightbox Zoom Modal */}
        {activePhoto && (
          <div className="javanese-lightbox" onClick={() => setActivePhoto(null)}>
            <button className="javanese-lightbox-close" onClick={() => setActivePhoto(null)}>&times;</button>
            <img src={activePhoto} alt="Zoomed gallery item" />
          </div>
        )}

        {/* Sticky Bottom Tab Navigation (Glassmorphism layout) */}
        {isOpen && (
          <div className="javanese-bottom-nav">
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
            className={`javanese-audio-toggle ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlay}
            title={isPlaying ? "Mute Music" : "Play Music"}
            style={{ bottom: isCheckedIn && !hasSentSelfie ? '210px' : '20px' }}
          >
            {isPlaying ? '🎵' : '🔇'}
          </button>
        )}

        {/* Floating Check-in Banner / Button */}
        {isCheckedIn && isOpen && data?.template_is_guestbook_active === 1 && !hasSentSelfie && (
          <div style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'rgba(34, 20, 13, 0.98)',
            border: '2px solid #c59b27',
            padding: '20px 24px',
            borderRadius: '20px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            width: '90%',
            maxWidth: '440px',
            boxSizing: 'border-box'
          }}>
            <span style={{ fontSize: '18px', color: '#c59b27', fontWeight: 'bold', fontFamily: 'serif' }}>
              Selamat Datang, {guestName}! 👋
            </span>
            <p style={{ fontSize: '13px', color: '#eaeaea', margin: '0', lineHeight: '1.6', textAlign: 'center' }}>
              Terima kasih sudah melakukan check-in di meja tamu. Yuk, kirim ucapan selamat beserta foto selfie terbaik Anda agar langsung tayang di layar proyektor utama!
            </p>
            <button 
              onClick={() => setShowSelfieModal(true)}
              style={{
                background: 'linear-gradient(135deg, #c59b27 0%, #a8811d 100%)',
                color: '#22140d',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%',
                boxShadow: '0 4px 15px rgba(197, 155, 39, 0.4)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              📸 Kirim Selfie & Ucapan Sekarang
            </button>
          </div>
        )}

        {/* Selfie Guestbook Modal */}
        {showSelfieModal && data?.template_is_guestbook_active === 1 && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }} onClick={() => setShowSelfieModal(false)}>
            <div style={{
              background: '#22140d',
              border: '2px solid #c59b27',
              padding: '25px',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '400px',
              color: '#fff',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              textAlign: 'left'
            }} onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowSelfieModal(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
              <h3 style={{ fontSize: '20px', color: '#c59b27', fontFamily: 'serif', marginBottom: '10px', textAlign: 'center' }}>Buku Tamu Selfie</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '20px' }}>
                Foto selfie & ucapan selamatmu akan langsung tayang di proyektor aula pernikahan!
              </p>

              <form onSubmit={handleSelfieSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Photo Snap area */}
                <div style={{
                  height: '180px',
                  border: '2px dashed rgba(197, 155, 39, 0.4)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  background: 'rgba(0,0,0,0.3)',
                  position: 'relative'
                }}>
                  {selfiePreview ? (
                    <>
                      <img src={selfiePreview} alt="Selfie Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={() => { setSelfieFile(null); setSelfiePreview(null); }}
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        Ulangi Foto
                      </button>
                    </>
                  ) : (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '20px', width: '100%', height: '100%', justifyContent: 'center' }}>
                      <span style={{ fontSize: '32px' }}>📸</span>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#c59b27' }}>Ambil Selfie Sekarang</span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>(Klik untuk membuka kamera HP)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="user" 
                        onChange={handleSelfieChange}
                        style={{ display: 'none' }}
                        required
                      />
                    </label>
                  )}
                </div>

                {/* Message text */}
                <textarea 
                  placeholder="Tulis ucapan selamat Anda di sini..."
                  rows={3}
                  value={rsvpForm.message}
                  onChange={e => setRsvpForm(prev => ({ ...prev, message: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(197, 155, 39, 0.3)',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />

                <button 
                  type="submit" 
                  disabled={submitting || !selfieFile}
                  style={{
                    background: 'linear-gradient(135deg, #c59b27 0%, #a8811d 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px',
                    boxShadow: '0 4px 15px rgba(197, 155, 39, 0.4)'
                  }}
                >
                  {submitting ? 'Mengirim...' : 'Kirim Ke Layar Utama 🚀'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
