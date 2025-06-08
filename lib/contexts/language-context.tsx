"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, useTranslation as useI18n } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');

  useEffect(() => {
    // 从localStorage加载语言设置
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && ['zh', 'en'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // 如果没有保存的语言设置，根据浏览器语言设置默认语言
      const browserLanguage = navigator.language.toLowerCase();
      if (browserLanguage.startsWith('zh')) {
        setLanguageState('zh');
      } else {
        setLanguageState('en');
      }
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // 更新HTML lang属性
    document.documentElement.lang = newLanguage === 'zh' ? 'zh-CN' : 'en';
  };

  const { t } = useI18n(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 