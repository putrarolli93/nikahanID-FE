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

  const [defaultAvatars, setDefaultAvatars] = useState([]);
  const [groomPhotoType, setGroomPhotoType] = useState("upload");
  const [bridePhotoType, setBridePhotoType] = useState("upload");
  const [showExampleModal, setShowExampleModal] = useState(false);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const res = await fetch(`http://${window.location.hostname}:5000/api/invitations/default-avatars`);
        const json = await res.json();
        if (res.ok && json.success) {
          setDefaultAvatars(json.data);
        }
      } catch (err) {
        console.error("Error fetching avatars:", err);
      }
    };
    fetchAvatars();
  }, []);

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
  const [defaultMusicList, setDefaultMusicList] = useState([]);
  const [defaultBlessingsList, setDefaultBlessingsList] = useState([]);
  const [defaultQuotesList, setDefaultQuotesList] = useState([]);
  const [defaultCoverQuotesList, setDefaultCoverQuotesList] = useState([]);
  const [blessingDropdownOpen, setBlessingDropdownOpen] = useState(false);
  const [quoteDropdownOpen, setQuoteDropdownOpen] = useState(false);
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false);
  const [coverQuoteDropdownOpen, setCoverQuoteDropdownOpen] = useState(false);
  const [gift, setGift] = useState({ title: "Titip Hadiah", message: "", shipping_address: "" });
  const [bankAccounts, setBankAccounts] = useState([]);
  const [newBank, setNewBank] = useState({ bank_name: "", account_number: "", account_holder: "", notes: "" });

  // Load semua default list sekaligus
  useEffect(() => {
    const BASE = `http://${window.location.hostname}:5000/api/invitations`;
    const load = (path, setter) =>
      fetch(`${BASE}/${path}`).then(r => r.json()).then(res => { if (res.success) setter(res.data); }).catch(() => {});
    load('default-music', setDefaultMusicList);
    load('default-blessings', setDefaultBlessingsList);
    load('default-quotes', setDefaultQuotesList);
    load('default-cover-quotes', setDefaultCoverQuotesList);
  }, []);

  // Load draft invitation data from backend
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:5000/api/invitations/${slug}`);
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
            if (groomData.photo_url) {
              setGroomPreview(`http://${window.location.hostname}:5000${groomData.photo_url}`);
              if (groomData.photo_url.startsWith("/uploads/default_avatars/")) {
                setGroomPhotoType("avatar");
              }
            }
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
            if (brideData.photo_url) {
              setBridePreview(`http://${window.location.hostname}:5000${brideData.photo_url}`);
              if (brideData.photo_url.startsWith("/uploads/default_avatars/")) {
                setBridePhotoType("avatar");
              }
            }
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
            setGift({
              title: inv.gifts[0].title || "Titip Hadiah",
              message: inv.gifts[0].message || "",
              shipping_address: inv.gifts[0].shipping_address || ""
            });
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
      const response = await fetch(`http://${window.location.hostname}:5000/api/invitations/${slug}`);
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
      if (groomPhotoType === "upload" && groomFile) {
        groomForm.append("photo", groomFile);
      } else if (groomPhotoType === "avatar" && groom.photo_url) {
        groomForm.append("photo_url", groom.photo_url);
      }

      await fetch(`http://${window.location.hostname}:5000/api/invitations/${weddingId}/bride-groom/groom`, {
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
      if (bridePhotoType === "upload" && brideFile) {
        brideForm.append("photo", brideFile);
      } else if (bridePhotoType === "avatar" && bride.photo_url) {
        brideForm.append("photo_url", bride.photo_url);
      }

      await fetch(`http://${window.location.hostname}:5000/api/invitations/${weddingId}/bride-groom/bride`, {
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

      await fetch(`http://${window.location.hostname}:5000/api/invitations/${weddingId}/event-schedules`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ schedules })
      });

      await refreshData();
      setActiveStep(isFree ? 5 : 3);
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

      const response = await fetch(`http://${window.location.hostname}:5000/api/invitations/${weddingId}/love-stories`, {
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
      await fetch(`http://${window.location.hostname}:5000/api/invitations/love-stories/${id}`, {
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

      const response = await fetch(`http://${window.location.hostname}:5000/api/invitations/${weddingId}/moments`, {
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
        await fetch(`http://${window.location.hostname}:5000/api/invitations/${weddingId}/quotes`, {
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
        await fetch(`http://${window.location.hostname}:5000/api/invitations/${weddingId}/blessings`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ blessings: blessingsToSave })
        });
      }

      // 3. Save Music (only if not free)
      if (!isFree && music.title) {
        await fetch(`http://${window.location.hostname}:5000/api/invitations/${weddingId}/music`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(music)
        });
      }

      // 4. Save Gifts (only if not free)
      if (!isFree) {
        await fetch(`http://${window.location.hostname}:5000/api/invitations/${weddingId}/gifts`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({
            title: gift.title,
            message: gift.message,
            shipping_address: gift.shipping_address,
            bank_accounts: bankAccounts
          })
        });
      }

      await refreshData();
      
      if (isFree) {
        // Activate free template immediately
        await fetch(`http://${window.location.hostname}:5000/api/invitations/${weddingId}/activate-free`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
        alert("Undangan gratis berhasil diaktifkan!");
        navigate("/dashboard");
      } else {
        setActiveStep(6);
        setMaxUnlockedStep(prev => Math.max(prev, 6));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
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

  const isFree = invitationData?.template_is_premium === 0;

  // Stepper Header Links
  let steps = [
    { num: 1, label: "Mempelai" },
    { num: 2, label: "Acara" },
    { num: 3, label: "Cerita" },
    { num: 4, label: "Galeri" },
    { num: 5, label: "Detail" },
    { num: 6, label: "Aktivasi" }
  ];

  if (isFree) {
    steps = [
      { num: 1, label: "Mempelai" },
      { num: 2, label: "Acara" },
      { num: 5, label: "Selesai" } // Reusing step 5 for basic details
    ];
  }

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
              onClick={() => window.open(`/template/${invitationData?.template_slug || 'amore'}/${slug}`, '_blank')}
              className="btn-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderColor: "var(--brand)",
                color: "var(--brand)",
                fontWeight: 700,
                fontSize: "13px",
                padding: "8px 18px",
                borderRadius: "20px",
                background: "rgba(181, 101, 42, 0.04)",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "var(--brand)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(181, 101, 42, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(181, 101, 42, 0.04)";
                e.currentTarget.style.color = "var(--brand)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <i className="ti ti-search" style={{ fontSize: "16px" }}></i>
              Lihat Pratinjau Undangan
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
                <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setGroomPhotoType("upload")}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid " + (groomPhotoType === "upload" ? "var(--brand)" : "var(--border)"),
                      background: groomPhotoType === "upload" ? "var(--brand)" : "rgba(255,255,255,0.02)",
                      color: groomPhotoType === "upload" ? "#fff" : "var(--text)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <i className="ti ti-upload" style={{ fontSize: "14px" }}></i>
                    Unggah Foto Sendiri
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroomPhotoType("avatar")}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid " + (groomPhotoType === "avatar" ? "var(--brand)" : "var(--border)"),
                      background: groomPhotoType === "avatar" ? "var(--brand)" : "rgba(255,255,255,0.02)",
                      color: groomPhotoType === "avatar" ? "#fff" : "var(--text)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <i className="ti ti-user" style={{ fontSize: "14px" }}></i>
                    Pilih Avatar
                  </button>
                </div>

                {groomPhotoType === "upload" ? (
                  <input type="file" className="es-input" onChange={(e) => {
                    const file = e.target.files[0];
                    setGroomFile(file);
                    if (file) setGroomPreview(URL.createObjectURL(file));
                  }} />
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: "10px", background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                    {defaultAvatars.filter(av => av.gender === "groom").map(av => (
                      <div
                        key={av.id}
                        onClick={() => {
                          setGroomFile(null);
                          setGroom(prev => ({ ...prev, photo_url: av.photo_url }));
                          setGroomPreview(`http://${window.location.hostname}:5000${av.photo_url}`);
                        }}
                        style={{
                          cursor: "pointer",
                          textAlign: "center",
                          padding: "6px",
                          borderRadius: "var(--radius-sm)",
                          border: groom.photo_url === av.photo_url ? "2px solid var(--brand)" : "2px solid transparent",
                          background: groom.photo_url === av.photo_url ? "rgba(181,101,42,0.15)" : "transparent",
                          transition: "all 0.2s"
                        }}
                      >
                        <img
                          src={`http://${window.location.hostname}:5000${av.photo_url}`}
                          alt={av.name}
                          style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "50%" }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {groomPreview && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <img src={groomPreview} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%" }} />
                    <span style={{ fontSize: "12px", color: "var(--text-light)" }}>Pratinjau Foto Mempelai Pria</span>
                  </div>
                )}
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
                <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setBridePhotoType("upload")}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid " + (bridePhotoType === "upload" ? "var(--brand)" : "var(--border)"),
                      background: bridePhotoType === "upload" ? "var(--brand)" : "rgba(255,255,255,0.02)",
                      color: bridePhotoType === "upload" ? "#fff" : "var(--text)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <i className="ti ti-upload" style={{ fontSize: "14px" }}></i>
                    Unggah Foto Sendiri
                  </button>
                  <button
                    type="button"
                    onClick={() => setBridePhotoType("avatar")}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid " + (bridePhotoType === "avatar" ? "var(--brand)" : "var(--border)"),
                      background: bridePhotoType === "avatar" ? "var(--brand)" : "rgba(255,255,255,0.02)",
                      color: bridePhotoType === "avatar" ? "#fff" : "var(--text)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <i className="ti ti-user" style={{ fontSize: "14px" }}></i>
                    Pilih Avatar
                  </button>
                </div>

                {bridePhotoType === "upload" ? (
                  <input type="file" className="es-input" onChange={(e) => {
                    const file = e.target.files[0];
                    setBrideFile(file);
                    if (file) setBridePreview(URL.createObjectURL(file));
                  }} />
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: "10px", background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                    {defaultAvatars.filter(av => av.gender === "bride").map(av => (
                      <div
                        key={av.id}
                        onClick={() => {
                          setBrideFile(null);
                          setBride(prev => ({ ...prev, photo_url: av.photo_url }));
                          setBridePreview(`http://${window.location.hostname}:5000${av.photo_url}`);
                        }}
                        style={{
                          cursor: "pointer",
                          textAlign: "center",
                          padding: "6px",
                          borderRadius: "var(--radius-sm)",
                          border: bride.photo_url === av.photo_url ? "2px solid var(--brand)" : "2px solid transparent",
                          background: bride.photo_url === av.photo_url ? "rgba(181,101,42,0.15)" : "transparent",
                          transition: "all 0.2s"
                        }}
                      >
                        <img
                          src={`http://${window.location.hostname}:5000${av.photo_url}`}
                          alt={av.name}
                          style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "50%" }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {bridePreview && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <img src={bridePreview} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%" }} />
                    <span style={{ fontSize: "12px", color: "var(--text-light)" }}>Pratinjau Foto Mempelai Wanita</span>
                  </div>
                )}
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "10px" }}>
                <h2 className="es-title" style={{ fontSize: "1.5rem", margin: 0 }}>💞 Perjalanan Cinta (Opsional)</h2>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowExampleModal(true)}
                  style={{
                    fontSize: "12px",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    borderColor: "var(--brand)",
                    color: "var(--brand)",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(181, 101, 42, 0.02)",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "var(--brand)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(181, 101, 42, 0.02)";
                    e.currentTarget.style.color = "var(--brand)";
                  }}
                >
                  <i className="ti ti-info-circle" style={{ fontSize: "14px" }}></i>
                  Lihat Contoh
                </button>
              </div>

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
                    <img key={idx} src={`http://${window.location.hostname}:5000${m.photo_url}`} alt="Moments" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
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
              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>💬 Kutipan Sampul / Cover Quote</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted, #aaa)", marginBottom: "0.8rem" }}>Pilih dari template atau tulis sendiri.</p>
              <div className="form-group">
                {defaultCoverQuotesList.length > 0 && (
                  <div style={{ position: "relative", marginBottom: "10px" }}>
                    <button
                      type="button"
                      onClick={() => { setCoverQuoteDropdownOpen(o => !o); setBlessingDropdownOpen(false); setQuoteDropdownOpen(false); setMusicDropdownOpen(false); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                        color: quote.content ? "var(--primary, #c9a96e)" : "var(--text-muted, #aaa)",
                        fontSize: "0.85rem", fontWeight: 500, textAlign: "left", gap: "8px"
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {quote.content
                          ? `✓ ${quote.content.slice(0, 55)}${quote.content.length > 55 ? "..." : ""}`
                          : "📋 Pilih dari template kutipan sampul..."}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: coverQuoteDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {coverQuoteDropdownOpen && (
                      <div style={{
                        position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
                        background: "#fff", border: "1.5px solid var(--border, #e5e4e7)",
                        borderRadius: "10px", overflow: "hidden", boxShadow: "0 8px 32px rgba(181,101,42,0.12)",
                        maxHeight: "280px", overflowY: "auto"
                      }}>
                        {defaultCoverQuotesList.map((q, idx) => {
                          const isSelected = quote.content === q.content;
                          return (
                            <div key={q.id}
                              onClick={() => { setQuote({ content: q.content, source: q.source || "" }); setCoverQuoteDropdownOpen(false); }}
                              style={{
                                padding: "12px 14px", cursor: "pointer",
                                background: isSelected ? "rgba(181,101,42,0.08)" : "transparent",
                                borderBottom: idx < defaultCoverQuotesList.length - 1 ? "1px solid var(--border, #e5e4e7)" : "none",
                                transition: "background 0.1s"
                              }}
                              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(181,101,42,0.04)"; }}
                              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                            >
                              <div style={{ fontSize: "0.82rem", color: isSelected ? "var(--brand, #b5652a)" : "var(--dark, #1a1208)", lineHeight: 1.55 }}>
                                "{q.content}"
                              </div>
                              {q.source && <div style={{ fontSize: "0.7rem", color: "var(--muted, #888)", marginTop: "3px" }}>— {q.source}</div>}
                              {isSelected && <div style={{ fontSize: "0.68rem", color: "var(--brand, #b5652a)", marginTop: "4px", fontWeight: 600 }}>✓ Terpilih</div>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                <label className="es-label">Isi Kutipan Sampul</label>
                <textarea className="es-input" rows={2} placeholder="Kutipan ayat atau kata mutiara..." value={quote.content} onChange={(e) => setQuote(prev => ({ ...prev, content: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="es-label">Sumber Kutipan Sampul</label>
                <input type="text" className="es-input" placeholder="e.g. QS. Ar-Rum: 21" value={quote.source} onChange={(e) => setQuote(prev => ({ ...prev, source: e.target.value }))} />
              </div>

              <div className="es-divider" />

              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>💬 Kutipan Bawah / Footer Quote</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted, #aaa)", marginBottom: "0.8rem" }}>Pilih dari template atau tulis sendiri.</p>
              <div className="form-group">
                {defaultQuotesList.length > 0 && (
                  <div style={{ position: "relative", marginBottom: "10px" }}>
                    <button
                      type="button"
                      onClick={() => { setQuoteDropdownOpen(o => !o); setBlessingDropdownOpen(false); setMusicDropdownOpen(false); setCoverQuoteDropdownOpen(false); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                        color: footerQuote.content ? "var(--primary, #c9a96e)" : "var(--text-muted, #aaa)",
                        fontSize: "0.85rem", fontWeight: 500, textAlign: "left", gap: "8px"
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {footerQuote.content
                          ? `✓ ${footerQuote.content.slice(0, 55)}${footerQuote.content.length > 55 ? "..." : ""}`
                          : "📋 Pilih dari template kutipan..."}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: quoteDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {quoteDropdownOpen && (
                      <div style={{
                        position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
                        background: "#fff", border: "1.5px solid var(--border, #e5e4e7)",
                        borderRadius: "10px", overflow: "hidden", boxShadow: "0 8px 32px rgba(181,101,42,0.12)"
                      }}>
                        {defaultQuotesList.map((q, idx) => {
                          const isSelected = footerQuote.content === q.content;
                          return (
                            <div key={q.id}
                              onClick={() => { setFooterQuote(prev => ({ ...prev, content: q.content })); setQuoteDropdownOpen(false); }}
                              style={{
                                padding: "12px 14px", cursor: "pointer",
                                background: isSelected ? "rgba(181,101,42,0.08)" : "transparent",
                                borderBottom: idx < defaultQuotesList.length - 1 ? "1px solid var(--border, #e5e4e7)" : "none",
                                transition: "background 0.1s"
                              }}
                              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(181,101,42,0.04)"; }}
                              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                            >
                              <div style={{ fontSize: "0.82rem", color: isSelected ? "var(--brand, #b5652a)" : "var(--dark, #1a1208)", lineHeight: 1.55 }}>
                                "{q.content}"
                              </div>
                              {q.source && <div style={{ fontSize: "0.7rem", color: "var(--muted, #888)", marginTop: "3px" }}>— {q.source}</div>}
                              {isSelected && <div style={{ fontSize: "0.68rem", color: "var(--brand, #b5652a)", marginTop: "4px", fontWeight: 600 }}>✓ Terpilih</div>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                <label className="es-label">Atau tulis sendiri</label>
                <textarea className="es-input" rows={2} placeholder="Cinta bukan tentang berapa lama kamu menunggu..." value={footerQuote.content} onChange={(e) => setFooterQuote(prev => ({ ...prev, content: e.target.value }))} />
              </div>

              <div className="es-divider" />

              <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>🙏 Ucapan & Doa Pembuka</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted, #aaa)", marginBottom: "0.8rem" }}>Pilih dari template atau tulis sendiri.</p>
              <div className="form-group">
                {defaultBlessingsList.length > 0 && (
                  <div style={{ position: "relative", marginBottom: "10px" }}>
                    <button
                      type="button"
                      onClick={() => { setBlessingDropdownOpen(o => !o); setQuoteDropdownOpen(false); setMusicDropdownOpen(false); setCoverQuoteDropdownOpen(false); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                        color: blessing.content ? "var(--primary, #c9a96e)" : "var(--text-muted, #aaa)",
                        fontSize: "0.85rem", fontWeight: 500, textAlign: "left", gap: "8px"
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {blessing.content
                          ? `✓ ${blessing.content.slice(0, 55)}${blessing.content.length > 55 ? "..." : ""}`
                          : "📋 Pilih dari template ucapan & doa..."}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: blessingDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {blessingDropdownOpen && (
                      <div style={{
                        position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
                        background: "#fff", border: "1.5px solid var(--border, #e5e4e7)",
                        borderRadius: "10px", overflow: "hidden", boxShadow: "0 8px 32px rgba(181,101,42,0.12)",
                        maxHeight: "280px", overflowY: "auto"
                      }}>
                        {defaultBlessingsList.map((b, idx) => {
                          const isSelected = blessing.content === b.content;
                          return (
                            <div key={b.id}
                              onClick={() => { setBlessing(prev => ({ ...prev, content: b.content })); setBlessingDropdownOpen(false); }}
                              style={{
                                padding: "12px 14px", cursor: "pointer",
                                background: isSelected ? "rgba(181,101,42,0.08)" : "transparent",
                                borderBottom: idx < defaultBlessingsList.length - 1 ? "1px solid var(--border, #e5e4e7)" : "none",
                                transition: "background 0.1s"
                              }}
                              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(181,101,42,0.04)"; }}
                              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                            >
                              <div style={{ fontSize: "0.82rem", color: isSelected ? "var(--brand, #b5652a)" : "var(--dark, #1a1208)", lineHeight: 1.55 }}>
                                {b.content}
                              </div>
                              {isSelected && <div style={{ fontSize: "0.68rem", color: "var(--brand, #b5652a)", marginTop: "4px", fontWeight: 600 }}>✓ Terpilih</div>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                <label className="es-label">Atau tulis sendiri</label>
                <textarea className="es-input" rows={3} placeholder="Pesan ucapan doa untuk tamu..." value={blessing.content} onChange={(e) => setBlessing(prev => ({ ...prev, content: e.target.value }))} />
              </div>

              <div className="es-divider" />

              {!isFree && (
                <>
                  <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🎵 Musik Latar</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted, #aaa)", marginBottom: "1rem" }}>
                Pilih lagu latar untuk undangan kamu, atau lewati jika tidak ingin menggunakan musik.
              </p>

              <div className="form-group">
                {defaultMusicList.length > 0 && (
                  <div style={{ position: "relative", marginBottom: "10px" }}>
                    <button
                      type="button"
                      onClick={() => { setMusicDropdownOpen(o => !o); setBlessingDropdownOpen(false); setQuoteDropdownOpen(false); setCoverQuoteDropdownOpen(false); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                        color: music.url ? "var(--primary, #c9a96e)" : "var(--text-muted, #aaa)",
                        fontSize: "0.85rem", fontWeight: 500, textAlign: "left", gap: "8px"
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {music.url
                          ? `✓ ${music.title}${music.artist ? ` - ${music.artist}` : ""}`
                          : "🔇 Tanpa Musik"}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: musicDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {musicDropdownOpen && (
                      <div style={{
                        position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
                        background: "#fff", border: "1.5px solid var(--border, #e5e4e7)",
                        borderRadius: "10px", overflow: "hidden", boxShadow: "0 8px 32px rgba(181,101,42,0.12)",
                        maxHeight: "280px", overflowY: "auto"
                      }}>
                        {/* Opsi Tanpa Musik */}
                        <div
                          onClick={() => { setMusic({ title: "", artist: "", url: "", autoplay: true }); setMusicDropdownOpen(false); }}
                          style={{
                            padding: "12px 14px", cursor: "pointer",
                            background: !music.url ? "rgba(181,101,42,0.08)" : "transparent",
                            borderBottom: "1px solid var(--border, #e5e4e7)",
                            transition: "background 0.1s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                          onMouseEnter={e => { if (music.url) e.currentTarget.style.background = "rgba(181,101,42,0.04)"; }}
                          onMouseLeave={e => { if (music.url) e.currentTarget.style.background = "transparent"; }}
                        >
                          <div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: !music.url ? "var(--brand, #b5652a)" : "var(--dark, #1a1208)" }}>
                              🔇 Tanpa Musik
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted, #888)", marginTop: "2px" }}>
                              Tidak menggunakan musik latar
                            </div>
                          </div>
                          {!music.url && <div style={{ fontSize: "0.68rem", color: "var(--brand, #b5652a)", fontWeight: 600 }}>✓ Terpilih</div>}
                        </div>

                        {/* List Lagu */}
                        {defaultMusicList.map((song, idx) => {
                          const songUrl = `http://${window.location.hostname}:5000${song.url}`;
                          const isSelected = music.url === songUrl;
                          return (
                            <div key={song.id}
                              onClick={() => { setMusic({ title: song.title, artist: song.artist || "", url: songUrl, autoplay: true }); setMusicDropdownOpen(false); }}
                              style={{
                                padding: "12px 14px", cursor: "pointer",
                                background: isSelected ? "rgba(181,101,42,0.08)" : "transparent",
                                borderBottom: idx < defaultMusicList.length - 1 ? "1px solid var(--border, #e5e4e7)" : "none",
                                transition: "background 0.1s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                              }}
                              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(181,101,42,0.04)"; }}
                              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                            >
                              <div>
                                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: isSelected ? "var(--brand, #b5652a)" : "var(--dark, #1a1208)" }}>
                                  🎵 {song.title}
                                </div>
                                {song.artist && (
                                  <div style={{ fontSize: "0.72rem", color: "var(--muted, #888)", marginTop: "2px" }}>
                                    {song.artist}
                                  </div>
                                )}
                              </div>
                              {isSelected && <div style={{ fontSize: "0.68rem", color: "var(--brand, #b5652a)", fontWeight: 600 }}>✓ Terpilih</div>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}



                    {music.url && (
                      <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: "10px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--primary, #c9a96e)", marginBottom: "8px", fontWeight: 600 }}>
                          🎵 Preview: {music.title}
                        </div>
                        <audio key={music.url} controls src={music.url} style={{ width: "100%", borderRadius: "6px", height: "36px" }} />
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="es-divider" />

              {!isFree && (
                <>
                  <h2 className="es-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🎁 Hadiah Pernikahan & Rekening (Opsional)</h2>
                  <div className="form-group">
                    <label className="es-label">Pesan Hadiah / Gift Message</label>
                    <select
                      className="es-input"
                      style={{ marginBottom: "8px", background: "rgba(255,255,255,0.02)", color: "var(--text)" }}
                      onChange={(e) => {
                        if (e.target.value) {
                          setGift(prev => ({ ...prev, message: e.target.value }));
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>-- Pilih Contoh Template Pesan (Opsional) --</option>
                      <option value="Terima kasih telah menambah semangat kegembiraan pernikahan kami dengan kehadiran dan hadiah indah Anda.">
                        Template 1: Terima kasih telah menambah semangat kegembiraan pernikahan kami...
                      </option>
                      <option value="Doa Restu Anda merupakan karunia yang sangat berarti bagi kami.">
                        Template 2: Doa Restu Anda merupakan karunia yang sangat berarti bagi kami.
                      </option>
                    </select>
                    <textarea className="es-input" rows={3} placeholder="Atau ketik pesan custom..." value={gift.message} onChange={(e) => setGift(prev => ({ ...prev, message: e.target.value }))} />
                  </div>

                  <div className="form-group">
                    <label className="es-label">Alamat Pengiriman Kado Fisik</label>
                    <textarea className="es-input" rows={3} placeholder="Alamat lengkap penerima kado..." value={gift.shipping_address} onChange={(e) => setGift(prev => ({ ...prev, shipping_address: e.target.value }))} />
                  </div>

                  <div className="form-group">
                    <label className="es-label">Daftar Rekening / E-Wallet</label>
                    {bankAccounts.length > 0 && (
                      <div style={{ marginBottom: "12px", background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px" }}>
                        {bankAccounts.map((b, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "6px" }}>
                            <div>
                              <strong style={{ color: "var(--brand)" }}>{b.bank_name}</strong><br />
                              {b.account_number} a/n {b.account_holder}
                            </div>
                            <button type="button" onClick={() => handleDeleteBank(idx)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Hapus</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <input type="text" className="es-input" style={{ marginBottom: "8px" }} placeholder="Nama Bank / E-Wallet (misal: BCA, OVO)" value={newBank.bank_name} onChange={(e) => setNewBank(prev => ({ ...prev, bank_name: e.target.value }))} />
                      <input type="text" className="es-input" style={{ marginBottom: "8px" }} placeholder="Nomor Rekening" value={newBank.account_number} onChange={(e) => setNewBank(prev => ({ ...prev, account_number: e.target.value }))} />
                      <input type="text" className="es-input" style={{ marginBottom: "8px" }} placeholder="Nama Pemilik Rekening" value={newBank.account_holder} onChange={(e) => setNewBank(prev => ({ ...prev, account_holder: e.target.value }))} />
                      <button type="button" className="btn-ghost" style={{ width: "100%", padding: "8px" }} onClick={handleAddBank}>Tambah Rekening</button>
                    </div>
                  </div>
                </>
              )}

              <div className="es-actions">
                <button type="button" className="es-btn-back" onClick={() => setActiveStep(isFree ? 2 : 4)}>← Kembali</button>
                <button type="submit" className="es-btn-next" disabled={saving}>
                  {saving ? "Menyimpan..." : (isFree ? "Selesai & Aktifkan →" : "Simpan & Lanjutkan →")}
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

              <button
                type="button"
                onClick={() => navigate(`/activate/${slug}`, { state: { inv: invitationData } })}
                className="btn-solid"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  background: "#22c55e",
                  color: "#fff",
                  padding: "14px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 800,
                  fontSize: "15px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(34,197,94,0.3)"
                }}
              >
                🚀 Aktifkan Undangan
              </button>

              <div className="es-actions">
                <button type="button" className="es-btn-back" onClick={() => setActiveStep(5)}>← Kembali</button>
                <button type="button" className="es-btn-next" onClick={() => navigate("/")}>Kembali ke Beranda</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SAMPLE TIMELINE MODAL ── */}
      {showExampleModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          padding: "20px"
        }} className="page-enter">
          <div style={{
            background: "#1c1208", // match Amore background theme
            color: "#e8ddd0",
            maxWidth: "600px",
            width: "100%",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(181, 101, 42, 0.3)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(181, 101, 42, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em", color: "#e4a35a", fontFamily: "'Playfair Display', serif" }}>
                Contoh Perjalanan Cinta (Timeline)
              </h3>
              <button
                type="button"
                onClick={() => setShowExampleModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#e8ddd0",
                  cursor: "pointer",
                  fontSize: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  opacity: 0.7,
                  transition: "opacity 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
              >
                &times;
              </button>
            </div>

            {/* Modal Content (Timeline scrollable) */}
            <div style={{
              padding: "20px",
              overflowY: "auto",
              flex: 1
            }}>
              <p style={{ fontSize: "13px", color: "rgba(232, 221, 208, 0.7)", marginBottom: "20px", lineHeight: 1.6 }}>
                Berikut adalah contoh alur cerita yang runut dari Pertama Ketemu, Kenalan, Lamaran, hingga Pernikahan untuk mempercantik undangan Anda:
              </p>

              {/* Replica timeline of Amore style */}
              <div style={{
                position: "relative",
                paddingLeft: "24px",
                borderLeft: "2px solid rgba(181, 101, 42, 0.25)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                margin: "10px 0"
              }}>
                {[
                  {
                    date: "10 Januari 2020",
                    title: "Pertama Ketemu",
                    desc: "Secara tidak sengaja kami berpapasan di sebuah kedai kopi. Tatapan singkat yang menumbuhkan rasa penasaran untuk saling mengenal lebih dalam.",
                    img: "/images/timeline_meet.png"
                  },
                  {
                    date: "15 Februari 2020",
                    title: "Kenalan Lebih Dekat",
                    desc: "Setelah bertukar kontak, kami mulai rutin berkomunikasi. Menemukan banyak kecocokan, hobi yang sama, serta visi masa depan yang saling melengkapi.",
                    img: "/images/timeline_know.png"
                  },
                  {
                    date: "25 Desember 2024",
                    title: "Momen Lamaran (Proposal)",
                    desc: "Dengan restu tulus dari kedua keluarga besar, kami memantapkan hati untuk mengikat komitmen suci kami menuju jenjang pernikahan.",
                    img: "/images/timeline_proposal.png"
                  },
                  {
                    date: "20 Juni 2025",
                    title: "Hari Pernikahan (Akad & Resepsi)",
                    desc: "Hari bersejarah di mana kami mengucapkan janji suci di hadapan Allah SWT untuk saling menyayangi, membimbing, dan menjaga selamanya.",
                    img: "/images/timeline_wedding.png"
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    {/* timeline node badge */}
                    <div style={{
                      position: "absolute",
                      left: "-31px",
                      top: "2px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#b5652a",
                      border: "2px solid #1c1208",
                      boxShadow: "0 0 0 3px rgba(181, 101, 42, 0.25)"
                    }} />

                    {/* timeline node content */}
                    <div>
                      <span style={{ fontSize: "11px", color: "#e4a35a", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {item.date}
                      </span>
                      <h4 style={{ margin: "4px 0 8px", fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                        {item.title}
                      </h4>
                      {item.img && (
                        <div style={{
                          width: "100%",
                          maxHeight: "150px",
                          overflow: "hidden",
                          borderRadius: "6px",
                          border: "1px solid rgba(181, 101, 42, 0.2)",
                          marginBottom: "8px",
                          background: "#000"
                        }}>
                          <img
                            src={item.img}
                            alt={item.title}
                            style={{ width: "100%", height: "150px", objectFit: "cover" }}
                          />
                        </div>
                      )}
                      <p style={{ margin: 0, fontSize: "12.5px", color: "rgba(232, 221, 208, 0.8)", lineHeight: 1.6 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "12px 20px",
              borderTop: "1px solid rgba(181, 101, 42, 0.15)",
              display: "flex",
              justifyContent: "flex-end"
            }}>
              <button
                type="button"
                className="btn-solid"
                onClick={() => setShowExampleModal(false)}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  borderRadius: "6px",
                  background: "#b5652a",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700
                }}
              >
                Tutup Contoh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper helper
  function setAddDate(e, setter) {
    setter(prev => ({ ...prev, event_date: e.target.value }));
  }
}
