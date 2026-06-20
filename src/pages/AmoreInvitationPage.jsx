// src/pages/AmoreInvitationPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AmoreTemplate from "../templates/amore/AmoreTemplate";

const API_BASE = "http://localhost:5000";

export default function AmoreInvitationPage() {
  const { slug } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/invitations/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Undangan tidak ditemukan");
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          setInvitation(json.data);
        } else {
          setError("Gagal memuat data undangan");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (error) return <div className="error-container"><p>{error}</p></div>;
  if (!invitation) return null;

  // Helper untuk memastikan URL foto valid
  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE}${cleanPath}`;
  };

  // ── MAPPING API DATA KE TEMPLATE FORMAT ──
  const groom = invitation.bride_groom?.find(p => p.type === 'groom') || {};
  const bride = invitation.bride_groom?.find(p => p.type === 'bride') || {};
  const schedules = invitation.schedules || [];
  const scheduleAkad = schedules.find(s => s.event_name?.toLowerCase().includes('akad')) || schedules[0] || {};
  const scheduleResepsi = schedules.find(s => s.event_name?.toLowerCase().includes('resepsi')) || schedules[1] || scheduleAkad;
  const quote = invitation.quotes?.[0] || {};
  const moments = invitation.moments || [];
  const sliderMoment = moments.find(m => m.type === 'slider') || (moments.length > 0 ? moments[0] : null);
  const galleryMoments = moments.filter(m => m.type === 'gallery');

  const formatDate = (isoStr) => {
    const d = isoStr ? new Date(isoStr) : new Date();
    if (isNaN(d.getTime())) return { date: '??', month: '??', year: '??' };
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return {
      date: d.getDate(),
      month: months[d.getMonth()],
      year: d.getFullYear()
    };
  };

  const mappedData = {
    cover: {
      pic_amore_slide_1: getFullUrl(sliderMoment?.photo_url),
      groomName: groom.nickname || groom.full_name,
      brideName: bride.nickname || bride.full_name,
      verse: quote.content || "Dan di antara tanda-tanda kekuasaan-Nya...",
      verseSource: quote.source,
    },
    groom: {
      photoUrl: getFullUrl(groom.photo_url),
      name: groom.full_name,
      fatherName: `Bpk. ${groom.father_name}`,
      motherName: `Ibu ${groom.mother_name}`,
    },
    bride: {
      photoUrl: getFullUrl(bride.photo_url),
      name: bride.full_name,
      fatherName: `Bpk. ${bride.father_name}`,
      motherName: `Ibu ${bride.mother_name}`,
    },
    akad: {
      ...formatDate(scheduleAkad.event_date),
      time: `${scheduleAkad.start_time?.substring(0, 5)} WIB`,
      until: scheduleAkad.end_time ? `s/d ${scheduleAkad.end_time.substring(0, 5)} WIB` : 's/d selesai'
    },
    resepsi: {
      ...formatDate(scheduleResepsi.event_date),
      time: `${scheduleResepsi.start_time?.substring(0, 5)} WIB`,
      until: scheduleResepsi.end_time ? `s/d ${scheduleResepsi.end_time.substring(0, 5)} WIB` : 's/d selesai'
    },
    eventTarget: scheduleAkad.event_date,
    venue: {
      name: scheduleAkad.event_address,
      address: scheduleAkad.event_address,
      mapsUrl: scheduleAkad.google_map_link,
    },
    gallery: galleryMoments.map(m => getFullUrl(m.photo_url)).filter(url => url !== null),
    banks: (invitation.gifts[0]?.bank_accounts || []).map(b => ({
      bankName: b.bank_name,
      logoText: b.bank_name.includes('BRI') ? 'BRI' : 
                b.bank_name.includes('BCA') ? 'BCA' : 
                b.bank_name.includes('BNI') ? 'BNI' : 'BANK',
      logoColor: '#fff',
      bgColor: '#b5652a',
      accountNumber: b.account_number,
      accountHolder: b.account_holder
    })),
    rsvpDeadline: invitation.expires_at ? new Date(invitation.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Segera',
    comments: (invitation.comments || []).map(c => ({
      id: c.id,
      name: c.guest_name,
      message: c.message,
      time: new Date(c.comment_date).toLocaleDateString('id-ID')
    }))
  };

  console.log("Mapped Data to Template:", mappedData); // Debugging link foto

  return (
    <div style={{ background: '#1c1208', minHeight: '100vh' }}>
      {/* Tombol Back khusus jika dibuka di web admin/preview */}
      <button 
        onClick={() => window.history.back()}
        style={{
          position: 'fixed', top: 20, left: 20, zIndex: 100,
          padding: '8px 16px', borderRadius: 20, border: 'none',
          background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer'
        }}
      >
        ← Kembali
      </button>
      <AmoreTemplate data={mappedData} />
    </div>
  );
}