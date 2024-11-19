import { toAbsoluteUrl } from '@/utils';
import { type TLanguage } from './types.d';
import enMessages from './messages/en.json';
import viMessages from './messages/vi.json';

const I18N_MESSAGES = {
  en: enMessages,
  vi: viMessages
};

const I18N_CONFIG_KEY = 'i18nConfig';

const I18N_LANGUAGES: readonly TLanguage[] = [
  {
    label: 'English',
    code: 'en',
    direction: 'ltr',
    flag: toAbsoluteUrl('/media/flags/united-states.svg'),
    messages: I18N_MESSAGES.en
  },
  {
    label: 'Việt Nam',
    code: 'vi',
    direction: 'ltr',
    flag: toAbsoluteUrl('/media/flags/vietnam.svg'),
    messages: I18N_MESSAGES.en
  }
];

const I18N_DEFAULT_LANGUAGE: TLanguage = I18N_LANGUAGES[0];

export { I18N_CONFIG_KEY, I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES, I18N_MESSAGES };
