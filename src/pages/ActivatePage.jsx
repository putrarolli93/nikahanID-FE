import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount || 0);
};

export default function ActivatePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Jika tidak ada state (diakses langsung dari URL tanpa klik tombol di dashboard), kembalikan ke dashboard
  useEffect(() => {
    if (!state || !state.inv) {
      navigate('/dashboard');
    }
  }, [state, navigate]);

  if (!state || !state.inv) return null;

  const { inv } = state;
  const isPremium = inv.template_is_premium === 1;
  const packageType = isPremium ? 'Paket Premium' : 'Paket Gratis';
  const price = inv.template_price || 0;
  
  // Hardcoded Admin WhatsApp Number & Account Name (As proposed in the plan)
  const ADMIN_WA = '6282114467118'; 
  const ACCOUNT_NAME = 'Putra Rolli';
  const ACCOUNT_DEST_NUMBER = '5440133837';

  const isFormValid = bankName.trim() !== '' && accountNumber.trim() !== '';

  const waMessage = `Halo Admin Datangya.site, saya ingin mengaktifkan undangan saya: *${inv.title || inv.slug}*. 
Link: datangya.site/template/${inv.template_slug || 'amore'}/${inv.slug}

Berikut adalah detail pembayaran saya:
- Total Tagihan: *${formatRupiah(price)}*
- Transfer ke: BCA ${ACCOUNT_DEST_NUMBER} a.n ${ACCOUNT_NAME}
- Dari Bank: *${bankName}*
- No. Rekening: *${accountNumber}*

Berikut adalah bukti transfer saya:`;

  const waLink = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="page-container" style={{ minHeight: 'calc(100vh - 64px)', padding: '3rem 2rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        
        {/* Header Section */}
        <div style={{ background: 'linear-gradient(135deg, var(--cream) 0%, #fff 100%)', padding: '2rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--dark)', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif" }}>
            Aktivasi Undangan
          </h2>
          <p style={{ color: 'var(--muted)', margin: 0 }}>
            Selesaikan pembayaran untuk mempublikasikan undangan Anda.
          </p>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Order Summary */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--dark)' }}>Ringkasan Pesanan</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--muted)' }}>Nama Undangan</span>
              <strong style={{ color: 'var(--dark)' }}>{inv.title || inv.slug}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--muted)' }}>Template</span>
              <strong style={{ color: 'var(--dark)' }}>{inv.template_name || 'Amore'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--muted)' }}>Paket</span>
              <strong style={{ color: 'var(--dark)' }}>{packageType}</strong>
            </div>
            <hr style={{ border: 'none', borderTop: '1px dashed var(--border)', margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', color: 'var(--dark)' }}>Total Tagihan</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--brand)' }}>{formatRupiah(price)}</strong>
            </div>
          </div>

          {/* Payment Instructions */}
          {price > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--dark)' }}>Instruksi Pembayaran</h3>
              <div style={{ border: '1px solid var(--brand)', background: 'rgba(181, 101, 42, 0.05)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--muted)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Transfer tepat sejumlah <strong>{formatRupiah(price)}</strong> ke rekening berikut:</p>
                <div style={{ display: 'inline-block', background: '#fff', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px dashed var(--brand)', marginBottom: '1rem' }}>
                  <p style={{ fontWeight: '800', color: '#0066AE', fontSize: '1.2rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem', fontStyle: 'italic' }}>BCA</span> {ACCOUNT_DEST_NUMBER}
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>a.n {ACCOUNT_NAME}</p>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>Pastikan nama penerima sesuai sebelum melakukan transfer.</p>
              </div>
            </div>
          )}

          {/* Origin Bank Form */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--dark)' }}>Konfirmasi Data Pengirim</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Silakan masukkan data rekening Anda yang digunakan untuk transfer.
            </p>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Bank Asal</label>
              <input 
                type="text" 
                placeholder="Contoh: BCA, Mandiri, BNI, dll" 
                className="form-input" 
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Nomor Rekening Pengirim</label>
              <input 
                type="text" 
                placeholder="Contoh: 1234567890" 
                className="form-input" 
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Action Button */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Sudah transfer dan isi form di atas? Silakan klik konfirmasi.
            </p>
            {isFormValid ? (
              <a 
                href={waLink}
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#25D366',
                  color: '#fff',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                  <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                </svg>
                Konfirmasi via WhatsApp
              </a>
            ) : (
              <button 
                disabled
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#ccc',
                  color: '#fff',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  border: 'none',
                  width: '100%',
                  cursor: 'not-allowed'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                  <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                </svg>
                Isi Form Untuk Konfirmasi
              </button>
            )}
            
            <button 
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                marginTop: '1.5rem',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
