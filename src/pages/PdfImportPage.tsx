import React from 'react';
import { useLocation } from 'react-router-dom';
import PdfImport from '../components/digitalbook/PdfImport';

const PdfImportPage: React.FC = () => {
  const location = useLocation();
  
  // Obtener datos del estado de navegación
  const buildingName = location.state?.buildingName || "Torre Central";
  const buildingId = location.state?.buildingId || "building-1";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-8">
      <PdfImport 
        buildingName={buildingName}
        buildingId={buildingId}
      />
    </div>
  );
};

export default PdfImportPage;