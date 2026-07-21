import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SharePage.css'; // Borrow existing share layout styles

export default function GuestbookHistoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'selfie', 'text'

  const fetchInvitationAndComments = async () => {
    try {
      const response = await fetch(`/api/invitations/${slug}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const resData = await response.json();
      if (resData.success) {
        if (resData.data.template_is_guestbook_active !== 1) {
          navigate('/dashboard');
          return;
        }
        setInvitation(resData.data);
        // Only keep comments that have a selfie (check-in wishes)
        const selfieComments = (resData.data.comments || []).filter(c => !!c.photo_selfie_url);
        setComments(selfieComments);
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

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    fetchInvitationAndComments();
  }, [user, authLoading, slug, navigate]);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus ucapan ini? Ucapan ini juga akan dihapus dari undangan dan layar proyektor.')) return;
    
    try {
      const response = await fetch(`/api/invitations/${invitation.id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        alert('Ucapan berhasil dihapus.');
      } else {
        alert(data.message || 'Gagal menghapus ucapan');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  if (loading || authLoading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Memuat riwayat guestbook...</div>;
  }

  const filteredComments = comments;
  const totalCount = comments.length;

  return (
    <div className="activate-container">
      <div className="activate-wrapper" style={{ maxWidth: '1000px' }}>
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          &larr; Kembali ke Dashboard
        </button>

        <div className="activate-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '2rem' }}>
          <div>
            <h1>📖 Riwayat Foto Selfie & Ucapan (Check-in)</h1>
            <p>Kelola dan moderasi ucapan selamat serta foto selfie yang dikirimkan tamu saat check-in</p>
          </div>
          <button className="btn-solid" onClick={() => window.open(`/live/${slug}`, '_blank')} style={{ background: '#c59b27', borderColor: '#c59b27' }}>
            🖥️ Live Screen Proyektor
          </button>
        </div>

        {/* Small Analytics Widget */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '5px' }}>📸</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '600' }}>Total Foto Selfie & Ucapan</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#d97706' }}>{totalCount}</div>
          </div>
        </div>

        {/* Main Grid View */}
        {filteredComments.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            Belum ada ucapan yang sesuai dengan filter ini.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredComments.map((c) => (
              <div 
                key={c.id} 
                style={{ 
                  background: '#fff', 
                  borderRadius: '16px', 
                  border: '1px solid var(--border)', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {/* Selfie Image if exists */}
                {c.photo_selfie_url ? (
                  <div style={{ height: '220px', overflow: 'hidden', background: '#f1f5f9', borderBottom: '1px solid var(--border)' }}>
                    <img 
                      src={c.photo_selfie_url} 
                      alt={c.guest_name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                ) : (
                  <div style={{ height: '8px', background: '#3b82f6' }} />
                )}

                {/* Card Content */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--dark)', margin: 0 }}>{c.guest_name}</h3>
                      {c.will_attend === 1 ? (
                        <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Hadir</span>
                      ) : (
                        <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Absen</span>
                      )}
                    </div>

                    <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 10px 0', fontStyle: 'italic', lineHeight: '1.5' }}>
                      "{c.message || 'Selamat menempuh hidup baru!'}"
                    </p>

                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      📅 {new Date(c.comment_date || Date.now()).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Delete / Moderation button */}
                  <button 
                    onClick={() => handleDeleteComment(c.id)}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      background: '#fee2e2', 
                      color: '#ef4444', 
                      border: '1px solid #fecaca', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    🗑️ Hapus Ucapan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
