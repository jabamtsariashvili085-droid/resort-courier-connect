import React from 'react';
import { useI18n, } from '@/i18n/I18nProvider';
import { Language } from '@/i18n/translations';
import { Globe } from 'lucide-react';

const langLabels: Record<Language, string> = {
  ka: 'ქარ',
  en: 'ENG',
  ru: 'РУС',
};

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();
  const languages: Language[] = ['ka', 'en', 'ru'];

  return (
    <div className="flex items-center gap-1">
      <Globe className="w-4 h-4 text-muted-foreground" />
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
            language === lang
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          {langLabels[lang]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
