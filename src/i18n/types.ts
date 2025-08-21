export type LanguageCode = 'vi' | 'en';

export type LanguageDirection = 'ltr' | 'rtl';

// Định nghĩa recursive type cho nested messages
export type NestedMessages = {
    [key: string]: string | NestedMessages;
};

export interface Language {
    label: string;
    code: LanguageCode;
    direction: LanguageDirection;
    flag: string;
    messages: NestedMessages;
}

export interface I18nProviderProps {
    currenLanguage: Language;
    isRTL: () => boolean;

    changeLanguage: (lang: Language) => void;
}
