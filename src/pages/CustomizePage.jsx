// src/pages/CustomizePage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TemplateRenderer from '../templates/base/TemplateRenderer';
import { TEMPLATES } from '../data/templates';

export default function CustomizePage() {
  const { templateSlug } = useParams(); // Ambil dari URL
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    eventTime: '',
    location: '',
    address: '',
    googleMapsUrl: '',
    story: '',
    gallery: []
  });
  
  const [config, setConfig] = useState({
    primaryColor: '#b5652a',
    secondaryColor: '#f5a623',
    enableMusic: false,
    enableMap: true,
    enableRsvp: true,
    enableGallery: true
  });
  
  useEffect(() => {
    const template = TEMPLATES.find(t => t.slug === templateSlug);
    if (template) {
      setSelectedTemplate(template);
      // Optionally, load saved data from localStorage if available for this slug
      const savedData = localStorage.getItem(`customize_${templateSlug}_data`);
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    } else {
      navigate('/templates'); // Redirect if template not found
    }
    setLoading(false);
  }, [templateSlug]);
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleConfigChange = (e) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  };
  
  const handleSave = async () => {
    // TODO: Save ke database via API
    console.log('Saving invitation:', { templateSlug: selectedTemplate?.slug, data: formData, config });
    localStorage.setItem(`customize_${selectedTemplate.slug}_data`, JSON.stringify(formData)); // Save form data locally
    alert('Undangan berhasil disimpan!');
    navigate('/'); // Go to home page
  };
  
  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }
  if (!selectedTemplate) {
    return (
      <div className="error-container">
        <p>Tidak ada template yang dipilih</p>
        <button onClick={() => setPage({ name: 'templates' })}>Pilih Template</button>
      </div>
    );
  }
  
  return (
    <div className="customize-page">
      <div className="customize-layout">
        {/* Sidebar Form */}
        <div className="customize-sidebar">
          <h2>Customize Undangan</h2>
          
          <div className="form-section">
            <h3>Data Pasangan</h3>
            <input type="text" name="brideName" placeholder="Nama Pengantin Wanita" value={formData.brideName} onChange={handleInputChange} />
            <input type="text" name="groomName" placeholder="Nama Pengantin Pria" value={formData.groomName} onChange={handleInputChange} />
          </div>
          
          <div className="form-section">
            <h3>Acara</h3>
            <input type="date" name="weddingDate" value={formData.weddingDate} onChange={handleInputChange} />
            <input type="time" name="eventTime" value={formData.eventTime} onChange={handleInputChange} />
            <input type="text" name="location" placeholder="Nama Tempat" value={formData.location} onChange={handleInputChange} />
            <textarea name="address" placeholder="Alamat Lengkap" value={formData.address} onChange={handleInputChange} />
            <input type="url" name="googleMapsUrl" placeholder="Link Google Maps" value={formData.googleMapsUrl} onChange={handleInputChange} />
          </div>
          
          <div className="form-section">
            <h3>Customize Style</h3>
            <label>Warna Utama</label>
            <input type="color" name="primaryColor" value={config.primaryColor} onChange={handleConfigChange} />
            <label>
              <input type="checkbox" name="enableMap" checked={config.enableMap} onChange={handleConfigChange} />
              Tampilkan Peta
            </label>
            <label>
              <input type="checkbox" name="enableRsvp" checked={config.enableRsvp} onChange={handleConfigChange} />
              Aktifkan RSVP
            </label>
            <label>
              <input type="checkbox" name="enableGallery" checked={config.enableGallery} onChange={handleConfigChange} />
              Tampilkan Galeri
            </label>
          </div>
          
          <button className="save-button" onClick={handleSave}>
            Simpan Undangan
          </button>
        </div>
        
        {/* Preview Area */}
        <div className="customize-preview">
          <h3>Preview Undangan</h3>
          <div className="preview-frame">
            {selectedTemplate && ( // Render only if selectedTemplate is available
              <TemplateRenderer 
                templateSlug={selectedTemplate.slug}
                data={formData}
                config={config}
                isPreview={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}