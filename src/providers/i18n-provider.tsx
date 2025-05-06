import {createContext, type PropsWithChildren, useContext, useEffect, useState,} from 'react';
import {I18N_CONFIG_KEY, I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES,} from '@/i18n/config';
import {I18nProviderProps, type Language} from '@/i18n/types';
import {DirectionProvider as RadixDirectionProvider} from '@radix-ui/react-direction';
import {IntlProvider} from 'react-intl';
import {getData, setData} from '@/lib/storage';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/de';
import '@formatjs/intl-relativetimeformat/locale-data/es';
import '@formatjs/intl-relativetimeformat/locale-data/fr';
import '@formatjs/intl-relativetimeformat/locale-data/ja';
import '@formatjs/intl-relativetimeformat/locale-data/zh';

const getInitialLanguage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');

    // Check if langParam matches a supported language in I18N_LANGUAGES
    if (langParam) {
        const matchedLanguage = I18N_LANGUAGES.find(
            (lang) => lang.code === langParam,
        );
        if (matchedLanguage) {
            setData(I18N_CONFIG_KEY, matchedLanguage);
            return matchedLanguage;
        }
    }

    const currenLanguage = getData(I18N_CONFIG_KEY) as Language | undefined;
    return currenLanguage ?? I18N_DEFAULT_LANGUAGE;
};

export const flattenMessages = (nestedMessages: any, prefix = '') => {
    if (nestedMessages === null) {
        return {};
    }
    return Object.keys(nestedMessages).reduce((messages, key) => {
        const value = nestedMessages[key];
        const prefixedKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string') {
            Object.assign(messages, {[prefixedKey]: value});
        } else {
            Object.assign(messages, flattenMessages(value, prefixedKey));
        }
        return messages;
    }, {});
};

const initialProps: I18nProviderProps = {
    currenLanguage: getInitialLanguage(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changeLanguage: (_: Language) => {
    },
    isRTL: () => false,
};

const TranslationsContext = createContext<I18nProviderProps>(initialProps);
const useLanguage = () => useContext(TranslationsContext);

const I18nProvider = ({children}: PropsWithChildren) => {
    const [currenLanguage, setCurrenLanguage] = useState(
        initialProps.currenLanguage,
    );

    const changeLanguage = (language: Language) => {
        setData(I18N_CONFIG_KEY, language);
        setCurrenLanguage(language);
    };

    const isRTL = () => {
        return currenLanguage.direction === 'rtl';
    };

    useEffect(() => {
        document.documentElement.setAttribute('dir', currenLanguage.direction);
    }, [currenLanguage]);

    return (
        <TranslationsContext.Provider
            value={{
                isRTL,
                currenLanguage,
                changeLanguage,
            }}
        >
            <IntlProvider
                messages={flattenMessages(currenLanguage.messages)}
                locale={currenLanguage.code}
                defaultLocale={getInitialLanguage().code}
            >
                <RadixDirectionProvider dir={currenLanguage.direction}>
                    {children}
                </RadixDirectionProvider>
            </IntlProvider>
        </TranslationsContext.Provider>
    );
};

export {I18nProvider, useLanguage};
