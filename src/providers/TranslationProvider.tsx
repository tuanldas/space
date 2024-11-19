/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/vi';

import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { I18N_CONFIG_KEY, I18N_DEFAULT_LANGUAGE, type ITranslationProviderProps, type TLanguage } from '@/i18n';
import { getData, setData } from '@/utils';

const getInitialLanguage = () => {
  const currentLanguage = getData(I18N_CONFIG_KEY) as TLanguage | undefined;
  return currentLanguage ?? I18N_DEFAULT_LANGUAGE;
};

const initialProps: ITranslationProviderProps = {
  currentLanguage: getInitialLanguage(),
  changeLanguage: (_: TLanguage) => {
  },
  isRTL: () => false
};

const TranslationsContext = createContext<ITranslationProviderProps>(initialProps);
const useLanguage = () => useContext(TranslationsContext);

export const flattenMessages = (nestedMessages: any, prefix = '') => {
  if (nestedMessages === null) {
    return {};
  }
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      Object.assign(messages, { [prefixedKey]: value });
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }
    return messages;
  }, {});
};

const I18NProvider = ({ children }: PropsWithChildren) => {
  const { currentLanguage } = useLanguage();

  return (
    <IntlProvider
      messages={flattenMessages(currentLanguage.messages)}
      locale={currentLanguage.code}
      defaultLocale={getInitialLanguage().code}
    >
      {children}
    </IntlProvider>
  );
};

const TranslationProvider = ({ children }: PropsWithChildren) => {
  const [currentLanguage, setCurrentLanguage] = useState(initialProps.currentLanguage);

  const changeLanguage = (language: TLanguage) => {
    setData(I18N_CONFIG_KEY, language);
    setCurrentLanguage(language);
  };

  const isRTL = () => {
    return currentLanguage.direction === 'rtl';
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', currentLanguage.direction);
  }, [currentLanguage]);

  return (
    <TranslationsContext.Provider
      value={{
        isRTL,
        currentLanguage,
        changeLanguage
      }}
    >
      <I18NProvider>{children}</I18NProvider>
    </TranslationsContext.Provider>
  );
};

export { TranslationProvider, useLanguage };
