export type LanguageCode = 'vi';

export type LanguageDirection = 'ltr' | 'rtl';

export interface Language {
  label: string;
  code: LanguageCode;
  direction: LanguageDirection;
  flag: string;
  messages: any;
}

export interface I18nProviderProps {
  currenLanguage: Language;
  isRTL: () => boolean;

  changeLanguage: (lang: Language) => void;
}
