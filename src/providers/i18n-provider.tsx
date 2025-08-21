import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";
import { I18N_CONFIG_KEY, I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES, I18N_MESSAGES } from "@/i18n/config";
import { I18nProviderProps, type Language } from "@/i18n/types";
import { DirectionProvider as RadixDirectionProvider } from "@radix-ui/react-direction";
import { IntlProvider } from "react-intl";
import { flattenMessages } from "@/lib/i18n-helpers";
import { getData, setData } from "@/lib/storage";
import "@formatjs/intl-relativetimeformat/polyfill";
import "@formatjs/intl-relativetimeformat/locale-data/en";
import "@formatjs/intl-relativetimeformat/locale-data/vi";
import ApiCaller from "@/api/apiCaller";

const getInitialLanguage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");

    // Check if langParam matches a supported language in I18N_LANGUAGES
    if (langParam) {
        const matchedLanguage = I18N_LANGUAGES.find((lang) => lang.code === langParam);
        if (matchedLanguage) {
            setData(I18N_CONFIG_KEY, matchedLanguage);
            return matchedLanguage;
        }
    }

    const currenLanguage = getData(I18N_CONFIG_KEY) as Language | undefined;
    return currenLanguage ?? I18N_DEFAULT_LANGUAGE;
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

const I18nProvider = ({ children }: PropsWithChildren) => {
    const [currenLanguage, setCurrenLanguage] = useState(initialProps.currenLanguage);

    const changeLanguage = (language: Language) => {
        // Lấy messages cập nhật mới nhất từ I18N_MESSAGES
        const updatedLanguage = {
            ...language,
            messages: I18N_MESSAGES[language.code as keyof typeof I18N_MESSAGES],
        };

        setData(I18N_CONFIG_KEY, updatedLanguage);
        setCurrenLanguage(updatedLanguage);
        // Cập nhật ngôn ngữ cho API calls
        ApiCaller.setLanguage(language.code);
    };

    const isRTL = () => {
        return currenLanguage.direction === "rtl";
    };

    useEffect(() => {
        document.documentElement.setAttribute("dir", currenLanguage.direction);
        document.documentElement.setAttribute("lang", currenLanguage.code);

        // Cập nhật ngôn ngữ cho API calls khi component mount hoặc ngôn ngữ thay đổi
        ApiCaller.setLanguage(currenLanguage.code);
    }, [currenLanguage]);

    // Flatten nested messages for compatibility with react-intl
    const flattenedMessages = flattenMessages(currenLanguage.messages);

    return (
        <TranslationsContext.Provider
            value={{
                isRTL,
                currenLanguage,
                changeLanguage,
            }}
        >
            <IntlProvider
                messages={flattenedMessages}
                locale={currenLanguage.code}
                defaultLocale={I18N_DEFAULT_LANGUAGE.code}
            >
                <RadixDirectionProvider dir={currenLanguage.direction}>{children}</RadixDirectionProvider>
            </IntlProvider>
        </TranslationsContext.Provider>
    );
};

export { I18nProvider, useLanguage };
