import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Inicializamos el idioma leyendo primero el localStorage
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('byteforge_lang') || 'es';
  });

  // Guardamos en localStorage cada vez que la variable 'lang' cambie
  useEffect(() => {
    localStorage.setItem('byteforge_lang', lang);
  }, [lang]);

  const changeLanguage = (newLang) => {
    setLang(newLang);
  };

  // Función traductora limpia y robusta
  const t = (key) => {
    // Busca la clave en el idioma actual -> luego en inglés como fallback universal -> retorna la clave si no la encuentra
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);