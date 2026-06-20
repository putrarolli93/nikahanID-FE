import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TemplateRenderer from '../templates/base/TemplateRenderer';
import { TEMPLATES } from '../data/templates';

export default function TemplatePreviewPage() {
  const { templateSlug } = useParams();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const template = TEMPLATES.find(t => t.slug === templateSlug);
    if (template) {
      setSelectedTemplate(template);
    } else {
      navigate('/templates');
    }
    setLoading(false);
  }, [templateSlug, navigate]);

  if (loading) return null;
  if (!selectedTemplate) return null;

  return (
    <TemplateRenderer 
      templateSlug={selectedTemplate.slug}
      isPreview={true}
    />
  );
}