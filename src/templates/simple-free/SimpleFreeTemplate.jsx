import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import './SimpleFree.css';

export default function SimpleFreeTemplate({ isPreview = false }) {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to') || 'Tamu Undangan';
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // RSVP Form State
  // RSVP Form State
  const [rsvpForm, setRsvpForm] = useState({ guest_name: guestName, attendance_status: 'ya', message: '' });
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  useEffect(() => {
    if (isPreview) {
      // Mock data for preview
      setData({
        bride_groom: [
          { type: 'groom', full_name: 'Ahmad Maulana', nickname: 'Ahmad', father_name: 'Budi', mother_name: 'Siti' },
          { type: 'bride', full_name: 'Siti Aminah', nickname: 'Siti', father_name: 'Joko', mother_name: 'Rina' }
        ],
        schedules: [
          { event_name: 'Akad Nikah', event_date: '2026-12-01', start_time: '08:00', event_address: 'Masjid Agung' },
          { event_name: 'Resepsi', event_date: '2026-12-01', start_time: '11:00', event_address: 'Gedung Serbaguna' }
        ],
        blessings: [
          { type: 'prayer', content: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri...' }
        ],
        comments: [
          { guest_name: 'Budi', will_attend: 1, message: 'Selamat menempuh hidup baru!' }
        ]
      });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/invitations/${slug}`);
        const result = await res.json();
        if (res.ok && result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, isPreview]);

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!rsvpForm.guest_name || !rsvpForm.message) {
      alert("Nama dan Pesan wajib diisi");
      return;
    }

    let willAttendVal = 1;
    if (rsvpForm.attendance_status === 'tidak') willAttendVal = 0;
    else if (rsvpForm.attendance_status === 'mungkin') willAttendVal = null;

    setSubmittingRsvp(true);
    try {
      const res = await fetch(`/api/invitations/${data.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: rsvpForm.guest_name,
          will_attend: willAttendVal,
          message: rsvpForm.message
        })
      });
      if (res.ok) {
        setRsvpSuccess(true);
        // Refresh data to get new comments
        const freshRes = await fetch(`/api/invitations/${slug}`);
        const freshData = await freshRes.json();
        setData(freshData.data);
      } else {
        alert("Gagal mengirim RSVP.");
      }
    } catch (err) {
      alert("Gagal mengirim RSVP.");
    } finally {
      setSubmittingRsvp(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}>Undangan tidak ditemukan</div>;

  const groom = data.bride_groom?.find(p => p.type === 'groom') || {};
  const bride = data.bride_groom?.find(p => p.type === 'bride') || {};
  const akad = data.schedules?.find(s => s.event_name === 'Akad Nikah');
  const resepsi = data.schedules?.find(s => s.event_name === 'Resepsi');
  const blessings = data.blessings || [];
  const comments = data.comments || [];

  return (
    <div className="sf-container">
      <div className="sf-overlay">
        {/* Hero Section */}
        <section className="sf-hero">
          <div className="sf-hero-subtitle">The Wedding Of</div>
          <h1 className="sf-hero-title">{groom.nickname || 'Groom'} & {bride.nickname || 'Bride'}</h1>
          <div style={{ marginTop: '2rem' }}>
            <p>Kepada Yth.</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', margin: '0.5rem 0' }}>{guestName}</h2>
            <p style={{ fontSize: '0.9rem', color: '#777' }}>*Mohon maaf jika ada kesalahan penulisan nama/gelar</p>
          </div>
        </section>

        {/* Quote Section (if exists) */}
        {blessings.some(b => b.type === 'prayer') && (
          <section className="sf-section alt">
            <div style={{ maxWidth: '600px', margin: '0 auto', fontStyle: 'italic', color: '#555' }}>
              "{blessings.find(b => b.type === 'prayer')?.content}"
            </div>
          </section>
        )}

        {/* Couple Section */}
        <section className="sf-section">
          <h2 className="sf-section-title">Mempelai</h2>
          <div className="sf-couple-grid">
            <div className="sf-person">
              <img src={groom.photo_url ? `${groom.photo_url}` : 'https://ui-avatars.com/api/?name=' + (groom.nickname || 'G') + '&background=2c3e50&color=fff&size=200'} alt="Groom" />
              <div className="sf-person-name">{groom.full_name}</div>
              <div className="sf-person-parents">Putra dari Bpk. {groom.father_name} & Ibu {groom.mother_name}</div>
            </div>
            <div className="sf-person">
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', margin: '2rem 0', color: '#ccc' }}>&</h1>
            </div>
            <div className="sf-person">
              <img src={bride.photo_url ? `${bride.photo_url}` : 'https://ui-avatars.com/api/?name=' + (bride.nickname || 'B') + '&background=e74c3c&color=fff&size=200'} alt="Bride" />
              <div className="sf-person-name">{bride.full_name}</div>
              <div className="sf-person-parents">Putri dari Bpk. {bride.father_name} & Ibu {bride.mother_name}</div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="sf-section alt">
          <h2 className="sf-section-title">Jadwal Acara</h2>
          
          {akad && (
            <div className="sf-event-card">
              <h3 className="sf-event-title">Akad Nikah</h3>
              <div className="sf-event-detail">📅 {new Date(akad.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="sf-event-detail">⏰ Pukul {akad.start_time} - Selesai</div>
              <div className="sf-event-detail">📍 {akad.event_address}</div>
              {akad.google_map_link && (
                <a href={akad.google_map_link} target="_blank" rel="noreferrer" className="sf-btn">Lihat Peta</a>
              )}
            </div>
          )}

          {resepsi && (
            <div className="sf-event-card">
              <h3 className="sf-event-title">Resepsi</h3>
              <div className="sf-event-detail">📅 {new Date(resepsi.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="sf-event-detail">⏰ Pukul {resepsi.start_time} - Selesai</div>
              <div className="sf-event-detail">📍 {resepsi.event_address}</div>
              {resepsi.google_map_link && (
                <a href={resepsi.google_map_link} target="_blank" rel="noreferrer" className="sf-btn">Lihat Peta</a>
              )}
            </div>
          )}
        </section>

        {/* RSVP & Comments */}
        <section className="sf-section">
          <h2 className="sf-section-title">Ucapan & Doa</h2>
          
          <div className="sf-rsvp-form">
            {rsvpSuccess ? (
              <div style={{ padding: '1rem', background: '#e6ffe6', color: '#006600', borderRadius: '6px', textAlign: 'center' }}>
                Terima kasih atas ucapan dan konfirmasi kehadiran Anda!
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit}>
                <input 
                  type="text" 
                  className="sf-input" 
                  placeholder="Nama Anda" 
                  value={rsvpForm.guest_name}
                  onChange={e => setRsvpForm({...rsvpForm, guest_name: e.target.value})}
                />
                <select 
                  className="sf-select"
                  value={rsvpForm.attendance_status}
                  onChange={e => setRsvpForm({...rsvpForm, attendance_status: e.target.value})}
                >
                  <option value="ya">Ya, saya akan hadir</option>
                  <option value="tidak">Maaf, tidak bisa hadir</option>
                  <option value="mungkin">Mungkin hadir</option>
                </select>
                <textarea 
                  className="sf-textarea" 
                  rows={4} 
                  placeholder="Tuliskan ucapan dan doa untuk kedua mempelai..."
                  value={rsvpForm.message}
                  onChange={e => setRsvpForm({...rsvpForm, message: e.target.value})}
                />
                <button type="submit" className="sf-btn-submit" disabled={submittingRsvp}>
                  {submittingRsvp ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>
              </form>
            )}
          </div>

          <div className="sf-comments-list">
            {comments.map((c, i) => (
              <div key={i} className="sf-comment-item">
                <div className="sf-comment-name">{c.guest_name}</div>
                <div className="sf-comment-status">
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    background: c.will_attend === 1 ? '#e6ffe6' : c.will_attend === 0 ? '#ffe6e6' : '#fff0cc',
                    color: c.will_attend === 1 ? '#006600' : c.will_attend === 0 ? '#cc0000' : '#b58900'
                  }}>
                    {c.will_attend === 1 ? '✓ Hadir' : c.will_attend === 0 ? '✕ Tidak Hadir' : '? Mungkin Hadir'}
                  </span>
                </div>
                <div className="sf-comment-text">{c.message}</div>
              </div>
            ))}
          </div>
        </section>
        
        <div style={{ textAlign: 'center', padding: '2rem', fontSize: '0.85rem', color: '#7f8c8d' }}>
          Dibuat dengan ❤️ oleh <a href="/" style={{ color: '#2c3e50', fontWeight: 'bold', textDecoration: 'none' }}>datangya.site</a>
        </div>
      </div>
    </div>
  );
}
