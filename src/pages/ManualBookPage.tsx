import React from 'react';
import { useLocation } from 'react-router-dom';
import ManualSectionsWizard from '../components/digitalbook/ManualSectionsWizard';

const ManualBookPage: React.FC = () => {
  const location = useLocation();
  
  // Obtener datos del estado de navegación
  const buildingName = location.state?.buildingName || "Torre Central";
  const buildingId = location.state?.buildingId || "building-1";
  const startSection = location.state?.startSection;

  return (
    <ManualSectionsWizard 
      buildingName={buildingName}
      buildingId={buildingId}
      startSection={startSection}
    />
  );
};

export default ManualBookPage;