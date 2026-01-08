import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ className, isOpen, onClose }: SidebarProps) => {
    const location = useLocation();
    const { settings, menuItems, updateSettings } = useSettingsStore();
    const { t } = useTranslation();

    if (!settings) return null;

    // Filter visible items
    const navLinks = (menuItems || []).filter(item => item.visible);

    const handleLanguageChange = (lang: string) => {
        updateSettings({ language: lang as 'en' | 'ar' | 'fr' | 'id' | 'hi' | 'ur' | 'fil' });
        // In a real app, this would trigger i18n change.
        // For now, it persists the state as requested.
    };

    const getIcon = (label: string) => {
        const lower = label.toLowerCase();
        if (lower.includes('home')) return HomeIcon;
        if (lower.includes('movie')) return FilmIcon;
        if (lower.includes('series') || lower.includes('tv')) return TvIcon;
        if (lower.includes('animation')) return ClapperboardIcon;
        if (lower.includes('novel')) return BookOpenIcon; // In case they add it back
        if (lower.includes('download')) return DownloadIcon;
        if (lower.includes('trend') || lower.includes('most')) return FlameIcon;
        return FileIcon; // Default
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-full w-72 bg-[#0a0a0a] z-50 flex flex-col border-r border-[#222] transition-transform duration-300 transform lg:translate-x-0 overflow-y-auto scrollbar-hide",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    className
                )}
            >
                {/* Header - Logo */}
                <div className="h-20 flex items-center px-6 border-b border-[#222] pt-1">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-wider text-primary" onClick={onClose}>
                        {settings.logoUrl ? (
                            <img src={settings.logoUrl} alt={settings.siteName} className="h-8 object-contain" />
                        ) : (
                            <>
                                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                                    <FilmIcon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white">MOVIEBOX</span>
                            </>
                        )}
                    </Link>
                </div>

                {/* Content */}
                <div className="flex-1 py-6 px-4 flex flex-col gap-6">
                    {/* Language Switcher */}
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/5 outline-none uppercase">
                                    <GlobeIcon className="w-4 h-4" />
                                    <span>
                                        {
                                            {
                                                'en': 'English',
                                                'ar': 'العربية',
                                                'fr': 'Français',
                                                'id': 'Bahasa Indonesia',
                                                'hi': 'हिन्दी',
                                                'ur': 'اردو',
                                                'fil': 'Filipino'
                                            }[settings.language || 'en']
                                        }
                                    </span>
                                    <ChevronDownIcon className="w-3 h-3 ml-1" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-40 bg-[#111] border-[#333] text-white">
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => handleLanguageChange('en')}>English</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => handleLanguageChange('ar')}>العربية</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => handleLanguageChange('fr')}>Français</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => handleLanguageChange('id')}>Bahasa Indonesia</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => handleLanguageChange('hi')}>हिन्दी</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => handleLanguageChange('ur')}>اردو</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => handleLanguageChange('fil')}>Filipino</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((item) => {
                            const Icon = getIcon(item.label);
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-white/10 text-primary"
                                            : "text-[#888] hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-[#888]")} />
                                    {t(item.label)}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom - Download App Button & QR Code */}
                <div className="p-6 border-t border-[#222]">
                    {settings.downloadAppUrl && (
                        <div className="flex flex-col gap-4">
                            {/* QR Code */}
                            <div className="bg-white p-2 rounded-xl w-fit mx-auto shadow-lg shadow-black/50">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(settings.downloadAppUrl)}`}
                                    alt="Download App QR Code"
                                    className="w-20 h-20"
                                />
                            </div>

                            <a
                                href={settings.downloadAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-2 w-full bg-[#00E5FF] hover:bg-[#00cce6] text-black font-bold py-1.5 rounded-full transition-colors text-xs"
                            >
                                <div className="flex items-center gap-1">
                                    <DownloadIcon className="w-3 h-3" />
                                    <span>{t('Download App')}</span>
                                </div>
                                <QrCodeIcon className="w-3 h-3" />
                            </a>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

// Icons
const HomeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
)

const TvIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="15" x="2" y="7" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" /></svg>
)

const FilmIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" /></svg>
)

const ClapperboardIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.2 6 3 11l-.9-2.26c-.2-.5.2-1.2.7-1.4l13.77-5.5a1.2 1.2 0 0 1 1.4.6l2.3 5.6Z" /><path d="m22 22-2-11-13-5-2 5" /><path d="M7 11.5 2 22" /><path d="M20 22H0" /></svg>
)

const BookOpenIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
)

const FlameIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3.3.9 1 1.6 2 2.8z" /></svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
)

const GlobeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
)

const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
)

const FileIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>
)

const SmartphoneIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
)



const QrCodeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
)

export default Sidebar;
