import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SharePage.css';

export default function SharePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  
  const [invitation, setInvitation] = useState(location.state?.inv || null);
  const [loading, setLoading] = useState(!invitation);
  const [guests, setGuests] = useState([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [isSavingMsg, setIsSavingMsg] = useState(false);
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeQrGuest, setActiveQrGuest] = useState(null);
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
          setInvitation(data.data);
          fetchGuests(data.data.id);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      }
    };

    const fetchGuests = async (weddingId) => {
      try {
        const response = await fetch(`/api/invitations/${weddingId}/guests`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (data.success) {
          setGuests(data.data);
          setCustomMsg(data.custom_wa_msg || `Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i *[NAMA_TAMU]* untuk menghadiri acara pernikahan kami.\n\nDetail acara dan undangan dapat dilihat pada tautan berikut:\n[LINK_UNDANGAN]\n\nKehadiran dan doa restu Anda sangat berarti bagi kami.\nTerima kasih.`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!invitation) {
      fetchInvitation();
    } else {
      fetchGuests(invitation.id);
    }
  }, [user, authLoading, slug, navigate, invitation]);

  const saveCustomMessage = async () => {
    setIsSavingMsg(true);
    try {
      const response = await fetch(`/api/invitations/${invitation.id}/wa-message`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ custom_wa_msg: customMsg })
      });
      const data = await response.json();
      if (data.success) {
        alert('Template pesan WA berhasil disimpan!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingMsg(false);
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    setIsAddingGuest(true);
    try {
      const response = await fetch(`/api/invitations/${invitation.id}/guests`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ name: newGuestName, phone_number: newGuestPhone })
      });
      const data = await response.json();
      if (data.success) {
        setGuests([data.data, ...guests]);
        setNewGuestName('');
        setNewGuestPhone('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingGuest(false);
    }
  };

  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm('Yakin ingin menghapus tamu ini?')) return;
    try {
      const response = await fetch(`/api/invitations/${invitation.id}/guests/${guestId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setGuests(guests.filter(g => g.id !== guestId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendWA = async (guest) => {
    // Generate URL
    const baseUrl = `${window.location.origin}/template/${invitation.template_slug}/${invitation.slug}`;
    const encodedName = encodeURIComponent(guest.name);
    const invitationLink = `${baseUrl}?to=${encodedName}${guest.passcode ? `&code=${guest.passcode}` : ''}`;

    // Generate Text
    let text = customMsg;
    text = text.replace(/\[NAMA_TAMU\]/g, guest.name);
    text = text.replace(/\[LINK_UNDANGAN\]/g, invitationLink);
    
    // Create wa.me link
    const waPhone = guest.phone_number ? guest.phone_number.replace(/\D/g, '') : '';
    // Format to 62 if starts with 0
    let formattedPhone = waPhone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    }

    const waLink = formattedPhone 
      ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(waLink, '_blank');

    // Mark as sent
    if (guest.is_sent === 0) {
      try {
        await fetch(`/api/invitations/${invitation.id}/guests/${guest.id}/mark-sent`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setGuests(guests.map(g => g.id === guest.id ? { ...g, is_sent: 1 } : g));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCopyLink = async (guest) => {
    const baseUrl = `${window.location.origin}/template/${invitation.template_slug}/${invitation.slug}`;
    const encodedName = encodeURIComponent(guest.name);
    const invitationLink = `${baseUrl}?to=${encodedName}${guest.passcode ? `&code=${guest.passcode}` : ''}`;
    try {
      await navigator.clipboard.writeText(invitationLink);
      setToastMessage('Link undangan berhasil disalin!');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setToastMessage('Gagal menyalin link');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handlePrintAllBarcodes = () => {
    const guestsWithCode = guests.filter(g => g.passcode);
    if (guestsWithCode.length === 0) {
      alert('Belum ada tamu dengan barcode/passcode.');
      return;
    }

    const printWindow = window.open('', '_blank');
    const groomBride = invitation.bride_groom || [];
    const groom = groomBride.find(bg => bg.type === 'groom');
    const bride = groomBride.find(bg => bg.type === 'bride');
    const coupleLabel = groom && bride ? `${groom.nickname} & ${bride.nickname}` : invitation.slug;

    const cardsHtml = guestsWithCode.map(g => {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        `${window.location.origin}/template/${invitation.template_slug}/${invitation.slug}?to=${encodeURIComponent(g.name)}&code=${g.passcode}`
      )}`;
      return `
        <div class="card">
          <div class="qr-wrapper">
            <img src="${qrUrl}" alt="QR ${g.name}" />
          </div>
          <div class="guest-name">${g.name}</div>
          <div class="guest-code">KODE: ${g.passcode}</div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Barcode Tamu - ${coupleLabel}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', sans-serif;
            background: #fff;
            color: #1e293b;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #e2e8f0;
          }
          .header h1 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          .header p {
            font-size: 12px;
            color: #64748b;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }
          .card {
            border: 1.5px dashed #cbd5e1;
            border-radius: 10px;
            padding: 14px 10px 12px;
            text-align: center;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .qr-wrapper {
            display: flex;
            justify-content: center;
            margin-bottom: 8px;
          }
          .qr-wrapper img {
            width: 120px;
            height: 120px;
            display: block;
          }
          .guest-name {
            font-size: 12px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 2px;
            word-break: break-word;
          }
          .guest-code {
            font-size: 10px;
            font-family: monospace;
            color: #64748b;
            letter-spacing: 1px;
          }
          .no-print { text-align: center; margin-bottom: 20px; }
          .no-print button {
            padding: 10px 28px;
            background: #3b82f6;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
          }
          .no-print button:hover { background: #2563eb; }
          @media print {
            .no-print { display: none !important; }
            body { padding: 10px; }
            .grid { gap: 10px; }
            .card { border-color: #94a3b8; }
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button onclick="window.print()">🖨️ Print Sekarang</button>
        </div>
        <div class="header">
          <h1>Barcode Check-in Tamu — ${coupleLabel}</h1>
          <p>Total ${guestsWithCode.length} tamu &bull; Gunting setiap kartu dan tempelkan pada undangan fisik</p>
        </div>
        <div class="grid">${cardsHtml}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading || authLoading) {
    return <div style={{ padding: "100px", textAlign: "center" }}>Memuat...</div>;
  }

  return (
    <div className="activate-container">
      <div className="activate-wrapper">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          &larr; Kembali ke Dashboard
        </button>
        <div className="activate-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1>📢 Sebar Undangan</h1>
            <p>Kelola daftar tamu dan sebar undangan via WhatsApp dengan mudah</p>
          </div>
          {invitation.template_is_guestbook_active === 1 && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-solid" onClick={() => navigate(`/share/${slug}/scan`)} style={{ background: '#7e5d3d', borderColor: '#7e5d3d' }}>
                📷 Scan Check-in
              </button>
              <button className="btn-solid" onClick={() => window.open(`/live/${slug}`, '_blank')} style={{ background: '#c59b27', borderColor: '#c59b27' }}>
                🖥️ Live Screen Proyektor
              </button>
            </div>
          )}
        </div>

        <div className="activate-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Panel: Message Template */}
          <div className="activate-card">
            <h2>1. Template Pesan WhatsApp</h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '1rem' }}>
              Gunakan <b>[NAMA_TAMU]</b> dan <b>[LINK_UNDANGAN]</b> sebagai variabel otomatis.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button 
                type="button"
                className="btn-outline" 
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setCustomMsg("Bismillah...\nAssalamu'alaikum Warahmatullahi Wabarakatuh\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i *[NAMA_TAMU]* untuk menghadiri acara pernikahan kami.\n\nDetail acara dan undangan dapat dilihat pada tautan berikut:\n[LINK_UNDANGAN]\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.")}
              >
                Teks Muslim
              </button>
              <button 
                type="button"
                className="btn-outline" 
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setCustomMsg("Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i *[NAMA_TAMU]* untuk menghadiri acara pernikahan kami.\n\nDetail acara dan undangan dapat dilihat pada tautan berikut:\n[LINK_UNDANGAN]\n\nKehadiran dan doa restu Anda sangat berarti bagi kami.\nTerima kasih.")}
              >
                Teks Formal
              </button>
            </div>
            <textarea 
              value={customMsg}
              readOnly
              style={{ width: '100%', height: '200px', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', resize: 'vertical', background: '#f8fafc', color: 'var(--dark)' }}
            />
          </div>

          {/* Right Panel: Guest List */}
          <div className="activate-card">
            <h2>2. Daftar Tamu</h2>
            
            <form onSubmit={handleAddGuest} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Contoh: Rani" 
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                required
                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
              />
              <button 
                type="submit" 
                className="btn-solid"
                disabled={isAddingGuest}
              >
                {isAddingGuest ? '...' : '+ Tambah Tamu'}
              </button>
            </form>

            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              {guests.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>Belum ada tamu yang ditambahkan.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '1rem' }}>Nama Tamu</th>
                      <th style={{ padding: '1rem', width: '150px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span>Aksi</span>
                          {invitation.template_is_guestbook_active === 1 && guests.some(g => g.passcode) && (
                            <button
                              onClick={handlePrintAllBarcodes}
                              title="Print semua barcode tamu"
                              style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                fontWeight: '700',
                                background: '#f1f5f9',
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                              }}
                            >
                              🖨️ Print Barcode
                            </button>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map(g => (
                      <tr key={g.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 600 }}>{g.name}</div>
                          {g.is_sent === 1 && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>✅ Terkirim</span>}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => handleSendWA(g)}
                              style={{ width: '36px', height: '36px', padding: '0', background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(37,211,102,0.2)' }}
                              title="Kirim via WhatsApp"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleCopyLink(g)}
                              style={{ width: '36px', height: '36px', padding: '0', background: '#e0f2fe', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                              title="Salin Link"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            {invitation.template_is_guestbook_active === 1 && (
                              <button 
                                onClick={() => setActiveQrGuest(g)}
                                style={{ width: '36px', height: '36px', padding: '0', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                title="Lihat QR Code"
                              >
                                <img src="/images/ic_qr.png" alt="QR" style={{ width: '20px', height: '20px', display: 'block' }} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteGuest(g.id)}
                              style={{ width: '36px', height: '36px', padding: '0', background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                              title="Hapus Tamu"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#f8fafc',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadein 0.3s ease-out'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* QR Code Modal */}
      {activeQrGuest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }} onClick={() => setActiveQrGuest(null)}>
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '16px',
            width: '320px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid var(--border)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: 'var(--dark)' }}>QR Code {activeQrGuest.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>Tunjukkan QR Code ini di meja resepsionis saat check-in tamu.</p>
            
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', display: 'inline-block', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  `${window.location.origin}/template/${invitation.template_slug}/${invitation.slug}?to=${encodeURIComponent(activeQrGuest.name)}&code=${activeQrGuest.passcode}`
                )}`} 
                alt="QR Code" 
                style={{ width: '200px', height: '200px', display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '14px', fontWeight: '700', color: '#c59b27', letterSpacing: '1px', marginBottom: '20px' }}>
              KODE: {activeQrGuest.passcode}
            </div>

            <button 
              className="btn-solid" 
              onClick={() => setActiveQrGuest(null)}
              style={{ width: '100%' }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
