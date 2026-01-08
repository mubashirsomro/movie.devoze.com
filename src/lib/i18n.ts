import { useSettingsStore } from '@/store/settingsStore';

type Language = 'en' | 'ar' | 'fr' | 'id' | 'hi' | 'ur' | 'fil';

const translations: Record<Language, Record<string, string>> = {
    en: {
        'Home': 'Home',
        'Movies': 'Movies',
        'TV show': 'TV Shows',
        'Series': 'Series',
        'Animation': 'Animation',
        'Novel': 'Novels', // Kept for safety
        'Most Watched': 'Most Watched',
        'Trending': 'Trending',
        'Downloads': 'Downloads',
        'MovieBox App': 'MovieBox App',
        'Download App': 'Download App',
        'Search titles...': 'Search titles...',
        'Admin Panel': 'Admin Panel',
        'ENGLISH': 'ENGLISH',
    },
    ar: {
        'Home': 'الرئيسية',
        'Movies': 'أفلام',
        'TV show': 'برامج تلفزيونية',
        'Series': 'مسلسلات',
        'Animation': 'رسوم متحركة',
        'Novel': 'روايات',
        'Most Watched': 'الأكثر مشاهدة',
        'Trending': 'شائع',
        'Downloads': 'التحميلات',
        'MovieBox App': 'تطبيق MovieBox',
        'Download App': 'تحميل التطبيق',
        'Search titles...': 'بحث عن العناوين...',
        'Admin Panel': 'لوحة المسؤول',
        'ENGLISH': 'الإنجليزية',
    },
    fr: {
        'Home': 'Accueil',
        'Movies': 'Films',
        'TV show': 'Émissions TV',
        'Series': 'Séries',
        'Animation': 'Animation',
        'Novel': 'Romans',
        'Most Watched': 'Les plus regardés',
        'Trending': 'Tendances',
        'Downloads': 'Téléchargements',
        'MovieBox App': 'App MovieBox',
        'Download App': 'Télécharger l\'app',
        'Search titles...': 'Rechercher...',
        'Admin Panel': 'Panneau Admin',
        'ENGLISH': 'ANGLAIS',
    },
    id: {
        'Home': 'Beranda',
        'Movies': 'Film',
        'TV show': 'Acara TV',
        'Series': 'Serial',
        'Animation': 'Animasi',
        'Novel': 'Novel',
        'Most Watched': 'Paling Banyak Ditonton',
        'Trending': 'Sedang Tren',
        'Downloads': 'Unduhan',
        'MovieBox App': 'Aplikasi MovieBox',
        'Download App': 'Unduh Aplikasi',
        'Search titles...': 'Cari judul...',
        'Admin Panel': 'Panel Admin',
        'ENGLISH': 'INGGRIS',
    },
    hi: {
        'Home': 'होम',
        'Movies': 'फिल्में',
        'TV show': 'टीवी शो',
        'Series': 'वेब सीरीज',
        'Animation': 'एनिमेशन',
        'Novel': 'उपन्यास',
        'Most Watched': 'सबसे ज्यादा देखा गया',
        'Trending': 'ट्रेंडिंग',
        'Downloads': 'डाउनलोड',
        'MovieBox App': 'मूवीबॉक्स ऐप',
        'Download App': 'ऐप डाउनलोड करें',
        'Search titles...': 'शीर्षक खोजें...',
        'Admin Panel': 'एडमिन पैनल',
        'ENGLISH': 'अंग्रेज़ी',
    },
    ur: {
        'Home': 'خانہ',
        'Movies': 'فلمیں',
        'TV show': 'ٹی وی شوز',
        'Series': 'سیریز',
        'Animation': 'اینیمیشن',
        'Novel': 'ناول',
        'Most Watched': 'سب سے زیادہ دیکھا گیا',
        'Trending': 'رجحان',
        'Downloads': 'ڈاؤن لوڈز',
        'MovieBox App': 'مووی باکس ایپ',
        'Download App': 'ایپ ڈاؤن لوڈ کریں',
        'Search titles...': 'عنوانات تلاش کریں...',
        'Admin Panel': 'ایڈمن پینل',
        'ENGLISH': 'انگریزی',
    },
    fil: {
        'Home': 'Tahanan', // or Home
        'Movies': 'Mga Pelikula',
        'TV show': 'Palabas sa TV',
        'Series': 'Serye',
        'Animation': 'Animasyon',
        'Novel': 'Nobela',
        'Most Watched': 'Pinakapinapanood',
        'Trending': 'Trending',
        'Downloads': 'Mga Download',
        'MovieBox App': 'MovieBox App',
        'Download App': 'I-download ang App',
        'Search titles...': 'Maghanap ng mga pamagat...',
        'Admin Panel': 'Admin Panel',
        'ENGLISH': 'INGLES',
    }
};

export const useTranslation = () => {
    const { settings } = useSettingsStore();
    const lang = settings?.language || 'en';

    const t = (key: string): string => {
        // Try exact match
        if (translations[lang][key]) {
            return translations[lang][key];
        }

        // Try case-insensitive lookup if strict failed
        const lowerKey = key.toLowerCase();
        const entry = Object.entries(translations[lang]).find(([k]) => k.toLowerCase() === lowerKey);
        if (entry) return entry[1];

        // Fallback to key
        return key;
    };

    return { t, lang };
};
