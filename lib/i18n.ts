export const locales = ['is', 'en', 'pl'] as const;
export const defaultLocale = 'is';
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
    is: 'Íslenska',
    en: 'English',
    pl: 'Polski'
};

export const localeFlags: Record<Locale, string> = {
    is: '🇮🇸',
    en: '🇬🇧',
    pl: '🇵🇱'
};

// UI translations for static text
export const translations: Record<Locale, {
    nav: {
        about: string;
        policy: string;
        news: string;
        videos: string;
        contact: string;
    };
    hero: {
        greeting: string;
        subtitle: string;
        slogan: string;
        cta1: string;
        cta2: string;
    };
    contact: {
        title: string;
        text: string;
        button: string;
    };
    articles: {
        title: string;
        readMore: string;
    };
    news: {
        title: string;
    };
    videos: {
        title: string;
    };
    footer: {
        copyright: string;
    };
}> = {
    is: {
        nav: {
            about: 'Um mig',
            policy: 'Stefnuyfirlýsing',
            news: 'Fréttir',
            videos: 'Myndskeiđ',
            contact: 'Hafa samband'
        },
        hero: {
            greeting: 'Hæ, ég heiti',
            subtitle: 'Frambjóðandi til borgarstjórnar Reykjavíkur',
            slogan: 'Ég vil sjá betur rekna borg sem skilar sér í betri þjónustu fyrir íbúa.',
            cta1: 'Kynntu þér stefnuna',
            cta2: 'Hafa samband'
        },
        contact: {
            title: 'Hafa samband',
            text: 'Hefur þú spurningar eđa vilt styđja herferđina? Hafa samband!',
            button: 'Senda tölvupóst'
        },
        articles: {
            title: 'Greinar',
            readMore: 'Lesa meira →'
        },
        news: {
            title: 'Fréttir'
        },
        videos: {
            title: 'Myndskeiđ'
        },
        footer: {
            copyright: 'Öll réttindi áskilin'
        }
    },
    en: {
        nav: {
            about: 'About me',
            policy: 'Policy statement',
            news: 'News',
            videos: 'Videos',
            contact: 'Contact'
        },
        hero: {
            greeting: 'Hi, my name is',
            subtitle: 'Candidate for Reykjavík City Council',
            slogan: 'I want to see a better-run city that delivers improved services for residents.',
            cta1: 'Read my policy',
            cta2: 'Get in touch'
        },
        contact: {
            title: 'Contact',
            text: 'Do you have questions or want to support the campaign? Get in touch!',
            button: 'Send email'
        },
        articles: {
            title: 'Articles',
            readMore: 'Read more →'
        },
        news: {
            title: 'News'
        },
        videos: {
            title: 'Videos'
        },
        footer: {
            copyright: 'All rights reserved'
        }
    },
    pl: {
        nav: {
            about: 'O mnie',
            policy: 'Program',
            news: 'Aktualności',
            videos: 'Filmy',
            contact: 'Kontakt'
        },
        hero: {
            greeting: 'Cześć, nazywam się',
            subtitle: 'Kandydat do Rady Miasta Reykjavíku',
            slogan: 'Chcę zobaczyć lepiej zarządzane miasto, które zapewnia lepsze usługi dla mieszkańców.',
            cta1: 'Poznaj mój program',
            cta2: 'Kontakt'
        },
        contact: {
            title: 'Kontakt',
            text: 'Masz pytania lub chcesz wesprzeć kampanię? Skontaktuj się!',
            button: 'Wyślij email'
        },
        articles: {
            title: 'Artykuły',
            readMore: 'Czytaj więcej →'
        },
        news: {
            title: 'Aktualności'
        },
        videos: {
            title: 'Filmy'
        },
        footer: {
            copyright: 'Wszelkie prawa zastrzeżone'
        }
    }
};

export function getTranslations(locale: Locale) {
    return translations[locale];
}
