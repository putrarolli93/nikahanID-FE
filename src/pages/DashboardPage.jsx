import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for AuthContext to check token

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchInvitations = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:5000/api/invitations/my-invitations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (response.ok) {
          setInvitations(result.data);
        } else {
          console.error(result.message);
        }
      } catch (err) {
        console.error('Failed to fetch invitations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [user, token, authLoading, navigate]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-wrapper">
            <h2>Dashboard Anda</h2>
            <p>Kelola semua undangan pernikahan yang telah Anda buat dengan mudah di sini.</p>
          </div>
          <button className="btn-solid btn-create-new" onClick={() => navigate('/templates')}>
            <span>+</span> Buat Undangan Baru
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="dashboard-loading">
            <div className="loader-spinner"></div>
            <p>Memuat undangan...</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="dashboard-empty">
            <div className="empty-icon">📝</div>
            <h3>Belum Ada Undangan</h3>
            <p>Anda belum memiliki undangan. Yuk, mulai buat undangan pertama Anda sekarang!</p>
            <button className="btn-solid" onClick={() => navigate('/templates')}>Pilih Template</button>
          </div>
        ) : (
          <div className="dashboard-grid">
            {invitations.map(inv => (
              <div key={inv.id} className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">{inv.title || inv.slug}</h3>
                  <span className={`card-status status-${inv.status === 'active' ? 'active' : 'draft'}`}>
                    {inv.status}
                  </span>
                </div>
                
                <div className="card-details">
                  <div className="detail-item">
                    <span className="detail-label">Template</span>
                    <span className="detail-value">{inv.template_name || 'Amore'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Terakhir Diperbarui</span>
                    <span className="detail-value">{new Date(inv.updated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="card-actions" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                  {inv.status === 'draft' && (
                    <button 
                      className="btn-solid" 
                      style={{ padding: '12px', background: '#22c55e', color: '#fff', fontSize: '15px' }}
                      onClick={() => navigate(`/activate/${inv.slug}`, { state: { inv } })}
                    >
                      🚀 Aktifkan Undangan
                    </button>
                  )}
                  {inv.status === 'active' && (
                    <button 
                      className="btn-solid" 
                      style={{ padding: '12px', background: '#3b82f6', color: '#fff', fontSize: '15px' }}
                      onClick={() => navigate(`/share/${inv.slug}`, { state: { inv } })}
                    >
                      📢 Sebar Undangan
                    </button>
                  )}
                  <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <button 
                      className="btn-solid btn-edit" 
                      onClick={() => navigate(`/create-wizard/${inv.slug}`)}
                    >
                      ✏️ Edit Data
                    </button>
                    <button 
                      className="btn-ghost btn-view" 
                      onClick={() => window.open(`/template/${inv.template_slug || 'amore'}/${inv.slug}`, '_blank')}
                    >
                      🔍 Lihat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
