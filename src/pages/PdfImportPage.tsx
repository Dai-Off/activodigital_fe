import React from 'react';
import { useLocation } from 'react-router-dom';
import PdfImport from '../components/digitalbook/PdfImport';

const PdfImportPage: React.FC = () => {
  const location = useLocation();
  
  // Obtener datos del estado de navegación
  const buildingName = location.state?.buildingName || "Torre Central";
  const buildingId = location.state?.buildingId || "building-1";

  return (
    <PdfImport 
      buildingName={buildingName}
      buildingId={buildingId}
    />
  );
};

export default PdfImportPage;