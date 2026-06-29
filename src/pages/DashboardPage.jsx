import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invitations'); // 'invitations' atau 'affiliate'
  const [historyTab, setHistoryTab] = useState('ongoing'); // 'ongoing', 'completed'

  // Data Undangan
  const [invitations, setInvitations] = useState([]);
  const [loadingInv, setLoadingInv] = useState(true);

  // Data Reseller
  const [resellerData, setResellerData] = useState(null);
  const [loadingReseller, setLoadingReseller] = useState(true);
  const [profileForm, setProfileForm] = useState({
    referral_code: '',
    bank_name: '',
    bank_account_number: '',
    bank_account_name: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Ganti Password state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    fetchInvitations();
    fetchResellerData();
  }, [user, token, authLoading, navigate]);

  const fetchInvitations = async () => {
    try {
      const response = await fetch(`/api/invitations/my-invitations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setInvitations(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch invitations', err);
    } finally {
      setLoadingInv(false);
    }
  };

  const fetchResellerData = async () => {
    try {
      const response = await fetch(`/api/reseller/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setResellerData(result.data);
        if (result.data.profile) {
          setProfileForm({
            referral_code: result.data.profile.referral_code || '',
            bank_name: result.data.profile.bank_name || '',
            bank_account_number: result.data.profile.bank_account_number || '',
            bank_account_name: result.data.profile.bank_account_name || ''
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch reseller data', err);
    } finally {
      setLoadingReseller(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const response = await fetch(`/api/reseller/update-profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(profileForm)
      });
      const result = await response.json();
      if (response.ok) {
        alert("Profil berhasil disimpan!");
        fetchResellerData(); // Refresh
      } else {
        alert(result.message || "Gagal menyimpan profil.");
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleWithdraw = async () => {
    if (!resellerData?.profile?.bank_name || !resellerData?.profile?.bank_account_number) {
      alert("Harap lengkapi nama bank dan no rekening terlebih dahulu.");
      return;
    }

    const balance = parseFloat(resellerData?.profile?.commission_balance) || 0;
    if (balance < 100000) {
      alert("Minimal penarikan adalah Rp 100.000");
      return;
    }
    
    if (!window.confirm("Buka WhatsApp untuk menghubungi Admin?")) return;

    const waNumber = "6282114467118"; // Nomor Admin
    const msg = `Halo Admin, saya Reseller ${user.name} (ID: ${user.id}) dengan Referral ${resellerData.profile.referral_code}, mau tarik komisi sebesar Rp ${new Intl.NumberFormat('id-ID').format(balance)}. Tolong transfer ke ${resellerData.profile.bank_name} ${resellerData.profile.bank_account_number} a.n ${resellerData.profile.bank_account_name}`;
    
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok!' });
      return;
    }
    try {
      setSavingPassword(true);
      setPasswordMessage({ type: '', text: '' });
      const res = await fetch(`/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordMessage({ type: 'success', text: data.message });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Gagal mengubah password' });
      }
    } catch (err) {
      setPasswordMessage({ type: 'error', text: 'Terjadi kesalahan pada server' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-wrapper">
            <h2>Dashboard Anda</h2>
            <p>Kelola undangan pernikahan Anda atau hasilkan uang dengan program Affiliate.</p>
          </div>
          <button className="btn-solid btn-create-new" onClick={() => navigate('/templates')}>
            <span>+</span> Buat Undangan Baru
          </button>
        </div>
        
        {/* TABS */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', borderBottom: '2px solid #e2e8f0', width: '100%' }}>
          <button 
            style={{ 
              padding: '1rem 0.5rem', 
              background: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === 'invitations' ? '3px solid #3b82f6' : '3px solid transparent',
              fontWeight: activeTab === 'invitations' ? '800' : '600', 
              color: activeTab === 'invitations' ? '#3b82f6' : '#64748b', 
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px'
            }}
            onClick={() => setActiveTab('invitations')}
          >
            📋 Undangan Saya
          </button>
          <button 
            style={{ 
              padding: '1rem 0.5rem', 
              background: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === 'affiliate' ? '3px solid #3b82f6' : '3px solid transparent',
              fontWeight: activeTab === 'affiliate' ? '800' : '600', 
              color: activeTab === 'affiliate' ? '#3b82f6' : '#64748b', 
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px'
            }}
            onClick={() => setActiveTab('affiliate')}
          >
            💰 Affiliate / Reseller
          </button>
          <button 
            style={{ 
              padding: '1rem 0.5rem', 
              background: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === 'settings' ? '3px solid #3b82f6' : '3px solid transparent',
              fontWeight: activeTab === 'settings' ? '800' : '600', 
              color: activeTab === 'settings' ? '#3b82f6' : '#64748b', 
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px'
            }}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Pengaturan Akun
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'invitations' && (
          loadingInv ? (
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
          )
        )}

        {activeTab === 'affiliate' && (
          loadingReseller ? (
             <div className="dashboard-loading">
              <div className="loader-spinner"></div>
              <p>Memuat data affiliate...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
              
              {/* Info Keuntungan Program Affiliate */}
              <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', padding: '2rem', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#1e40af', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚀</span> Program Reseller & Affiliate
                </h3>
                <p style={{ color: '#3b82f6', fontSize: '1.05rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Bagikan <strong>Kode Referral</strong> Anda ke teman atau klien yang ingin membuat undangan pernikahan digital. 
                  Dapatkan komisi sebesar <strong>15% (Uang Tunai)</strong> setiap kali klien mengaktifkan undangan Premium menggunakan kode Anda!
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                    <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>1. Buat Kode Promomu</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Simpan kode referral unikmu di pengaturan bawah.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                    <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>2. Sebarkan Kodenya</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Minta klien masukkan kode ini saat mereka mau bayar.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                    <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>3. Tarik Komisi</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Tarik komisi ke rekeningmu kapan saja (Min. Rp 100rb).</p>
                  </div>
                </div>
              </div>

              {/* Saldo Section */}
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '0.5rem' }}>Total Komisi Tersedia</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a' }}>
                    Rp {new Intl.NumberFormat('id-ID').format(resellerData?.profile?.commission_balance || 0)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button 
                    onClick={handleWithdraw}
                    disabled={Number(resellerData?.profile?.commission_balance) < 100000}
                    style={{ 
                      padding: '1rem 2rem', 
                      background: Number(resellerData?.profile?.commission_balance) >= 100000 ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#e2e8f0', 
                      color: Number(resellerData?.profile?.commission_balance) >= 100000 ? '#fff' : '#94a3b8', 
                      border: 'none', 
                      borderRadius: '12px', 
                      fontWeight: 'bold', 
                      cursor: Number(resellerData?.profile?.commission_balance) >= 100000 ? 'pointer' : 'not-allowed',
                      boxShadow: Number(resellerData?.profile?.commission_balance) >= 100000 ? '0 4px 15px rgba(34, 197, 94, 0.3)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Tarik Saldo
                  </button>
                  {Number(resellerData?.profile?.commission_balance) < 100000 && (
                    <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.75rem', margin: '0.75rem 0 0 0' }}>*Minimal ditarik Rp 100.000</p>
                  )}
                </div>
              </div>
              {/* Profile / Bank Info */}
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#0f172a', fontSize: '1.25rem' }}>Pengaturan Kode & Pencairan</h3>
                <form onSubmit={handleSaveProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  
                  <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Kode Referral / Promo (Untuk Klien)</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: BUDI10"
                      value={profileForm.referral_code}
                      onChange={e => setProfileForm({...profileForm, referral_code: e.target.value.toUpperCase()})}
                      style={{ 
                        width: '100%', 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        border: '1px solid #cbd5e1', 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase',
                        background: resellerData?.profile?.referral_code ? '#e2e8f0' : '#fff',
                        cursor: resellerData?.profile?.referral_code ? 'not-allowed' : 'text',
                        color: resellerData?.profile?.referral_code ? '#64748b' : '#0f172a'
                      }}
                      required
                      disabled={!!resellerData?.profile?.referral_code}
                    />
                    <small style={{ color: resellerData?.profile?.referral_code ? '#ef4444' : '#64748b', marginTop: '0.5rem', display: 'block', fontWeight: resellerData?.profile?.referral_code ? 'bold' : 'normal' }}>
                      {resellerData?.profile?.referral_code 
                        ? '🔒 Kode ini permanen dan tidak bisa diubah.' 
                        : 'Gunakan kombinasi huruf/angka yang mudah diingat klien. (PERMANEN, tidak bisa diubah nanti!)'}
                    </small>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Bank Pencairan</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: BCA / Mandiri / GoPay"
                      value={profileForm.bank_name}
                      onChange={e => setProfileForm({...profileForm, bank_name: e.target.value})}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Atas Nama (A/N)</label>
                    <input 
                      type="text" 
                      placeholder="Nama pemilik rekening"
                      value={profileForm.bank_account_name}
                      onChange={e => setProfileForm({...profileForm, bank_account_name: e.target.value})}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                      required
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>No. Rekening / No. E-Wallet</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 123456789"
                      value={profileForm.bank_account_number}
                      onChange={e => setProfileForm({...profileForm, bank_account_number: e.target.value})}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                      required
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                    <button type="submit" disabled={savingProfile} style={{ padding: '1rem 2rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
                      {savingProfile ? '⏳ Menyimpan...' : '💾 Simpan Pengaturan'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Commission History */}
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#0f172a', fontSize: '1.25rem' }}>Riwayat Komisi Masuk</h3>
                
                {/* Tabs for History */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                  <button 
                    onClick={() => setHistoryTab('ongoing')}
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      background: 'none', 
                      border: 'none', 
                      borderBottom: historyTab === 'ongoing' ? '2px solid #0ea5e9' : '2px solid transparent',
                      color: historyTab === 'ongoing' ? '#0ea5e9' : '#64748b',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    OnGoing
                  </button>
                  <button 
                    onClick={() => setHistoryTab('completed')}
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      background: 'none', 
                      border: 'none', 
                      borderBottom: historyTab === 'completed' ? '2px solid #22c55e' : '2px solid transparent',
                      color: historyTab === 'completed' ? '#22c55e' : '#64748b',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Sudah Cair
                  </button>
                </div>

                {historyTab === 'ongoing' ? (
                  (!resellerData?.commissions || resellerData.commissions.filter(c => c.status === 'ongoing').length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💸</div>
                      <h4 style={{ color: '#475569', marginBottom: '0.5rem' }}>Belum ada komisi masuk</h4>
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Bagikan kode referral Anda sekarang dan kumpulkan pundi-pundi rupiah!</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem', color: '#475569', fontWeight: 'bold' }}>Tanggal</th>
                            <th style={{ padding: '1rem', color: '#475569', fontWeight: 'bold' }}>Klien / Undangan</th>
                            <th style={{ padding: '1rem', color: '#475569', fontWeight: 'bold' }}>Komisi (+15%)</th>
                            <th style={{ padding: '1rem', color: '#475569', fontWeight: 'bold', textAlign: 'center' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resellerData.commissions.filter(c => c.status === 'ongoing').map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                              <td style={{ padding: '1rem', color: '#64748b' }}>{new Date(c.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                              <td style={{ padding: '1rem', fontWeight: '500', color: '#334155' }}>{c.wedding_title}</td>
                              <td style={{ padding: '1rem', color: '#0ea5e9', fontWeight: 'bold' }}>+ Rp {new Intl.NumberFormat('id-ID').format(c.amount)}</td>
                              <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 'bold', background: '#e0f2fe', color: '#0369a1' }}>
                                  Menunggu Cair
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : (
                  (!resellerData?.withdrawals || resellerData.withdrawals.length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💸</div>
                      <h4 style={{ color: '#475569', marginBottom: '0.5rem' }}>Belum ada komisi yang dicairkan</h4>
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Semua komisi yang sudah dibayarkan oleh Admin akan tampil di sini.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {resellerData.withdrawals.map(w => (
                        <div key={w.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '1rem' }}>
                            <div>
                              <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Ditarik pada {new Date(w.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                              <div style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 'bold' }}>Rp {new Intl.NumberFormat('id-ID').format(w.amount)}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                              <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 'bold', background: '#dcfce7', color: '#166534' }}>Sudah Cair</span>
                              {w.proof_image && (
                                <a href={`${w.proof_image}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', background: '#eff6ff', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #bfdbfe', transition: 'all 0.2s' }}>
                                  🖼️ Lihat Bukti Transfer
                                </a>
                              )}
                            </div>
                          </div>
                          <div>
                            <h5 style={{ color: '#334155', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Rincian Komisi:</h5>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {w.commissions && w.commissions.length > 0 ? w.commissions.map(c => (
                                <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.9rem', background: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                                  <span>{c.wedding_title}</span>
                                  <span style={{ fontWeight: '500' }}>Rp {new Intl.NumberFormat('id-ID').format(c.amount)}</span>
                                </li>
                              )) : (
                                <li style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', padding: '0.5rem' }}>Data komisi tidak ditemukan</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>

            </div>
          )
        )}
        {activeTab === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {/* Ganti Password */}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#0f172a', fontSize: '1.25rem' }}>Ganti Password</h3>
              
              {passwordMessage.text && (
                <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', background: passwordMessage.type === 'error' ? '#fef2f2' : '#f0fdf4', color: passwordMessage.type === 'error' ? '#ef4444' : '#16a34a', border: `1px solid ${passwordMessage.type === 'error' ? '#fca5a5' : '#bbf7d0'}` }}>
                  {passwordMessage.text}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Password Lama</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      style={{ width: '100%', padding: '0.8rem 1rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                    >
                      {showCurrentPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Password Baru</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder="Min. 6 karakter"
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      style={{ width: '100%', padding: '0.8rem 1rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                      required
                      minLength={6}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                    >
                      {showNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Konfirmasi Password Baru</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Min. 6 karakter"
                      value={passwordForm.confirmNewPassword}
                      onChange={e => setPasswordForm({...passwordForm, confirmNewPassword: e.target.value})}
                      style={{ width: '100%', padding: '0.8rem 1rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                      required
                      minLength={6}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <button type="submit" disabled={savingPassword} style={{ padding: '1rem 2rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
                    {savingPassword ? '⏳ Menyimpan...' : '🔐 Ubah Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
