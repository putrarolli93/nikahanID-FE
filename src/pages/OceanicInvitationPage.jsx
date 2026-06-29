// src/pages/OceanicInvitationPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import OceanicTemplate from "../templates/oceanic/OceanicTemplate";

const API_BASE = ``;

export default function OceanicInvitationPage() {
  const { slug } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvitation = () => {
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
  };

  useEffect(() => {
    fetchInvitation();
  }, [slug]);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (error) return <div className="error-container"><p>{error}</p></div>;
  if (!invitation) return null;
  if (invitation.template_slug !== "oceanic") {
    return <div className="error-container" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'#091322',color:'#fff'}}><p>Akses ditolak: Undangan ini menggunakan template {invitation.template_name}, bukan Oceanic.</p></div>;
  }

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

  const getEventIsoString = (schedule) => {
    if (!schedule.event_date) return null;
    const datePart = schedule.event_date.split("T")[0];
    const timePart = schedule.start_time ? schedule.start_time : "08:00:00";
    return `${datePart}T${timePart}`;
  };

  const akadTarget = getEventIsoString(scheduleAkad) || "2025-06-14T08:00:00";
  const resepsiTarget = getEventIsoString(scheduleResepsi) || "2025-06-14T11:00:00";

  const mappedData = {
    cover: {
      pic_amore_slide_1: getFullUrl(sliderMoment?.photo_url),
      groomName: groom.nickname || groom.full_name || "Mempelai Pria",
      brideName: bride.nickname || bride.full_name || "Mempelai Wanita",
      verse: quote.content || "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri.",
      verseSource: quote.source || "QS. Ar-Rum: 21",
    },
    groom: {
      photoUrl: getFullUrl(groom.photo_url),
      name: groom.full_name || "Mempelai Pria",
      fatherName: groom.father_name ? `Bpk. ${groom.father_name}` : "Bpk. Nama Ayah",
      motherName: groom.mother_name ? `Ibu ${groom.mother_name}` : "Ibu Nama Ibu",
    },
    bride: {
      photoUrl: getFullUrl(bride.photo_url),
      name: bride.full_name || "Mempelai Wanita",
      fatherName: bride.father_name ? `Bpk. ${bride.father_name}` : "Bpk. Nama Ayah",
      motherName: bride.mother_name ? `Ibu ${bride.mother_name}` : "Ibu Nama Ibu",
    },
    akad: {
      ...formatDate(scheduleAkad.event_date),
      time: scheduleAkad.start_time ? `${scheduleAkad.start_time.substring(0, 5)} WIB` : '08:00 WIB',
      until: scheduleAkad.end_time ? `s/d ${scheduleAkad.end_time.substring(0, 5)} WIB` : 's/d selesai',
      address: scheduleAkad.event_address || null,
      mapsUrl: scheduleAkad.google_map_link || null,
      isoDate: akadTarget
    },
    resepsi: {
      ...formatDate(scheduleResepsi.event_date),
      time: scheduleResepsi.start_time ? `${scheduleResepsi.start_time.substring(0, 5)} WIB` : '11:00 WIB',
      until: scheduleResepsi.end_time ? `s/d ${scheduleResepsi.end_time.substring(0, 5)} WIB` : 's/d 15:00 WIB',
      address: scheduleResepsi.event_address || null,
      mapsUrl: scheduleResepsi.google_map_link || null,
      isoDate: resepsiTarget
    },
    eventTarget: scheduleAkad.event_date || "2025-06-14T08:00:00",
    venue: {
      name: scheduleAkad.event_address || "Ocean View Chapel",
      address: scheduleAkad.event_address || "Tebing Pecatu, Kuta Selatan, Bali",
      mapsUrl: scheduleAkad.google_map_link || "https://maps.google.com",
    },
    gallery: galleryMoments.map(m => getFullUrl(m.photo_url)).filter(url => url !== null),
    banks: (invitation.gifts?.[0]?.bank_accounts || []).map(b => ({
      bankName: b.bank_name || "Bank",
      logoText: (b.bank_name || '').includes('BRI') ? 'BRI' : 
                (b.bank_name || '').includes('BCA') ? 'BCA' : 
                (b.bank_name || '').includes('BNI') ? 'BNI' : 'BANK',
      logoColor: '#fff',
      bgColor: '#1d2a44',
      accountNumber: b.account_number || "",
      accountHolder: b.account_holder || ""
    })),
    giftMessage: invitation.gifts?.[0]?.message || null,
    shippingAddress: invitation.gifts?.[0]?.shipping_address || null,
    rsvpDeadline: invitation.expires_at ? new Date(invitation.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Segera',
    comments: (invitation.comments || [])
      .filter(c => c.message && c.message.trim() !== "")
      .map(c => ({
        id: c.id,
        name: c.guest_name,
        message: c.message,
        time: new Date(c.comment_date).toLocaleDateString('id-ID')
      })),
    footerQuote: (invitation.blessings || []).find(b => b.type === "footer_quote")?.content || null,
    blessing: (invitation.blessings || []).find(b => b.type === "prayer")?.content || null,
    music: invitation.music ? {
      url: getFullUrl(invitation.music.url),
      title: invitation.music.title,
      artist: invitation.music.artist
    } : null,
    loveStories: (invitation.love_stories || []).map(s => ({
      id: s.id,
      title: s.title,
      date: s.story_date,
      description: s.description,
      photoUrl: getFullUrl(s.photo_url)
    }))
  };

  return (
    <div style={{ background: '#091322', minHeight: '100vh' }}>
      <OceanicTemplate 
        data={mappedData} 
        weddingId={invitation.id} 
        onRsvpSubmitted={fetchInvitation} 
      />
    </div>
  );
}
