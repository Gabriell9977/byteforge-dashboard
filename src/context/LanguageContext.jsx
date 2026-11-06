import { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Idioma por defecto almacenado o español por defecto
  const [lang, setLang] = useState(localStorage.getItem('byteforge_lang') || 'es');

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('byteforge_lang', newLang);
  };

  // Función traductora limpia
  const t = (key) => {
    return translations[lang]?.[key] || translations['es']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);