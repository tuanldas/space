import { type MessageFormatElement } from 'react-intl';

export type TLanguageCode = 'en' | 'vi';

export type TLanguageDirection = 'ltr' | 'rtl';

export interface TLanguage {
  label: string;
  code: TLanguageCode;
  direction: TLanguageDirection;
  flag: string;
  messages: Record<string, string> | Record<string, MessageFormatElement[]>;
}

export interface ITranslationProviderProps {
  currentLanguage: TLanguage;
  isRTL: () => boolean;
  // eslint-disable-next-line no-unused-vars
  changeLanguage: (lang: TLanguage) => void;
}
