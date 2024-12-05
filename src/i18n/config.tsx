import { toAbsoluteUrl } from '@/utils';
import viMessages from './messages/vi.json';
import { type TLanguage } from './types.d';

const I18N_MESSAGES = {
  vi: viMessages
};

const I18N_CONFIG_KEY = 'i18nConfig';

const I18N_LANGUAGES: readonly TLanguage[] = [
  {
    label: 'Việt Nam',
    code: 'vi',
    direction: 'ltr',
    flag: toAbsoluteUrl('/media/flags/vietnam.svg'),
    messages: I18N_MESSAGES.vi
  }
];

const I18N_DEFAULT_LANGUAGE: TLanguage = I18N_LANGUAGES[0];

export { I18N_CONFIG_KEY, I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES, I18N_MESSAGES };
