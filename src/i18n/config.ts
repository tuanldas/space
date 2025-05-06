import {toAbsoluteUrl} from '@/lib/helpers';
import viMessages from './messages/vi.json';
import {type Language} from './types';

const I18N_MESSAGES = {
    vi: viMessages
};

const I18N_CONFIG_KEY = 'i18nConfig';

const I18N_LANGUAGES: Language[] = [
    {
        label: 'Việt Nam',
        code: 'vi',
        direction: 'ltr',
        flag: toAbsoluteUrl('/media/flags/vietnam.svg'),
        messages: I18N_MESSAGES.vi,
    },
];

const I18N_DEFAULT_LANGUAGE: Language = I18N_LANGUAGES[0];

export {
    I18N_CONFIG_KEY,
    I18N_DEFAULT_LANGUAGE,
    I18N_LANGUAGES,
    I18N_MESSAGES,
};
