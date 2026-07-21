import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SharePage.css'; // Borrowing base structure styles

export default function LiveScreenPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch invitation details
  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await fetch(`/api/invitations/${slug}`);
        const data = await response.json();
        if (data.success) {
          if (data.data.template_is_guestbook_active !== 1) {
            navigate('/dashboard');
            return;
          }
          setInvitation(data.data);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [slug, navigate]);

  // Poll live feed entries
  useEffect(() => {
    if (!invitation) return;

    const fetchFeed = async () => {
      try {
        const response = await fetch(`/api/invitations/${invitation.id}/live-feed`);
        const data = await response.json();
        if (data.success) {
          setFeed(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch live feed", err);
      }
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 8000); // Poll every 8s
    return () => clearInterval(interval);
  }, [invitation]);

  // Slideshow transition timer
  useEffect(() => {
    if (feed.length <= 1) return;
    const slideInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % feed.length);
    }, 6000); // Advance slide every 6s
    return () => clearInterval(slideInterval);
  }, [feed]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#1e1b18', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
        Memuat Live Feed Acara...
      </div>
    );
  }

  const activeEntry = feed[currentIndex];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh', 
      width: '100vw', 
      background: 'linear-gradient(135deg, #151210 0%, #2b201a 100%)', 
      color: '#fff', 
      fontFamily: "'Playfair Display', Georgia, serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background Ornaments (Gunungan / clouds representation) */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(197, 155, 39, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(197, 155, 39, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <header style={{ 
        padding: '30px 50px', 
        borderBottom: '1px solid rgba(197, 155, 39, 0.2)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        zIndex: 5
      }}>
        <div>
          <span style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '4px', color: '#c59b27' }}>Selamat Datang Di Acara Pernikahan</span>
          <h1 style={{ fontSize: '32px', margin: '5px 0 0', fontWeight: '800', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {invitation?.title || "Happy Wedding"}
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'block', letterSpacing: '1px' }}>Kirim Selfie & Ucapan Anda di:</span>
          <strong style={{ fontSize: '18px', color: '#c59b27', letterSpacing: '1px' }}>datangya.site/{slug}</strong>
        </div>
      </header>

      {/* Main Slideshow Content */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px',
        zIndex: 5
      }}>
        {feed.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            maxWidth: '600px', 
            padding: '50px', 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(197, 155, 39, 0.25)', 
            borderRadius: '24px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>📸</div>
            <h2 style={{ fontSize: '28px', color: '#c59b27', marginBottom: '15px' }}>Buku Tamu Live Gallery</h2>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
              Belum ada foto masuk. Scan QR Code di undangan digital Anda, lalu unggah ucapan dan foto selfie terbaik Anda untuk memeriahkan layar utama ini!
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.1fr 0.9fr', 
            gap: '50px',
            width: '100%',
            maxWidth: '1200px',
            alignItems: 'center'
          }}>
            {/* Selfie Photo */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                right: '-15px',
                bottom: '-15px',
                border: '1px solid rgba(197, 155, 39, 0.3)',
                borderRadius: '20px',
                transform: 'rotate(-2deg)',
                pointerEvents: 'none'
              }} />
              <img 
                src={activeEntry.photo_selfie_url} 
                alt={activeEntry.guest_name} 
                style={{ 
                  width: '100%', 
                  maxHeight: '65vh', 
                  objectFit: 'cover', 
                  borderRadius: '16px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                  border: '4px solid #fff',
                  transform: 'rotate(1deg)',
                  transition: 'all 0.5s ease-in-out'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Guest details & wishes */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '24px',
              padding: '30px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '64px', color: '#c59b27', lineHeight: 1 }}>“</span>
                <div>
                  <h2 style={{ fontSize: '38px', fontWeight: '800', margin: 0, color: '#fff', borderBottom: '2px solid #c59b27', paddingBottom: '10px', display: 'inline-block' }}>
                    {activeEntry.guest_name}
                  </h2>
                </div>
              </div>
              <p style={{ 
                fontStyle: 'italic', 
                fontSize: '24px', 
                lineHeight: '1.8', 
                color: 'rgba(255, 255, 255, 0.95)',
                margin: 0,
                maxHeight: '280px',
                overflowY: 'auto'
              }}>
                "{activeEntry.message || 'Selamat menempuh hidup baru!'}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <span style={{ fontSize: '64px', color: '#c59b27', lineHeight: 1, transform: 'rotate(180deg)' }}>“</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer / Info ticker */}
      <footer style={{ 
        padding: '20px 50px', 
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: 'rgba(255,255,255,0.5)',
        zIndex: 5
      }}>
        <span>Acara Pernikahan Real-time Guestbook Gallery</span>
        {feed.length > 0 && (
          <span>Menampilkan {currentIndex + 1} dari {feed.length} ucapan masuk</span>
        )}
      </footer>
    </div>
  );
}
