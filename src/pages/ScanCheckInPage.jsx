import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../context/AuthContext';
import './SharePage.css'; // Reuse sharing layout styles

export default function ScanCheckInPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success'|'error', text: string }
  const [history, setHistory] = useState([]);
  
  const scannerRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchInvitation = async () => {
      try {
        const response = await fetch(`/api/invitations/${slug}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (data.success) {
          if (data.data.template_is_guestbook_active !== 1) {
            navigate(`/share/${slug}`);
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
  }, [user, authLoading, slug, navigate]);

  // Initialize html5-qrcode scanner
  useEffect(() => {
    if (loading || !invitation) return;

    const onScanSuccess = async (decodedText) => {
      // Expecting standard passcode or URL ending in ?code=XXXXXX or similar
      let parsedCode = decodedText.trim();
      
      // Parse if it's a URL
      try {
        if (decodedText.startsWith('http')) {
          const url = new URL(decodedText);
          const codeParam = url.searchParams.get('code');
          if (codeParam) {
            parsedCode = codeParam;
          } else {
            // Check if last segment is code
            const segments = url.pathname.split('/');
            parsedCode = segments[segments.length - 1];
          }
        }
      } catch (e) {
        console.error('URL parse failed, using raw string', e);
      }

      if (parsedCode && parsedCode.length === 6) {
        // Pause scanner during check-in to avoid duplicate triggers
        if (scannerRef.current) {
          scannerRef.current.clear().catch(() => {});
        }
        await handleCheckIn(parsedCode.toUpperCase());
        // Re-init scanner after 2 seconds delay
        setTimeout(() => {
          initScanner();
        }, 2000);
      }
    };

    const initScanner = () => {
      const container = document.getElementById("qr-reader-container");
      if (container) {
        container.innerHTML = "";
      }
      const scanner = new Html5QrcodeScanner(
        "qr-reader-container",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      scanner.render(onScanSuccess, (err) => {
        // scan errors are fine, silent ignoring is common
      });
      scannerRef.current = scanner;
    };

    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => {
          console.error("Failed to clear scanner on unmount", err);
        });
      }
    };
  }, [loading, invitation]);

  const handleCheckIn = async (codeToSubmit) => {
    const targetCode = (codeToSubmit || passcode).trim().toUpperCase();
    if (!targetCode) return;

    setSubmitting(true);
    setStatusMsg(null);
    try {
      const response = await fetch(`/api/invitations/guests/check-in/${targetCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        const guestInfo = resData.data;
        setStatusMsg({ type: 'success', text: `✅ Tamu "${guestInfo.name}" Berhasil Check-in!` });
        setHistory(prev => [{ name: guestInfo.name, time: new Date().toLocaleTimeString('id-ID') }, ...prev]);
        setPasscode('');
      } else {
        setStatusMsg({ type: 'error', text: `❌ Gagal: ${resData.message || 'Kode tidak valid'}` });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: '❌ Terjadi kesalahan jaringan.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return <div style={{ padding: "100px", textAlign: "center" }}>Memuat...</div>;
  }

  return (
    <div className="activate-container">
      <div className="activate-wrapper" style={{ maxWidth: '640px' }}>
        <button className="btn-back" onClick={() => navigate(`/share/${slug}`)}>
          &larr; Kembali ke Sebar Undangan
        </button>
        <div className="activate-header">
          <h1>📷 Scan QR Check-in</h1>
          <p>Scan barcode / QR Code tamu untuk verifikasi kehadiran tamu</p>
        </div>

        <div className="activate-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Scanner view */}
          <div style={{ background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', padding: '10px', border: '1px solid var(--border)' }}>
            <div id="qr-reader-container" style={{ width: '100%' }}></div>
          </div>

          {/* Alert messages */}
          {statusMsg && (
            <div style={{ 
              padding: '14px', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: '700',
              textAlign: 'center',
              background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: statusMsg.type === 'success' ? '#15803d' : '#b91c1c',
              border: statusMsg.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca'
            }}>
              {statusMsg.text}
            </div>
          )}

          {/* Fallback Input Code */}
          <form onSubmit={(e) => { e.preventDefault(); handleCheckIn(); }} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="Masukkan 6 Digit Kode Manual (Contoh: X9A2F1)" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.toUpperCase())}
              maxLength={6}
              style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', fontWeight: '700', letterSpacing: '2px' }}
            />
            <button 
              type="submit" 
              className="btn-solid"
              disabled={submitting || passcode.length !== 6}
            >
              {submitting ? '...' : 'Check-in'}
            </button>
          </form>

          {/* Scan History */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: 'var(--dark)' }}>Tamu Baru Hadir</h3>
            {history.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '13px', fontStyle: 'italic', textAlign: 'center' }}>Belum ada tamu yang check-in pada sesi ini.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                {history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '13.5px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--dark)' }}>{h.name}</span>
                    <span style={{ color: 'var(--muted)' }}>🕒 {h.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
