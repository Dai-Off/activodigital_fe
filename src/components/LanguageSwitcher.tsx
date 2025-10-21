import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };
  return (
    <select
      value={i18n.language}
      onChange={changeLanguage}
      className="px-2 py-1 rounded text-sm font-medium border border-blue-200 bg-white text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Seleccionar idioma"
    >
      <option value="es">Español</option>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
      <option value="it">Italiano</option>
      <option value="nl">Nederlands</option>
    </select>
  );
};

export default LanguageSwitcher;
