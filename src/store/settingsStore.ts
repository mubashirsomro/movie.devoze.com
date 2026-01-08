import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MenuItemType = 'link' | 'dropdown' | 'dynamic-genres' | 'dynamic-categories';

export interface MenuItem {
    id: string;
    label: string;
    path: string;
    type: MenuItemType;
    visible: boolean;
    children?: MenuItem[];
}

export interface SiteSettings {
    siteName: string;
    siteDescription: string;
    logoUrl: string;
    logoSize: number; // in pixels (height)
    faviconUrl: string;
    contactEmail: string;
    downloadAppUrl: string; // URL for the 'Download App' button
    layoutMode: 'sidebar' | 'classic'; // 'sidebar' = MovieBox style, 'classic' = Top Navbar
    language: 'en' | 'ar' | 'fr' | 'id' | 'hi' | 'ur' | 'fil';
    fontStyle: string;
    fontWeight: string;
    adminCredentials: {
        username: string;
        password: string;
        role?: 'SuperAdmin' | 'Admin' | 'Editor' | 'Uploader';
    };
}

export interface CodeInjection {
    headCode: string;
    // ... (skip intermediate lines if not replacing, but since I need to update defaultSettings later, I might need a second chunk or just view file first to get line numbers right. I'll read the file first to be safe.)
    bodyCode: string; // Start of body
    footerCode: string; // End of body
}

export interface FooterSettings {
    footerLogoUrl: string;
    copyrightText: string;
    socialLinks: {
        facebook: string;
        twitter: string;
        instagram: string;
        telegram: string;
    };
}

export interface AdSettings {
    homeAdCode: string;
    watchAdCode: string;
    interCategoryAdCode: string; // New: Ad code for between categories
    moviesAdCode: string; // New: Ad code for Movies page
    seriesAdCode: string; // New: Ad code for Series page
    trendingAdCode: string; // New: Ad code for Trending page
    footerAdCode: string; // New: Ad code for Footer
    popunderCode: string;
    admob: {
        appId: string;
        bannerId: string;
        interstitialId: string;
        rewardedId: string;
        nativeId: string;
    };
    brandPromotion: {
        enabled: boolean;
        imageUrl: string;
        targetUrl: string;
        position: 'header' | 'footer' | 'popup';
    };
    popupSettings: {
        enabled: boolean;
        type: 'image' | 'code';
        imageUrl: string;
        targetUrl: string;
        code: string;
        timer: number;
    };
}

interface SettingsStore {
    settings: SiteSettings;
    codeInjection: CodeInjection;
    menuItems: MenuItem[];
    footerSettings: FooterSettings;
    adSettings: AdSettings;

    // Actions
    updateSettings: (settings: Partial<SiteSettings>) => void;
    updateCodeInjection: (code: Partial<CodeInjection>) => void;
    updateMenuItems: (items: MenuItem[]) => void;
    addMenuItem: (item: MenuItem) => void;
    removeMenuItem: (id: string) => void;
    toggleMenuItem: (id: string) => void;
    updateAdminCredentials: (credentials: { username?: string; password?: string; role?: 'SuperAdmin' | 'Admin' | 'Editor' | 'Uploader' }) => void;

    // New Actions
    updateFooterSettings: (settings: Partial<FooterSettings> | ((prev: FooterSettings) => Partial<FooterSettings>)) => void;
    updateAdSettings: (settings: Partial<AdSettings> | ((prev: AdSettings) => Partial<AdSettings>)) => void;

    // System
    exportSettings: () => string;
    importSettings: (json: string) => boolean;
    resetSettings: () => void;
}

const defaultSettings: SiteSettings = {
    siteName: 'StreamSphere Hub',
    siteDescription: 'Your ultimate destination for movies and TV series streaming',
    logoUrl: '', // Empty means use default icon
    logoSize: 40,
    faviconUrl: '',
    contactEmail: 'admin@streamsphere.com',
    downloadAppUrl: '#',
    layoutMode: 'sidebar',
    language: 'en',
    fontStyle: 'Inter',
    fontWeight: '400',
    adminCredentials: {
        username: 'admin',
        password: 'admin',
        role: 'SuperAdmin',
    },
};

const defaultCodeInjection: CodeInjection = {
    headCode: '',
    bodyCode: '',
    footerCode: '',
};

const defaultFooterSettings: FooterSettings = {
    footerLogoUrl: '',
    copyrightText: '© 2024 StreamSphere Hub. All rights reserved.',
    socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        telegram: ''
    }
};

const defaultAdSettings: AdSettings = {
    homeAdCode: '',
    watchAdCode: '',
    interCategoryAdCode: '',
    moviesAdCode: '',
    seriesAdCode: '',
    trendingAdCode: '',
    footerAdCode: '',
    popunderCode: '',
    admob: {
        appId: '',
        bannerId: '',
        interstitialId: '',
        rewardedId: '',
        nativeId: '',
    },
    brandPromotion: {
        enabled: false,
        imageUrl: '',
        targetUrl: '',
        position: 'popup'
    },
    popupSettings: {
        enabled: false,
        type: 'image',
        imageUrl: '',
        targetUrl: '',
        code: '',
        timer: 20,
    },
};

const defaultMenuItems: MenuItem[] = [
    { id: 'home', label: 'Home', path: '/', type: 'link', visible: true },
    { id: 'movies', label: 'Movies', path: '/movies', type: 'link', visible: true },
    { id: 'series', label: 'Series', path: '/series', type: 'link', visible: true },
    { id: 'trending', label: 'Trending', path: '/trending', type: 'link', visible: true },
    { id: 'downloads', label: 'Downloads', path: '/downloads', type: 'link', visible: true },
];

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set, get) => ({
            settings: defaultSettings,
            codeInjection: defaultCodeInjection,
            menuItems: defaultMenuItems,
            footerSettings: defaultFooterSettings,
            adSettings: defaultAdSettings,

            updateSettings: (newSettings) =>
                set((state) => ({ settings: { ...state.settings, ...newSettings } })),

            updateAdminCredentials: (credentials) =>
                set((state) => ({
                    settings: {
                        ...state.settings,
                        adminCredentials: {
                            ...state.settings.adminCredentials,
                            ...credentials
                        }
                    }
                })),

            updateCodeInjection: (newCode) =>
                set((state) => ({ codeInjection: { ...state.codeInjection, ...newCode } })),

            updateMenuItems: (items) =>
                set({ menuItems: items }),

            addMenuItem: (item) =>
                set((state) => ({ menuItems: [...state.menuItems, item] })),

            removeMenuItem: (id) =>
                set((state) => ({ menuItems: state.menuItems.filter((i) => i.id !== id) })),

            toggleMenuItem: (id) =>
                set((state) => ({
                    menuItems: state.menuItems.map((i) =>
                        i.id === id ? { ...i, visible: !i.visible } : i
                    )
                })),

            updateFooterSettings: (newSettings) =>
                set((state) => {
                    const updates = typeof newSettings === 'function' ? newSettings(state.footerSettings) : newSettings;
                    return { footerSettings: { ...state.footerSettings, ...updates } };
                }),

            updateAdSettings: (newSettings) =>
                set((state) => {
                    const updates = typeof newSettings === 'function' ? newSettings(state.adSettings) : newSettings;
                    // Handle nested updates for social links or brand promotion if processed shallowly elsewhere, 
                    // but here we expect full partials. For safe deep merging of nested objects:
                    if (updates.brandPromotion) {
                        return {
                            adSettings: {
                                ...state.adSettings,
                                ...updates,
                                brandPromotion: { ...state.adSettings.brandPromotion, ...updates.brandPromotion }
                            }
                        };
                    }
                    return { adSettings: { ...state.adSettings, ...updates } };
                }),

            exportSettings: () => {
                const state = get();
                return JSON.stringify({
                    settings: state.settings,
                    codeInjection: state.codeInjection,
                    menuItems: state.menuItems,
                    footerSettings: state.footerSettings,
                    adSettings: state.adSettings
                });
            },

            importSettings: (json) => {
                try {
                    const parsed = JSON.parse(json);
                    // Basic validation could go here
                    set({
                        settings: { ...defaultSettings, ...parsed.settings },
                        codeInjection: { ...defaultCodeInjection, ...parsed.codeInjection },
                        menuItems: parsed.menuItems || defaultMenuItems,
                        footerSettings: { ...defaultFooterSettings, ...parsed.footerSettings },
                        adSettings: { ...defaultAdSettings, ...parsed.adSettings }
                    });
                    return true;
                } catch (e) {
                    console.error('Failed to import settings:', e);
                    return false;
                }
            },

            resetSettings: () => set({
                settings: defaultSettings,
                codeInjection: defaultCodeInjection,
                menuItems: defaultMenuItems,
                footerSettings: defaultFooterSettings,
                adSettings: defaultAdSettings
            })
        }),
        {
            name: 'settings-store-v2', // Changed to force re-hydration with new defaults
        }
    )
);
