// pages/EventSchedulePage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EventSchedulePage() {
  const { templateSlug } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    groomName: "",
    brideName: "",
    akadDate: "",
    akadTime: "",
    hasResepsi: false,
    resepsiDate: "",
    resepsiTime: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Reset resepsi fields when unchecked
      ...(name === "hasResepsi" && !checked
        ? { resepsiDate: "", resepsiTime: "" }
        : {}),
    }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.groomName.trim()) newErrors.groomName = "Nama mempelai pria wajib diisi.";
    if (!form.brideName.trim()) newErrors.brideName = "Nama mempelai wanita wajib diisi.";
    if (!form.akadDate) newErrors.akadDate = "Tanggal akad wajib diisi.";
    if (!form.akadTime) newErrors.akadTime = "Jam akad wajib diisi.";
    if (form.hasResepsi) {
      if (!form.resepsiDate) newErrors.resepsiDate = "Tanggal resepsi wajib diisi jika diaktifkan.";
      if (!form.resepsiTime) newErrors.resepsiTime = "Jam resepsi wajib diisi jika diaktifkan.";
    }
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Save to sessionStorage dan lanjut ke step berikutnya (customize)
    sessionStorage.setItem(`event_${templateSlug}`, JSON.stringify(form));
    navigate(`/customize/${templateSlug}`);
  };

  const handleBack = () => {
    navigate(`/templates/${templateSlug}`);
  };

  // Format label tanggal yang cantik
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
            <span>Kustomisasi</span>
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
                />
                {errors.brideName && (
                  <span className="es-error">{errors.brideName}</span>
                )}
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
            <button className="es-btn-back" onClick={handleBack}>
              ← Kembali
            </button>
            <button className="es-btn-next" onClick={handleNext}>
              Lanjutkan →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
