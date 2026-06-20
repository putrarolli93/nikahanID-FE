// src/templates/base/TemplateRenderer.jsx
import { useState, useEffect, lazy, Suspense } from 'react';

// Lazy load templates
const templateComponents = {
  amore: lazy(() => import('../amore/AmoreTemplate')),
//   oceanic: lazy(() => import('../oceanic/OceanicTemplate')),
//   sage: lazy(() => import('../sage/SageTemplate')),
//   bloom: lazy(() => import('../bloom/BloomTemplate')),
//   madinah: lazy(() => import('../madinah/MadinahTemplate')),
//   luxe: lazy(() => import('../luxe/LuxeTemplate')),
//   rustic: lazy(() => import('../rustic/RusticTemplate')),
//   midnight: lazy(() => import('../midnight/MidnightTemplate')),
//   garden: lazy(() => import('../garden/GardenTemplate')),
//   barokah: lazy(() => import('../barokah/BarokahTemplate')),
};

const LoadingSpinner = () => (
  <div className="template-loading">
    <div className="spinner"></div>
    <p>Memuat template...</p>
  </div>
);

const ErrorTemplate = ({ message }) => (
  <div className="template-error">
    <p>⚠️ {message}</p>
  </div>
);

export default function TemplateRenderer({ templateSlug, data, config, isPreview = false }) {
  const [error, setError] = useState(null);
  
  // Get template component based on slug
  const TemplateComponent = templateComponents[templateSlug];
  
  useEffect(() => {
    if (!TemplateComponent && templateSlug) {
      setError(`Template "${templateSlug}" tidak ditemukan`);
    } else {
      setError(null);
    }
  }, [templateSlug, TemplateComponent]);
  
  if (error) {
    return <ErrorTemplate message={error} />;
  }
  
  if (!TemplateComponent) {
    return <LoadingSpinner />;
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TemplateComponent 
        data={data} 
        config={config} 
        isPreview={isPreview}
      />
    </Suspense>
  );
}