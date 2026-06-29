import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import './ModernFloral.css';

// Import local photos
import heroBg from '../../gallery/wedding-assets/4/5.jpg';
import groomImg from '../../gallery/wedding-assets/4/groom.png';
import brideImg from '../../gallery/wedding-assets/4/bride.jpg';
import gal1 from '../../gallery/wedding-assets/4/1.jpg';
import gal2 from '../../gallery/wedding-assets/4/2.jpg';
import gal3 from '../../gallery/wedding-assets/4/3.jpg';
import gal4 from '../../gallery/wedding-assets/4/4.jpg';
import gal5 from '../../gallery/wedding-assets/4/10.jpg';
import gal6 from '../../gallery/wedding-assets/4/11.jpg';

export default function ModernFloralTemplate({ isPreview = false }) {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to') || 'Tamu Undangan';
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // RSVP States
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttendance, setRsvpAttendance] = useState('');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [comments, setComments] = useState([]);

  // Prevent scroll while locked
  useEffect(() => {
    if (!isOpen && !loading) {
      document.body.classList.add('floral-locked');
    } else {
      document.body.classList.remove('floral-locked');
    }
    return () => {
      document.body.classList.remove('floral-locked');
    };
  }, [isOpen, loading]);

  // Intersection Observer for scroll animations
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isPreview) {
      setData({
        bride_groom: [
          { type: 'groom', full_name: 'Muhammad Rizky', nickname: 'Rizky', father_name: 'Bpk. Ahmad', mother_name: 'Ibu Siti' },
          { type: 'bride', full_name: 'Aisyah Putri', nickname: 'Aisyah', father_name: 'Bpk. Budi', mother_name: 'Ibu Ratna' }
        ],
        schedules: [
          { name: 'Akad Nikah', date: '2025-08-15', time_start: '08:00', time_end: '10:00', location: 'Masjid Agung', address: 'Jl. Merdeka No. 1, Jakarta', google_map_link: 'https://maps.google.com/?q=Monas' },
          { name: 'Resepsi', date: '2025-08-15', time_start: '11:00', time_end: '14:00', location: 'Gedung Serbaguna', address: 'Jl. Sudirman No. 10, Jakarta', google_map_link: 'https://maps.google.com/?q=Monas' }
        ],
        quote: {
          content: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...',
          source: 'QS. Ar-Rum: 21'
        },
        footer_quote: {
          content: 'Cinta sejati tidak pernah memiliki akhir yang bahagia, karena cinta sejati tidak pernah berakhir.',
          source: 'Unknown'
        },
        blessing: {
          content: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.'
        },
        gifts: [
          {
            type: 'bank',
            bank_name: 'BCA',
            account_number: '12345678',
            account_name: 'Someone'
          },
          {
            type: 'address',
            recipient_name: 'Someone',
            address: 'Monas, Jakarta Pusat'
          }
        ],
        stories: [
          {
            id: 1,
            story_date: '10 Januari 2020',
            title: 'Pertama Ketemu',
            description: 'Secara tidak sengaja kami berpapasan di sebuah kedai kopi. Tatapan singkat yang menumbuhkan rasa penasaran untuk saling mengenal lebih dalam.',
            photo_url: '/images/timeline_meet.png'
          },
          {
            id: 2,
            story_date: '15 Februari 2020',
            title: 'Kenalan Lebih Dekat',
            description: 'Setelah bertukar kontak, kami mulai rutin berkomunikasi. Menemukan banyak kecocokan, hobi yang sama, serta visi masa depan yang saling melengkapi.',
            photo_url: '/images/timeline_know.png'
          },
          {
            id: 3,
            story_date: '25 Desember 2024',
            title: 'Momen Lamaran (Proposal)',
            description: 'Dengan restu tulus dari kedua keluarga besar, kami memantapkan hati untuk mengikat komitmen suci kami menuju jenjang pernikahan.',
            photo_url: '/images/timeline_proposal.png'
          },
          {
            id: 4,
            story_date: '20 Juni 2025',
            title: 'Hari Pernikahan',
            description: 'Hari bersejarah di mana kami mengucapkan janji suci di hadapan Allah SWT untuk saling menyayangi, membimbing, dan menjaga selamanya.',
            photo_url: '/images/timeline_wedding.png'
          }
        ],
        gallery: [gal1, gal2, gal3, gal4, gal5, gal6]
      });
      setLoading(false);
      return;
    }

    fetch(`/api/invitations/${slug}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          let fetchedGallery = null;
          if (json.data.moments && json.data.moments.length > 0) {
            fetchedGallery = json.data.moments
              .filter(m => m.type === 'gallery' && m.photo_url)
              .map(m => m.photo_url.startsWith('http') ? m.photo_url : `${m.photo_url}`);
          }

          setData({
            ...json.data,
            gallery: fetchedGallery && fetchedGallery.length > 0 ? fetchedGallery : (json.data.gallery || [gal1, gal2, gal3, gal4, gal5, gal6]), // Fallback for gallery
            quote: json.data.quote || null,
            footer_quote: json.data.footer_quote || null,
            blessing: json.data.blessing || null,
            gifts: json.data.gifts || []
          });
          setComments(json.data.comments || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug, isPreview]);

  useEffect(() => {
    if (!loading && data) {
      const elements = document.querySelectorAll('.fade-up');
      elements.forEach(el => observerRef.current?.observe(el));
    }
  }, [loading, data]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Memuat...</div>;
  if (!data) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Undangan tidak ditemukan</div>;

  const groom = data.bride_groom?.find(p => p.type === 'groom') || {};
  const bride = data.bride_groom?.find(p => p.type === 'bride') || {};

  const getImageUrl = (url, fallback) => {
    if (!url) return fallback;
    if (isPreview) return url;
    if (url.startsWith('http')) return url;
    return `${url}`;
  };

  const currentHeroBg = getImageUrl(data.cover?.photo_url || data.cover?.photoUrl, null) || (data.gallery && data.gallery.length > 0 ? data.gallery[0] : heroBg);
  const currentGroomImg = getImageUrl(groom.photo_url || groom.photoUrl, groomImg);
  const currentBrideImg = getImageUrl(bride.photo_url || bride.photoUrl, brideImg);

  // Normalize events & stories
  const displaySchedules = data.schedules || [data.akad, data.resepsi].filter(Boolean);
  const displayStories = data.love_stories || data.loveStories || data.stories || [];

  // Normalize quotes and blessings
  const displayCoverQuote = data.quote || (data.quotes && data.quotes.length > 0 ? data.quotes[0] : null);
  const displayFooterQuote = data.footer_quote || (data.quotes && data.quotes.length > 1 ? data.quotes[1] : null);
  const displayBlessing = data.blessing || (data.blessings && data.blessings.length > 0 ? data.blessings[0] : null);

  // Normalize gifts
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

  const handleSendRsvp = async (e) => {
    e.preventDefault();
    if (isPreview) {
      alert('Ini hanya contoh (preview)');
      return;
    }
    setIsSubmitting(true);
    try {
      let willAttendVal = 1;
      if (rsvpAttendance === 'tidak') willAttendVal = 0;
      else if (rsvpAttendance === 'mungkin') willAttendVal = null;
      
      const response = await fetch(`/api/invitations/${data.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: rsvpName,
          message: rsvpMessage,
          will_attend: willAttendVal,
          jumlah_tamu: 1
        })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setRsvpName('');
        setRsvpMessage('');
        setRsvpAttendance('');
        setSubmitted(true);
        setComments([{
          id: Date.now(),
          name: rsvpName,
          message: rsvpMessage,
          time: 'Baru saja'
        }, ...comments]);
      } else {
        alert(result.message || "Gagal mengirim ucapan");
      }
    } catch (err) {
      alert("Gagal terhubung dengan server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (data.music?.url) {
      const musicUrl = data.music.url.startsWith('http') ? data.music.url : `${data.music.url}`;
      const player = new Audio(musicUrl);
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
    <div className={`floral-template ${isOpen ? 'unlocked' : 'locked'}`}>

      {/* ── FLOATING AUDIO BUTTON ── */}
      {audio && (
        <button 
          className={`floral-audio-toggle ${isPlaying ? 'playing' : ''}`} 
          onClick={togglePlay}
          title={isPlaying ? "Mute Music" : "Play Music"}
        >
          <i className={`ti ${isPlaying ? 'ti-music' : 'ti-music-off'}`}></i>
        </button>
      )}
      
      {/* ── COVER TERBUKA / OPENING SCREEN OVERLAY ── */}
      <div className={`floral-opening-screen ${isOpen ? 'hidden' : ''}`}>
        <div className="floral-opening-bg" style={{backgroundImage: `url(${currentHeroBg})`}}></div>
        <div className="floral-opening-overlay"></div>
        <div className="floral-opening-content">
          <div className="floral-opening-to">Kepada Yth.</div>
          <div className="floral-opening-guest">{guestName}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--floral-muted)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di acara pernikahan kami.
          </div>
          <h1 className="floral-opening-names">{groom.nickname} & {bride.nickname}</h1>
          <button className="floral-btn" onClick={handleOpen}>Buka Undangan</button>
        </div>
      </div>

      {/* Animated Bush Ornaments */}
      <div className="floral-ornament floral-top-left">
        <img src="/images/sakura.png" alt="floral top" style={{ width: '100%' }} />
      </div>
      <div className="floral-ornament floral-bottom-right">
        <img src="/images/sakura.png" alt="floral bottom" style={{ width: '100%', transform: 'rotate(180deg)' }} />
      </div>

      {/* Flying Birds */}
      <img src="/images/bird.svg" alt="bird" className="floral-bird bird-1" />
      <img src="/images/bird.svg" alt="bird" className="floral-bird bird-2" />

      {/* Full width Hero Wrapper */}
      <div className="floral-hero-wrapper">
        {/* Hero Background Image with low visibility */}
        <img src={currentHeroBg} alt="Background" className="floral-hero-bg" />
        
        <div className="floral-hero fade-up">
          <div className="floral-subtitle">Undangan Pernikahan</div>
          <h1 className="floral-title serif-text">{groom.nickname} & {bride.nickname}</h1>
          <div className="floral-date">
            {displaySchedules?.[0]?.date || displaySchedules?.[0]?.event_date ? new Date(displaySchedules[0].date || displaySchedules[0].event_date).toLocaleDateString('id-ID', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            }) : ''}
          </div>
        </div>
      </div>

      <div className="floral-content">

        {/* Cover Quote */}
        {displayCoverQuote && displayCoverQuote.content && (
          <div className="floral-section fade-up">
            <div className="floral-quote-box">
              <p style={{ fontStyle: 'italic', marginBottom: '1rem', lineHeight: '1.6' }}>"{displayCoverQuote.content}"</p>
              <p style={{ fontWeight: 'bold' }}>{displayCoverQuote.source}</p>
            </div>
          </div>
        )}

        {/* Mempelai Section */}
        <div className="floral-section">
          <h2 className="floral-section-title fade-up">Mempelai</h2>
          <div className="floral-divider fade-up"></div>
          
          <div className="floral-mempelai-grid">
            <div className="floral-card fade-up" style={{margin: 0}}>
              <div className="floral-photo-wrapper">
                <img src={currentGroomImg} alt="Groom" className="floral-photo" />
              </div>
              <h3 className="serif-text" style={{fontSize: '2rem', margin: '0 0 0.5rem', color: 'var(--floral-primary)'}}>{groom.full_name}</h3>
              <p>Putra dari Bapak {groom.father_name} & Ibu {groom.mother_name}</p>
            </div>

            <h1 className="serif-text fade-up floral-ampersand" style={{fontSize: '3rem', color: 'var(--floral-primary)', margin: '0'}}>&</h1>

            <div className="floral-card fade-up" style={{margin: 0}}>
              <div className="floral-photo-wrapper">
                <img src={currentBrideImg} alt="Bride" className="floral-photo" />
              </div>
              <h3 className="serif-text" style={{fontSize: '2rem', margin: '0 0 0.5rem', color: 'var(--floral-primary)'}}>{bride.full_name}</h3>
              <p>Putri dari Bapak {bride.father_name} & Ibu {bride.mother_name}</p>
            </div>
          </div>
        </div>

        {/* Acara Section */}
        <div className="floral-section">
          <h2 className="floral-section-title fade-up">Acara</h2>
          <div className="floral-divider fade-up"></div>
          
          {displaySchedules.map((schedule, idx) => {
            const evDate = schedule.event_date || schedule.date;
            return (
              <div key={idx} className="floral-card fade-up">
                <h3 className="serif-text" style={{fontSize: '1.8rem', margin: '0 0 1rem', color: 'var(--floral-primary)'}}>{schedule.name || (idx === 0 ? 'Akad Nikah' : 'Resepsi')}</h3>
                <div style={{fontWeight: '500', marginBottom: '0.5rem'}}>
                  {evDate ? new Date(evDate).toLocaleDateString('id-ID', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  }) : ''}
                </div>
                <div style={{marginBottom: '1rem', color: 'var(--floral-muted)'}}>
                  {schedule.start_time || schedule.time_start} - {schedule.end_time || schedule.time_end || 'Selesai'} WIB
                </div>
                <div style={{fontSize: '0.9rem', color: 'var(--floral-muted)', marginTop: '0.5rem'}}>{schedule.event_address || schedule.address}</div>
                {schedule.google_map_link && (
                  <a href={schedule.google_map_link} target="_blank" rel="noopener noreferrer" className="floral-btn" style={{marginTop: '1.5rem', display: 'inline-block', fontSize: '0.9rem', padding: '0.6rem 1.2rem', textDecoration: 'none'}}>
                    Buka Google Maps
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Love Story Section */}
        {displayStories && displayStories.length > 0 && (
          <div className="floral-section">
            <h2 className="floral-section-title fade-up">Perjalanan Cinta</h2>
            <div className="floral-divider fade-up"></div>
            
            <div className="floral-timeline fade-up">
              {displayStories.map((story, idx) => (
                <div key={idx} className="floral-timeline-item">
                  <div className="floral-timeline-dot"></div>
                  <div className="floral-timeline-content">
                    <h4 className="serif-text" style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: 'var(--floral-primary)' }}>{story.title}</h4>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--floral-muted)', fontWeight: 'bold' }}>{story.story_date}</p>
                    {story.photo_url && (
                      <div style={{ marginBottom: '10px', borderRadius: '8px', overflow: 'hidden', height: '180px' }}>
                        <img src={getImageUrl(story.photo_url, '')} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <p style={{ margin: '0', fontSize: '0.95rem', color: 'var(--floral-text)', lineHeight: 1.5 }}>
                      {story.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Galeri Section */}
        {data.gallery && data.gallery.length > 0 && (
          <div className="floral-section">
            <h2 className="floral-section-title fade-up">Galeri Foto</h2>
            <div className="floral-divider fade-up"></div>
            
            <div className="floral-gallery fade-up">
              {data.gallery.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`Gallery ${idx + 1}`} 
                  className="floral-gallery-item" 
                  onClick={() => setSelectedImage(img)}
                  style={{cursor: 'pointer'}}
                />
              ))}
            </div>
          </div>
        )}

        {/* RSVP Section (Sample & Real) */}
        <div className="floral-section">
          <h2 className="floral-section-title fade-up">Kehadiran (RSVP)</h2>
          <div className="floral-divider fade-up"></div>
          
          {submitted ? (
            <div className="floral-card fade-up" style={{textAlign: 'center', padding: '2rem'}}>
              <h3 style={{color: 'var(--floral-primary)', marginBottom: '1rem'}}>Terima Kasih!</h3>
              <p>Konfirmasi kehadiran dan ucapan Anda telah berhasil dikirim.</p>
              <button onClick={() => setSubmitted(false)} className="floral-btn" style={{marginTop: '1rem', background: 'transparent', color: 'var(--floral-primary)', border: '1px solid var(--floral-primary)'}}>
                Kirim Ucapan Lain
              </button>
            </div>
          ) : (
            <div className="floral-card fade-up">
              <form onSubmit={handleSendRsvp}>
                <div style={{marginBottom: '1rem', textAlign: 'left'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--floral-primary)'}}>Nama Lengkap</label>
                  <input type="text" placeholder="Nama Anda" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} disabled={isSubmitting} style={{width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(181, 101, 42, 0.3)', background: 'rgba(255,255,255,0.5)', boxSizing: 'border-box'}} required />
                </div>
                <div style={{marginBottom: '1rem', textAlign: 'left'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--floral-primary)'}}>Kehadiran</label>
                  <select value={rsvpAttendance} onChange={(e) => setRsvpAttendance(e.target.value)} disabled={isSubmitting} style={{width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(181, 101, 42, 0.3)', background: 'rgba(255,255,255,0.5)', boxSizing: 'border-box'}} required>
                    <option value="" disabled>Pilih Kehadiran</option>
                    <option value="ya">Hadir</option>
                    <option value="tidak">Tidak Hadir</option>
                    <option value="mungkin">Mungkin</option>
                  </select>
                </div>
                <div style={{marginBottom: '1.5rem', textAlign: 'left'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--floral-primary)'}}>Ucapan & Doa</label>
                  <textarea rows="3" placeholder="Tuliskan ucapan dan doa untuk mempelai..." value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} disabled={isSubmitting} style={{width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(181, 101, 42, 0.3)', background: 'rgba(255,255,255,0.5)', boxSizing: 'border-box', fontFamily: 'inherit'}} required></textarea>
                </div>
                <button type="submit" className="floral-btn" disabled={isSubmitting} style={{width: '100%', opacity: isSubmitting ? 0.7 : 1}}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>
              </form>
            </div>
          )}

          {/* Comments List */}
          <div className="fade-up" style={{marginTop: '2rem'}}>
            <h3 className="serif-text" style={{fontSize: '1.2rem', color: 'var(--floral-primary)', marginBottom: '1rem', borderBottom: '1px solid rgba(181, 101, 42, 0.2)', paddingBottom: '0.5rem'}}>
              Ucapan & Doa Restu ({comments.length})
            </h3>
            {comments.length === 0 ? (
              <p style={{fontSize: '0.9rem', color: 'var(--floral-muted)', fontStyle: 'italic'}}>Belum ada ucapan. Jadilah yang pertama!</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px'}}>
                {comments.map((comment, idx) => (
                  <div key={comment.id || idx} style={{background: 'rgba(255,255,255,0.4)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(181,101,42,0.1)', textAlign: 'left'}}>
                    <div style={{fontWeight: 'bold', color: 'var(--floral-primary)', marginBottom: '4px'}}>{comment.name || comment.guest_name}</div>
                    <div style={{fontSize: '0.95rem', color: 'var(--floral-text)', marginBottom: '6px'}}>"{comment.message}"</div>
                    <div style={{fontSize: '0.8rem', color: 'var(--floral-muted)'}}>{comment.time || (comment.comment_date ? new Date(comment.comment_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hadiah Pernikahan Section */}
        {normalizedGifts.length > 0 && (
          <div className="floral-section">
            <h2 className="floral-section-title fade-up">Hadiah Pernikahan</h2>
            <div className="floral-divider fade-up"></div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {normalizedGifts.map((gift, idx) => (
                <div key={idx} className="floral-card fade-up">
                  {gift.type === 'bank' ? (
                    <div>
                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--floral-primary)', fontSize: '1.2rem' }}>Transfer Bank</h4>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>{gift.bank_name} - {gift.account_number}</div>
                      <div style={{ color: 'var(--floral-muted)', fontSize: '0.9rem' }}>a.n. {gift.account_name}</div>
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--floral-primary)', fontSize: '1.2rem' }}>Kirim Hadiah</h4>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{gift.recipient_name}</div>
                      <div style={{ color: 'var(--floral-muted)', fontSize: '0.9rem' }}>{gift.address}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="floral-section fade-up">
          <p style={{fontStyle: 'italic', color: 'var(--floral-muted)', lineHeight: '1.6'}}>
            {displayBlessing?.content || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami."}
          </p>
          <div className="floral-divider"></div>
          <h2 className="serif-text" style={{color: 'var(--floral-primary)', marginBottom: '0.5rem'}}>Terima Kasih</h2>
          <p style={{marginBottom: '2rem'}}>{groom.nickname} & {bride.nickname}</p>
          
          {displayFooterQuote && displayFooterQuote.content && (
            <div style={{fontSize: '0.8rem', color: 'rgba(232, 221, 208, 0.5)', marginTop: '2rem'}}>
              <p>"{displayFooterQuote.content}"</p>
              {displayFooterQuote.source && <p>- {displayFooterQuote.source}</p>}
            </div>
          )}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="floral-lightbox" onClick={() => setSelectedImage(null)}>
          <button className="floral-lightbox-close" onClick={() => setSelectedImage(null)}>&times;</button>
          <img src={selectedImage} alt="Fullscreen Gallery" />
        </div>
      )}
    </div>
  );
}
