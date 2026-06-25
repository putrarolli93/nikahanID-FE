import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EventSchedulePage() {
  const { templateSlug } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    groomName: "",
    brideName: "",
    slug: "",
    akadDate: "",
    akadTime: "",
    hasResepsi: false,
    resepsiDate: "",
    resepsiTime: "",
  });

  const [errors, setErrors] = useState({});
  const [apiLoading, setApiLoading] = useState(false);
  const [slugStatus, setSlugStatus] = useState("idle"); // idle, checking, available, unavailable
  const [slugMessage, setSlugMessage] = useState("");

  // Load pending data if exists
  useEffect(() => {
    const pendingData = sessionStorage.getItem("pending_wedding_create");
    if (pendingData) {
      try {
        const parsed = JSON.parse(pendingData);
        if (parsed.templateSlug === templateSlug && parsed.form) {
          setForm(parsed.form);
        }
      } catch (err) {
        console.error("Error parsing pending data", err);
      }
    }
  }, [templateSlug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const newForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        ...(name === "hasResepsi" && !checked
          ? { resepsiDate: "", resepsiTime: "" }
          : {}),
      };
      
      // Auto-generate slug if groom or bride name changes
      if (name === "groomName" || name === "brideName") {
        const groom = name === "groomName" ? value : prev.groomName;
        const bride = name === "brideName" ? value : prev.brideName;
        if (groom || bride) {
          const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
          let baseSlug = '';
          if (groom && bride) baseSlug = `${slugify(groom)}-dan-${slugify(bride)}`;
          else if (groom) baseSlug = slugify(groom);
          else if (bride) baseSlug = slugify(bride);
          newForm.slug = baseSlug;
        } else {
          newForm.slug = "";
        }
      }

      // If user types custom slug, format it
      if (name === "slug") {
        newForm.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      }

      return newForm;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Check slug availability
  useEffect(() => {
    if (!form.slug) {
      setSlugStatus("idle");
      setSlugMessage("");
      return;
    }

    const checkTimeout = setTimeout(async () => {
      setSlugStatus("checking");
      try {
        const res = await fetch(`http://${window.location.hostname}:5000/api/invitations/check-slug/${form.slug}`);
        if (res.ok) {
          setSlugStatus("available");
          setSlugMessage("Tersedia");
        } else {
          setSlugStatus("unavailable");
          setSlugMessage("Sudah digunakan");
        }
      } catch (err) {
        setSlugStatus("idle");
        setSlugMessage("");
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(checkTimeout);
  }, [form.slug]);

  const validate = () => {
    const newErrors = {};
    if (!form.groomName.trim()) newErrors.groomName = "Nama mempelai pria wajib diisi.";
    if (!form.brideName.trim()) newErrors.brideName = "Nama mempelai wanita wajib diisi.";
    if (!form.slug.trim()) newErrors.slug = "Link undangan wajib diisi.";
    if (slugStatus === "checking") newErrors.slug = "Sedang mengecek ketersediaan link...";
    if (slugStatus === "unavailable") newErrors.slug = "Link undangan sudah digunakan, silakan ganti.";
    if (!form.akadDate) newErrors.akadDate = "Tanggal akad wajib diisi.";
    if (!form.akadTime) newErrors.akadTime = "Jam akad wajib diisi.";
    if (form.hasResepsi) {
      if (!form.resepsiDate) newErrors.resepsiDate = "Tanggal resepsi wajib diisi jika diaktifkan.";
      if (!form.resepsiTime) newErrors.resepsiTime = "Jam resepsi wajib diisi jika diaktifkan.";
    }
    return newErrors;
  };

  const handleNext = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save pending form state
    sessionStorage.setItem("pending_wedding_create", JSON.stringify({ templateSlug, form }));

    if (!user) {
      // User is not logged in, redirect to login page first
      navigate("/login?redirect=create-draft");
      return;
    }

    // Create Draft invitation
    setApiLoading(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          templateSlug,
          ...form
        })
      });

      const result = await response.json();
      setApiLoading(false);

      if (response.ok && result.success) {
        // Clear pending session data on success
        sessionStorage.removeItem("pending_wedding_create");
        navigate(`/create-wizard/${result.data.slug}`);
      } else {
        alert(result.message || "Gagal membuat draf undangan");
      }
    } catch (error) {
      console.error("Error creating draft", error);
      setApiLoading(false);
      alert("Koneksi internet bermasalah. Gagal membuat draf.");
    }
  };

  const handleBack = () => {
    navigate(`/templates/${templateSlug}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="event-schedule-page page-enter">
      {/* ── PROGRESS STEPS ── */}
      <div className="es-progress-wrap">
        <div className="es-progress">
          <div className="es-step done">
            <div className="es-step-circle">✓</div>
            <span>Pilih Template</span>
          </div>
          <div className="es-step-line done" />
          <div className="es-step active">
            <div className="es-step-circle">2</div>
            <span>Jadwal Acara</span>
          </div>
          <div className="es-step-line" />
          <div className="es-step">
            <div className="es-step-circle">3</div>
            <span>Pengisian Detail</span>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="es-content">
        <div className="es-card">
          {/* Header */}
          <div className="es-header">
            <div className="es-header-icon">💍</div>
            <h1 className="es-title">Jadwal Acara</h1>
            <p className="es-subtitle">
              Masukkan detail nama dan jadwal acara pernikahanmu.
            </p>
          </div>

          {/* ── NAMA MEMPELAI ── */}
          <div className="es-section">
            <div className="es-section-label">
              <span className="es-section-icon">👰</span>
              Nama Mempelai
            </div>
            <div className="es-form-row">
              <div className="es-form-group">
                <label className="es-label" htmlFor="groomName">
                  Mempelai Pria
                </label>
                <input
                  id="groomName"
                  name="groomName"
                  type="text"
                  className={`es-input${errors.groomName ? " es-input-error" : ""}`}
                  placeholder="Nama lengkap / panggilan"
                  value={form.groomName}
                  onChange={handleChange}
                  disabled={apiLoading}
                />
                {errors.groomName && (
                  <span className="es-error">{errors.groomName}</span>
                )}
              </div>

              <div className="es-and-sep">
                <span>&amp;</span>
              </div>

              <div className="es-form-group">
                <label className="es-label" htmlFor="brideName">
                  Mempelai Wanita
                </label>
                <input
                  id="brideName"
                  name="brideName"
                  type="text"
                  className={`es-input${errors.brideName ? " es-input-error" : ""}`}
                  placeholder="Nama lengkap / panggilan"
                  value={form.brideName}
                  onChange={handleChange}
                  disabled={apiLoading}
                />
                {errors.brideName && (
                  <span className="es-error">{errors.brideName}</span>
                )}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="es-form-row" style={{ marginTop: '1.5rem' }}>
              <div className="es-form-group" style={{ flex: 1 }}>
                <label className="es-label" htmlFor="slug">
                  Custom Link Undangan
                </label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                  <span style={{ padding: '0.75rem 1rem', color: '#64748b', background: '#e2e8f0', borderRight: '1px solid #cbd5e1', fontSize: '0.9rem' }}>datangya.site/template/{templateSlug}/</span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    style={{ flex: 1, border: 'none', padding: '0.75rem', background: 'transparent', outline: 'none', color: '#0f172a', fontWeight: 'bold' }}
                    placeholder="nama-kamu-dan-pasangan"
                    value={form.slug}
                    onChange={handleChange}
                    disabled={apiLoading}
                  />
                  {form.slug && (
                    <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center' }}>
                      {slugStatus === 'checking' && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>⌛ Mengecek...</span>}
                      {slugStatus === 'available' && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>✅ {slugMessage}</span>}
                      {slugStatus === 'unavailable' && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>❌ {slugMessage}</span>}
                    </div>
                  )}
                </div>
                {errors.slug && (
                  <span className="es-error">{errors.slug}</span>
                )}
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>Hanya huruf, angka, dan tanda hubung (-). Tanpa spasi.</p>
              </div>
            </div>
          </div>

          <div className="es-divider" />

          {/* ── AKAD ── */}
          <div className="es-section">
            <div className="es-section-label">
              <span className="es-section-icon">🕌</span>
              Acara Akad Nikah
              <span className="es-badge-required">Wajib</span>
            </div>

            <div className="es-datetime-row">
              <div className="es-form-group es-flex-2">
                <label className="es-label" htmlFor="akadDate">
                  Tanggal Akad
                </label>
                <input
                  id="akadDate"
                  name="akadDate"
                  type="date"
                  className={`es-input${errors.akadDate ? " es-input-error" : ""}`}
                  value={form.akadDate}
                  onChange={handleChange}
                  disabled={apiLoading}
                />
                {form.akadDate && (
                  <span className="es-date-preview">{formatDate(form.akadDate)}</span>
                )}
                {errors.akadDate && (
                  <span className="es-error">{errors.akadDate}</span>
                )}
              </div>

              <div className="es-form-group es-flex-1">
                <label className="es-label" htmlFor="akadTime">
                  Jam Mulai
                </label>
                <input
                  id="akadTime"
                  name="akadTime"
                  type="time"
                  className={`es-input${errors.akadTime ? " es-input-error" : ""}`}
                  value={form.akadTime}
                  onChange={handleChange}
                  disabled={apiLoading}
                />
                {errors.akadTime && (
                  <span className="es-error">{errors.akadTime}</span>
                )}
              </div>
            </div>
          </div>

          <div className="es-divider" />

          {/* ── RESEPSI (OPTIONAL) ── */}
          <div className="es-section">
            <div className="es-resepsi-header">
              <div className="es-section-label">
                <span className="es-section-icon">🥂</span>
                Acara Resepsi
              </div>
              <label className="es-toggle-label" htmlFor="hasResepsi">
                <input
                  id="hasResepsi"
                  name="hasResepsi"
                  type="checkbox"
                  className="es-toggle-input"
                  checked={form.hasResepsi}
                  onChange={handleChange}
                  disabled={apiLoading}
                />
                <span className="es-toggle-track">
                  <span className="es-toggle-thumb" />
                </span>
                <span className="es-toggle-text">
                  {form.hasResepsi ? "Ada resepsi" : "Tidak ada resepsi"}
                </span>
              </label>
            </div>

            {form.hasResepsi && (
              <div className="es-resepsi-fields page-enter">
                <div className="es-datetime-row">
                  <div className="es-form-group es-flex-2">
                    <label className="es-label" htmlFor="resepsiDate">
                      Tanggal Resepsi
                    </label>
                    <input
                      id="resepsiDate"
                      name="resepsiDate"
                      type="date"
                      className={`es-input${errors.resepsiDate ? " es-input-error" : ""}`}
                      value={form.resepsiDate}
                      onChange={handleChange}
                      disabled={apiLoading}
                    />
                    {form.resepsiDate && (
                      <span className="es-date-preview">{formatDate(form.resepsiDate)}</span>
                    )}
                    {errors.resepsiDate && (
                      <span className="es-error">{errors.resepsiDate}</span>
                    )}
                  </div>

                  <div className="es-form-group es-flex-1">
                    <label className="es-label" htmlFor="resepsiTime">
                      Jam Mulai
                    </label>
                    <input
                      id="resepsiTime"
                      name="resepsiTime"
                      type="time"
                      className={`es-input${errors.resepsiTime ? " es-input-error" : ""}`}
                      value={form.resepsiTime}
                      onChange={handleChange}
                      disabled={apiLoading}
                    />
                    {errors.resepsiTime && (
                      <span className="es-error">{errors.resepsiTime}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── ACTIONS ── */}
          <div className="es-actions">
            <button className="es-btn-back" onClick={handleBack} disabled={apiLoading}>
              ← Kembali
            </button>
            <button className="es-btn-next" onClick={handleNext} disabled={apiLoading}>
              {apiLoading ? "Memproses..." : "Lanjutkan →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
