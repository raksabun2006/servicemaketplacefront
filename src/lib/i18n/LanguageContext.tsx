"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { Language, translations } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.km) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("km");
  const [, startTransition] = useTransition();

  // Synchronize with localStorage after initial mount to prevent hydration mismatch
  React.useEffect(() => {
    const saved = localStorage.getItem("app_lang") as Language | null;
    if (saved === "km" || saved === "en") {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    startTransition(() => {
      setLanguageState(lang);
      localStorage.setItem("app_lang", lang);
      document.documentElement.lang = lang;
    });
  };

  const t = (key: keyof typeof translations.km): string => {
    return translations[language][key] || translations.km[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
