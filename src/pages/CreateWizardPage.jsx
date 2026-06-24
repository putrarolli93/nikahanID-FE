import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CreateWizardPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [weddingId, setWeddingId] = useState(null);
  const [invitationData, setInvitationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1: Bride & Groom State
  const [groom, setGroom] = useState({
    full_name: "", nickname: "", father_name: "", mother_name: "", address: "", instagram_username: "", photo_url: ""
  });
  const [groomFile, setGroomFile] = useState(null);
  const [groomPreview, setGroomPreview] = useState(null);

  const [bride, setBride] = useState({
    full_name: "", nickname: "", father_name: "", mother_name: "", address: "", instagram_username: "", photo_url: ""
  });
  const [brideFile, setBrideFile] = useState(null);
  const [bridePreview, setBridePreview] = useState(null);

  // Step 2: Event Details State
  const [akad, setAkad] = useState({
    event_address: "", google_map_link: "", event_date: "", start_time: ""
  });
  const [hasResepsi, setHasResepsi] = useState(false);
  const [resepsi, setResepsi] = useState({
    event_address: "", google_map_link: "", event_date: "", start_time: ""
  });

  // Step 3: Love Stories
  const [stories, setStories] = useState([]);
  const [newStory, setNewStory] = useState({ title: "", story_date: "", description: "" });
  const [storyFile, setStoryFile] = useState(null);
  const [storyLoading, setStoryLoading] = useState(false);

  // Step 4: Moments Gallery
  const [moments, setMoments] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [momentsLoading, setMomentsLoading] = useState(false);

  // Step 5: Greetings, Music & Gifts
  const [quote, setQuote] = useState({ content: "", source: "" });
  const [blessing, setBlessing] = useState({ type: "prayer", content: "" });
  const [footerQuote, setFooterQuote] = useState({ type: "footer_quote", content: "" });
  const [music, setMusic] = useState({ title: "", artist: "", url: "", autoplay: true });
  const [gift, setGift] = useState({ title: "Titip Hadiah", message: "" });
  const [bankAccounts, setBankAccounts] = useState([]);
  const [newBank, setNewBank] = useState({ bank_name: "", account_number: "", account_holder: "", notes: "" });

  // Load draft invitation data from backend
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/invitations/${slug}`);
        const result = await response.json();

        if (response.ok && result.success) {
          const inv = result.data;
          setInvitationData(inv);
          setWeddingId(inv.id);

          // Populate step 1
          const groomData = inv.bride_groom?.find(p => p.type === "groom");
          if (groomData) {
            setGroom({
              full_name: groomData.full_name || "",
              nickname: groomData.nickname || "",
              father_name: groomData.father_name || "",
              mother_name: groomData.mother_name || "",
              address: groomData.address || "",
              instagram_username: groomData.instagram_username || "",
              photo_url: groomData.photo_url || ""
            });
            if (groomData.photo_url) setGroomPreview(`http://localhost:5000${groomData.photo_url}`);
          }

          const brideData = inv.bride_groom?.find(p => p.type === "bride");
          if (brideData) {
            setBride({
              full_name: brideData.full_name || "",
              nickname: brideData.nickname || "",
              father_name: brideData.father_name || "",
              mother_name: brideData.mother_name || "",
              address: brideData.address || "",
              instagram_username: brideData.instagram_username || "",
              photo_url: brideData.photo_url || ""
            });
            if (brideData.photo_url) setBridePreview(`http://localhost:5000${brideData.photo_url}`);
          }

          // Populate step 2
          const akadData = inv.schedules?.find(s => s.event_name === "Akad Nikah");
          if (akadData) {
            setAkad({
              event_address: akadData.event_address || "",
              google_map_link: akadData.google_map_link || "",
              event_date: akadData.event_date ? akadData.event_date.split("T")[0] : "",
              start_time: akadData.start_time || ""
            });
          }

          const resepsiData = inv.schedules?.find(s => s.event_name === "Resepsi");
          if (resepsiData) {
            setHasResepsi(true);
            setResepsi({
              event_address: resepsiData.event_address || "",
              google_map_link: resepsiData.google_map_link || "",
              event_date: resepsiData.event_date ? resepsiData.event_date.split("T")[0] : "",
              start_time: resepsiData.start_time || ""
            });
          }

          // Populate step 3
          if (inv.love_stories) setStories(inv.love_stories);

          // Populate step 4
          if (inv.moments) setMoments(inv.moments);

          // Populate step 5
          if (inv.quotes && inv.quotes.length > 0) setQuote(inv.quotes[0]);
          if (inv.blessings && inv.blessings.length > 0) {
            const prayerBlessing = inv.blessings.find(b => b.type === "prayer");
            if (prayerBlessing) setBlessing(prayerBlessing);
            const footerQuoteBlessing = inv.blessings.find(b => b.type === "footer_quote");
            if (footerQuoteBlessing) setFooterQuote(footerQuoteBlessing);
          }
          if (inv.music) setMusic(inv.music);
          if (inv.gifts && inv.gifts.length > 0) {
            setGift({ title: inv.gifts[0].title || "Titip Hadiah", message: inv.gifts[0].message || "" });
            if (inv.gifts[0].bank_accounts) setBankAccounts(inv.gifts[0].bank_accounts);
          }

          // Calculate initial max unlocked step based on database customize progress
          let initialMax = 1;
          if (groomData?.nickname || groomData?.father_name) {
            initialMax = 2;
          }
          if (initialMax >= 2 && akadData?.event_address) {
            initialMax = 5; // Akad is filled -> unlock up to step 5 since Step 3 & 4 are optional
          }
          if (initialMax >= 5 && (inv.quotes?.length > 0 || inv.blessings?.length > 0 || inv.gifts?.length > 0)) {
            initialMax = 6;
          }
          setMaxUnlockedStep(initialMax);
        } else {
          alert("Undangan tidak ditemukan.");
          navigate("/templates");
        }
      } catch (err) {
        console.error("Error loading draft", err);
        alert("Gagal terhubung dengan server.");
      } finally {
        setLoading(false);
      }
    };
    fetchDraft();
  }, [slug, navigate]);

  // Re-fetch full data to refresh the states
  const refreshData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/invitations/${slug}`);
      const result = await response.json();
      if (response.ok && result.success) {
        setInvitationData(result.data);
      }
    } catch (err) {
      console.error("Error refreshing data", err);
    }
  };

  // Handle Step 1 Save
  const handleSaveStep1 = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Groom
      const groomForm = new FormData();
      groomForm.append("full_name", groom.full_name);
      groomForm.append("nickname", groom.nickname);
      groomForm.append("father_name", groom.father_name);
      groomForm.append("mother_name", groom.mother_name);
      groomForm.append("address", groom.address);
      groomForm.append("instagram_username", groom.instagram_username);
      if (groomFile) groomForm.append("photo", groomFile);

      await fetch(`http://localhost:5000/api/invitations/${weddingId}/bride-groom/groom`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: groomForm
      });

      // 2. Bride
      const brideForm = new FormData();
      brideForm.append("full_name", bride.full_name);
      brideForm.append("nickname", bride.nickname);
      brideForm.append("father_name", bride.father_name);
      brideForm.append("mother_name", bride.mother_name);
      brideForm.append("address", bride.address);
      brideForm.append("instagram_username", bride.instagram_username);
      if (brideFile) brideForm.append("photo", brideFile);

      await fetch(`http://localhost:5000/api/invitations/${weddingId}/bride-groom/bride`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: brideForm
      });

      await refreshData();
      setActiveStep(2);
      setMaxUnlockedStep(prev => Math.max(prev, 2));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data mempelai.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Step 2 Save
  const handleSaveStep2 = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const schedules = [
        {
          event_name: "Akad Nikah",
          event_address: akad.event_address,
          google_map_link: akad.google_map_link,
          event_date: akad.event_date,
          start_time: akad.start_time
        }
      ];

      if (hasResepsi) {
        schedules.push({
          event_name: "Resepsi",
          event_address: resepsi.event_address,
          google_map_link: resepsi.google_map_link,
          event_date: resepsi.event_date,
          start_time: resepsi.start_time
        });
      }

      await fetch(`http://localhost:5000/api/invitations/${weddingId}/event-schedules`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ schedules })
      });

      await refreshData();
      setActiveStep(3);
      setMaxUnlockedStep(prev => Math.max(prev, 5)); // Step 3 & 4 are optional, unlock up to step 5
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan jadwal acara.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Step 3 Add Story
  const handleAddStory = async (e) => {
    e.preventDefault();
    if (!newStory.title || !newStory.description) {
      alert("Judul dan deskripsi cerita harus diisi");
      return;
    }
    setStoryLoading(true);
    try {
      const storyForm = new FormData();
      storyForm.append("title", newStory.title);
      storyForm.append("story_date", newStory.story_date);
      storyForm.append("description", newStory.description);
      storyForm.append("order_index", stories.length);
      if (storyFile) storyForm.append("photo", storyFile);

      const response = await fetch(`http://localhost:5000/api/invitations/${weddingId}/love-stories`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: storyForm
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setStories(prev => [...prev, result.data]);
        setNewStory({ title: "", story_date: "", description: "" });
        setStoryFile(null);
        await refreshData();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan cerita.");
    } finally {
      setStoryLoading(false);
    }
  };

  const handleDeleteStory = async (id) => {
    if (!window.confirm("Hapus cerita ini?")) return;
    try {
      await fetch(`http://localhost:5000/api/invitations/love-stories/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setStories(prev => prev.filter(s => s.id !== id));
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Step 4 Photo upload
  const handleUploadMoments = async (e) => {
    e.preventDefault();
    if (galleryFiles.length === 0) {
      alert("Pilih foto terlebih dahulu");
      return;
    }
    setMomentsLoading(true);
    try {
      const galleryForm = new FormData();
      Array.from(galleryFiles).forEach(file => {
        galleryForm.append("photos", file);
      });
      galleryForm.append("type", "gallery");

      const response = await fetch(`http://localhost:5000/api/invitations/${weddingId}/moments`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: galleryForm
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setMoments(prev => [...prev, ...result.data.map(url => ({ photo_url: url, type: "gallery" }))]);
        setGalleryFiles([]);
        await refreshData();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto.");
    } finally {
      setMomentsLoading(false);
    }
  };

  // Handle Step 5 Save
  const handleSaveStep5 = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Save Quotes
      if (quote.content) {
        await fetch(`http://localhost:5000/api/invitations/${weddingId}/quotes`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(quote)
        });
      }

      // 2. Save Blessings
      const blessingsToSave = [];
      if (blessing.content) {
        blessingsToSave.push({ type: "prayer", content: blessing.content });
      }
      if (footerQuote.content) {
        blessingsToSave.push({ type: "footer_quote", content: footerQuote.content });
      }
      if (blessingsToSave.length > 0) {
        await fetch(`http://localhost:5000/api/invitations/${weddingId}/blessings`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ blessings: blessingsToSave })
        });
      }

      // 3. Save Music
      if (music.title) {
        await fetch(`http://localhost:5000/api/invitations/${weddingId}/music`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(music)
        });
      }

      // 4. Save Gifts
      await fetch(`http://localhost:5000/api/invitations/${weddingId}/gifts`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          title: gift.title,
          message: gift.message,
          bank_accounts: bankAccounts
        })
      });

      await refreshData();
      setActiveStep(6);
      setMaxUnlockedStep(prev => Math.max(prev, 6));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data pendukung.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddBank = (e) => {
    e.preventDefault();
    if (!newBank.bank_name || !newBank.account_number || !newBank.account_holder) {
      alert("Mohon isi semua kolom rekening utama.");
      return;
    }
    setBankAccounts(prev => [...prev, newBank]);
    setNewBank({ bank_name: "", account_number: "", account_holder: "", notes: "" });
  };

  const handleDeleteBank = (index) => {
    setBankAccounts(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  // Stepper Header Links
  const steps = [
    { num: 1, label: "Mempelai" },
    { num: 2, label: "Acara" },
    { num: 3, label: "Cerita" },
    { num: 4, label: "Galeri" },
    { num: 5, label: "Detail" },
    { num: 6, label: "Aktivasi" }
  ];

  return (
    <div className="event-schedule-page page-enter">
      {/* ── STEPPER CONTROLLER ── */}
      <div className="es-progress-wrap" style={{ borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
        <div className="es-progress" style={{ maxWidth: "800px" }}>
          {steps.map((s, idx) => {
            const isUnlocked = s.num <= maxUnlockedStep;
            return (
              <React.Fragment key={s.num}>
                <div 
                  className={`es-step ${activeStep === s.num ? "active" : activeStep > s.num ? "done" : ""}`} 
                  onClick={() => {
                    if (isUnlocked) {
                      setActiveStep(s.num);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      alert(`Silakan lengkapi langkah sebelumnya terlebih dahulu.`);
                    }
                  }} 
                  style={{ 
                    cursor: isUnlocked ? "pointer" : "not-allowed",
                    opacity: isUnlocked ? 1 : 0.5
                  }}
                >
                  <div className="es-step-circle">{activeStep > s.num ? "✓" : s.num}</div>
                  <span>{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`es-step-line ${activeStep > s.num ? "done" : ""}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── CENTERED WIZARD CONTAINER ── */}
      <div className="es-content" style={{ paddingTop: "1rem" }}>
        <div className="es-card" style={{ maxWidth: "760px" }}>
          
          {/* Top-Level Preview Button (New Tab) */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
            <button
              onClick={() => window.open(`/template/amore/${slug}`, '_blank')}
              className="btn-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderColor: "var(--brand)",
                color: "var(--brand)",
                fontWeight: 700,
                fontSize: "13px",
                padding: "8px 16px"
              }}
            >
              👁 Lihat Pratinjau Undangan (Tab Baru)
            </button>
          </div>

          {/* STEP 1: BRIDE & GROOM */}
          {activeStep === 1 && (
            <form onSubmit={handleSaveStep1} className="form-section">
              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Groom (Mempelai Pria)</h2>
              
              <div className="form-group">
                <label className="es-label">Nama Lengkap</label>
                <input type="text" className="es-input" placeholder="Nama lengkap pria" value={groom.full_name} onChange={(e) => setGroom(prev => ({ ...prev, full_name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="es-label">Nama Panggilan</label>
                <input type="text" className="es-input" placeholder="Nama panggilan pria" value={groom.nickname} onChange={(e) => setGroom(prev => ({ ...prev, nickname: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="es-label">Nama Ayah</label>
                <input type="text" className="es-input" placeholder="Nama ayah pria" value={groom.father_name} onChange={(e) => setGroom(prev => ({ ...prev, father_name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="es-label">Nama Ibu</label>
                <input type="text" className="es-input" placeholder="Nama ibu pria" value={groom.mother_name} onChange={(e) => setGroom(prev => ({ ...prev, mother_name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="es-label">Instagram Username</label>
                <input type="text" className="es-input" placeholder="Username tanpa @" value={groom.instagram_username} onChange={(e) => setGroom(prev => ({ ...prev, instagram_username: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="es-label">Foto Mempelai Pria</label>
                <input type="file" className="es-input" onChange={(e) => {
                  const file = e.target.files[0];
                  setGroomFile(file);
                  if (file) setGroomPreview(URL.createObjectURL(file));
                }} />
                {groomPreview && <img src={groomPreview} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%", marginTop: "10px" }} />}
              </div>

              <div className="es-divider" />

              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Bride (Mempelai Wanita)</h2>
              <div className="form-group">
                <label className="es-label">Nama Lengkap</label>
                <input type="text" className="es-input" placeholder="Nama lengkap wanita" value={bride.full_name} onChange={(e) => setBride(prev => ({ ...prev, full_name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="es-label">Nama Panggilan</label>
                <input type="text" className="es-input" placeholder="Nama panggilan wanita" value={bride.nickname} onChange={(e) => setBride(prev => ({ ...prev, nickname: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="es-label">Nama Ayah</label>
                <input type="text" className="es-input" placeholder="Nama ayah wanita" value={bride.father_name} onChange={(e) => setBride(prev => ({ ...prev, father_name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="es-label">Nama Ibu</label>
                <input type="text" className="es-input" placeholder="Nama ibu wanita" value={bride.mother_name} onChange={(e) => setBride(prev => ({ ...prev, mother_name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="es-label">Instagram Username</label>
                <input type="text" className="es-input" placeholder="Username tanpa @" value={bride.instagram_username} onChange={(e) => setBride(prev => ({ ...prev, instagram_username: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="es-label">Foto Mempelai Wanita</label>
                <input type="file" className="es-input" onChange={(e) => {
                  const file = e.target.files[0];
                  setBrideFile(file);
                  if (file) setBridePreview(URL.createObjectURL(file));
                }} />
                {bridePreview && <img src={bridePreview} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%", marginTop: "10px" }} />}
              </div>

              <div className="es-actions">
                <button type="button" className="es-btn-back" onClick={() => navigate("/")}>Batal</button>
                <button type="submit" className="es-btn-next" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan & Lanjutkan →"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: EVENT DETAILS */}
          {activeStep === 2 && (
            <form onSubmit={handleSaveStep2} className="form-section">
              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🕌 Acara Akad Nikah</h2>
              <div className="form-group">
                <label className="es-label">Tanggal Akad</label>
                <input type="date" className="es-input" value={akad.event_date} onChange={(e) => setAddDate(e, setAkad)} required />
              </div>
              <div className="form-group">
                <label className="es-label">Jam Akad</label>
                <input type="time" className="es-input" value={akad.start_time} onChange={(e) => setAkad(prev => ({ ...prev, start_time: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="es-label">Tempat Akad / Alamat</label>
                <textarea className="es-input" placeholder="Nama Gedung / Rumah & Alamat lengkap" value={akad.event_address} onChange={(e) => setAkad(prev => ({ ...prev, event_address: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="es-label">Google Maps Link</label>
                <input type="url" className="es-input" placeholder="https://maps.google.com/..." value={akad.google_map_link} onChange={(e) => setAkad(prev => ({ ...prev, google_map_link: e.target.value }))} />
              </div>

              <div className="es-divider" />

              <div className="es-resepsi-header">
                <h2 className="es-title" style={{ fontSize: "1.5rem" }}>🥂 Acara Resepsi</h2>
                <label className="es-toggle-label" style={{ cursor: "pointer" }}>
                  <input type="checkbox" className="es-toggle-input" checked={hasResepsi} onChange={(e) => setHasResepsi(e.target.checked)} />
                  <span className="es-toggle-track"><span className="es-toggle-thumb" /></span>
                  <span className="es-toggle-text">{hasResepsi ? "Ada resepsi" : "Tanpa resepsi"}</span>
                </label>
              </div>

              {hasResepsi && (
                <div className="es-resepsi-fields page-enter" style={{ marginTop: "1rem" }}>
                  <div className="form-group">
                    <label className="es-label">Tanggal Resepsi</label>
                    <input type="date" className="es-input" value={resepsi.event_date} onChange={(e) => setAddDate(e, setResepsi)} required />
                  </div>
                  <div className="form-group">
                    <label className="es-label">Jam Resepsi</label>
                    <input type="time" className="es-input" value={resepsi.start_time} onChange={(e) => setResepsi(prev => ({ ...prev, start_time: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="es-label">Tempat Resepsi / Alamat</label>
                    <textarea className="es-input" placeholder="Nama Gedung / Alamat lengkap" value={resepsi.event_address} onChange={(e) => setResepsi(prev => ({ ...prev, event_address: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="es-label">Google Maps Link</label>
                    <input type="url" className="es-input" placeholder="https://maps.google.com/..." value={resepsi.google_map_link} onChange={(e) => setResepsi(prev => ({ ...prev, google_map_link: e.target.value }))} />
                  </div>
                </div>
              )}

              <div className="es-actions">
                <button type="button" className="es-btn-back" onClick={() => setActiveStep(1)}>← Kembali</button>
                <button type="submit" className="es-btn-next" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan & Lanjutkan →"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: LOVE STORY */}
          {activeStep === 3 && (
            <div className="form-section">
              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>💞 Perjalanan Cinta (Opsional)</h2>
              
              {/* Existing Stories List */}
              {stories.length > 0 && (
                <div className="stories-list" style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {stories.map(s => (
                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                      <div>
                        <strong style={{ fontSize: "14px", display: "block" }}>{s.title}</strong>
                        <span style={{ fontSize: "12px", color: "var(--muted)" }}>{s.story_date}</span>
                      </div>
                      <button className="auth-link" style={{ color: "#dc2626" }} onClick={() => handleDeleteStory(s.id)}>Hapus</button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleAddStory} style={{ border: "1.5px dashed rgba(181,101,42,0.3)", padding: "1.25rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>Tambah Cerita Baru</h3>
                <div className="form-group">
                  <label className="es-label">Judul Cerita</label>
                  <input type="text" className="es-input" placeholder="e.g. Pertama Kali Bertemu" value={newStory.title} onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="es-label">Tanggal / Waktu Kejadian</label>
                  <input type="text" className="es-input" placeholder="e.g. 10 Oktober 2021" value={newStory.story_date} onChange={(e) => setNewStory(prev => ({ ...prev, story_date: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="es-label">Ceritakan Kisahnya</label>
                  <textarea className="es-input" rows={3} placeholder="Ceritakan bagaimana kisahnya..." value={newStory.description} onChange={(e) => setNewStory(prev => ({ ...prev, description: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="es-label">Foto Cerita (Opsional)</label>
                  <input type="file" className="es-input" onChange={(e) => setStoryFile(e.target.files[0])} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%", padding: "10px" }} disabled={storyLoading}>
                  {storyLoading ? "Menambahkan..." : "Tambah Cerita"}
                </button>
              </form>

              <div className="es-actions">
                <button type="button" className="es-btn-back" onClick={() => setActiveStep(2)}>← Kembali</button>
                <button type="button" className="es-btn-next" onClick={() => { setActiveStep(4); setMaxUnlockedStep(prev => Math.max(prev, 4)); }}>Lanjutkan →</button>
              </div>
            </div>
          )}

          {/* STEP 4: GALLERY MOMENTS */}
          {activeStep === 4 && (
            <div className="form-section">
              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>📸 Galeri Foto (Moments)</h2>

              {/* Upload Form */}
              <form onSubmit={handleUploadMoments} style={{ marginBottom: "1.5rem" }}>
                <div className="form-group">
                  <label className="es-label">Pilih File Foto (Bisa pilih beberapa sekaligus)</label>
                  <input type="file" className="es-input" multiple onChange={(e) => setGalleryFiles(e.target.files)} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={momentsLoading}>
                  {momentsLoading ? "Mengunggah..." : "Unggah Foto ke Galeri"}
                </button>
              </form>

              {/* Current Moments Grid */}
              {moments.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "1.5rem" }}>
                  {moments.map((m, idx) => (
                    <img key={idx} src={`http://localhost:5000${m.photo_url}`} alt="Moments" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                  ))}
                </div>
              )}

              <div className="es-actions">
                <button type="button" className="es-btn-back" onClick={() => setActiveStep(3)}>← Kembali</button>
                <button type="button" className="es-btn-next" onClick={() => { setActiveStep(5); setMaxUnlockedStep(prev => Math.max(prev, 5)); }}>Lanjutkan →</button>
              </div>
            </div>
          )}

          {/* STEP 5: OTHER SETTINGS */}
          {activeStep === 5 && (
            <form onSubmit={handleSaveStep5} className="form-section">
              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>💬 Kutipan Sampul / Cover Quote</h2>
              <div className="form-group">
                <label className="es-label">Isi Kutipan Sampul</label>
                <textarea className="es-input" rows={2} placeholder="Kutipan ayat atau kata mutiara..." value={quote.content} onChange={(e) => setQuote(prev => ({ ...prev, content: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="es-label">Sumber Kutipan Sampul</label>
                <input type="text" className="es-input" placeholder="e.g. QS. Ar-Rum: 21" value={quote.source} onChange={(e) => setQuote(prev => ({ ...prev, source: e.target.value }))} />
              </div>

              <div className="es-divider" />

              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>💬 Kutipan Bawah / Footer Quote</h2>
              <div className="form-group">
                <label className="es-label">Isi Kutipan Bawah</label>
                <textarea className="es-input" rows={2} placeholder="Cinta bukan tentang berapa lama kamu menunggu, tapi tentang siapa yang membuatmu bahagia." value={footerQuote.content} onChange={(e) => setFooterQuote(prev => ({ ...prev, content: e.target.value }))} />
              </div>

              <div className="es-divider" />

              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🙏 Ucapan & Doa pembuka</h2>
              <div className="form-group">
                <label className="es-label">Pesan/Doa Pernikahan</label>
                <textarea className="es-input" rows={3} placeholder="Pesan ucapan doa untuk tamu..." value={blessing.content} onChange={(e) => setBlessing(prev => ({ ...prev, content: e.target.value }))} />
              </div>

              <div className="es-divider" />

              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🎵 Musik Latar (URL MP3)</h2>
              <div className="form-group">
                <label className="es-label">Judul Lagu</label>
                <input type="text" className="es-input" placeholder="e.g. Beautiful in White" value={music.title} onChange={(e) => setMusic(prev => ({ ...prev, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="es-label">Artis</label>
                <input type="text" className="es-input" placeholder="e.g. Shane Filan" value={music.artist} onChange={(e) => setMusic(prev => ({ ...prev, artist: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="es-label">Link File Audio (MP3 URL)</label>
                <input type="url" className="es-input" placeholder="https://example.com/song.mp3" value={music.url} onChange={(e) => setMusic(prev => ({ ...prev, url: e.target.value }))} />
              </div>

              <div className="es-divider" />

              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🎁 Hadiah Pernikahan & Rekening</h2>
              <div className="form-group">
                <label className="es-label">Pesan Hadiah / Gift Message</label>
                <textarea className="es-input" rows={2} placeholder="Pesan titip hadiah kado..." value={gift.message} onChange={(e) => setGift(prev => ({ ...prev, message: e.target.value }))} />
              </div>

              {/* Bank Accounts List */}
              {bankAccounts.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
                  {bankAccounts.map((b, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                      <span style={{ fontSize: "13px" }}>{b.bank_name} - {b.account_number} (a.n. {b.account_holder})</span>
                      <button className="auth-link" style={{ color: "#dc2626" }} onClick={() => handleDeleteBank(i)}>Hapus</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Bank Form */}
              <div style={{ border: "1px solid var(--border)", padding: "12px", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: "13px" }}>Tambah Rekening Baru</h4>
                <input type="text" className="es-input" style={{ marginBottom: "8px" }} placeholder="Nama Bank (e.g. BCA, Mandiri)" value={newBank.bank_name} onChange={(e) => setNewBank(prev => ({ ...prev, bank_name: e.target.value }))} />
                <input type="text" className="es-input" style={{ marginBottom: "8px" }} placeholder="Nomor Rekening" value={newBank.account_number} onChange={(e) => setNewBank(prev => ({ ...prev, account_number: e.target.value }))} />
                <input type="text" className="es-input" style={{ marginBottom: "8px" }} placeholder="Nama Pemilik Rekening" value={newBank.account_holder} onChange={(e) => setNewBank(prev => ({ ...prev, account_holder: e.target.value }))} />
                <button className="btn-ghost" style={{ width: "100%", padding: "8px" }} onClick={handleAddBank}>Tambah Rekening</button>
              </div>

              <div className="es-actions">
                <button type="button" className="es-btn-back" onClick={() => setActiveStep(4)}>← Kembali</button>
                <button type="submit" className="es-btn-next" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan & Lanjutkan →"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 6: REVIEW & ACTIVATE */}
          {activeStep === 6 && (
            <div className="form-section text-center">
              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🚀 Undangan Selesai Dibuat!</h2>
              <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Undangan digital Anda saat ini tersimpan sebagai **Draf**. Untuk mengaktifkan undangan agar bisa disebarkan ke tamu undangan Anda, silakan hubungi admin kami melalui WhatsApp.
              </p>

              <div style={{ background: "var(--brand-light)", padding: "1.25rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "left" }}>
                <strong style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}>Detail Undangan Anda:</strong>
                <span style={{ display: "block", fontSize: "13px", color: "var(--text)" }}>ID Undangan: #{weddingId}</span>
                <span style={{ display: "block", fontSize: "13px", color: "var(--text)" }}>Slug: {slug}</span>
                <span style={{ display: "block", fontSize: "13px", color: "var(--text)" }}>Template: {invitationData?.template_name}</span>
              </div>

              <a
                href={`https://wa.me/6282114467118?text=Halo%20Admin%2C%20saya%20ingin%20mengaktifkan%20undangan%20saya%20dengan%20ID%20${weddingId}%20dan%20slug%20${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#25d366",
                  color: "#fff",
                  padding: "14px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 800,
                  fontSize: "15px",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(37,211,102,0.3)"
                }}
              >
                💬 Aktifkan Sekarang via WhatsApp
              </a>

              <div className="es-actions">
                <button type="button" className="es-btn-back" onClick={() => setActiveStep(5)}>← Kembali</button>
                <button type="button" className="es-btn-next" onClick={() => navigate("/")}>Kembali ke Beranda</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Helper helper
  function setAddDate(e, setter) {
    setter(prev => ({ ...prev, event_date: e.target.value }));
  }
}
