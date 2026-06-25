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

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchInvitation = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:5000/api/invitations/${slug}`, {
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
        const response = await fetch(`http://${window.location.hostname}:5000/api/invitations/${weddingId}/guests`, {
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
      const response = await fetch(`http://${window.location.hostname}:5000/api/invitations/${invitation.id}/wa-message`, {
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
      const response = await fetch(`http://${window.location.hostname}:5000/api/invitations/${invitation.id}/guests`, {
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
      const response = await fetch(`http://${window.location.hostname}:5000/api/invitations/${invitation.id}/guests/${guestId}`, {
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
    const baseUrl = `http://${window.location.hostname}:5173/template/${invitation.template_slug}/${invitation.slug}`;
    const encodedName = encodeURIComponent(guest.name);
    const invitationLink = `${baseUrl}?to=${encodedName}`;

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
        await fetch(`http://${window.location.hostname}:5000/api/invitations/${invitation.id}/guests/${guest.id}/mark-sent`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setGuests(guests.map(g => g.id === guest.id ? { ...g, is_sent: 1 } : g));
      } catch (err) {
        console.error(err);
      }
    }
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
        <div className="activate-header">
          <h1>📢 Sebar Undangan</h1>
          <p>Kelola daftar tamu dan sebar undangan via WhatsApp dengan mudah</p>
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
                      <th style={{ padding: '1rem', width: '120px' }}>Aksi</th>
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
                              style={{ padding: '8px 16px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                              title="Kirim via WhatsApp"
                            >
                              Kirim WA
                            </button>
                            <button 
                              onClick={() => handleDeleteGuest(g.id)}
                              style={{ padding: '8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Hapus Tamu"
                            >
                              X
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
    </div>
  );
}
