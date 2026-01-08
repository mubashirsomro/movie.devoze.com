
import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

const PopupAd = () => {
    const { adSettings } = useSettingsStore();
    const settings = adSettings?.popupSettings;
    const location = useLocation();

    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // 0. Safety Check
        if (!settings) return;

        // 1. Hide on Admin Panel
        if (location.pathname.startsWith('/admin')) return;

        // 2. Frequency Check (60 Minutes)
        const lastShown = localStorage.getItem('popup_last_shown');
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        if (lastShown && (now - parseInt(lastShown) < oneHour)) {
            // Debug: console.log("Popup skipped: Cooldown active");
            return;
        }

        // Show popup if enabled
        if (settings.enabled) {
            const showTimer = setTimeout(() => {
                setIsVisible(true);
                setTimeLeft(settings.timer || 20);

                // Mark as shown when triggered
                localStorage.setItem('popup_last_shown', Date.now().toString());
            }, 1000); // 1 second delay after site load

            return () => clearTimeout(showTimer);
        }
    }, [settings?.enabled, settings?.timer, location.pathname]);

    useEffect(() => {
        if (isVisible && timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [isVisible, timeLeft]);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!settings || !isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="relative bg-[#111] border border-[#333] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Header / Timer Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
                    <div className="flex items-center gap-2 text-yellow-400 font-medium">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Please wait <span className="font-bold text-white text-base">{timeLeft}s</span> to continue</span>
                    </div>

                    {/* Close Button - Only visible when timer is 0 */}
                    {timeLeft <= 0 && (
                        <Button
                            onClick={handleClose}
                            variant="destructive"
                            size="sm"
                            className="h-8 px-4 font-bold"
                        >
                            Close Ad <X className="w-4 h-4 ml-1" />
                        </Button>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-1 min-h-[300px] flex items-center justify-center bg-black relative">
                    {/* Overlay to prevent clicks on code/iframe if needed, OR allow clicks (since it's an ad) */}

                    {settings.type === 'image' && settings.imageUrl ? (
                        <a
                            href={settings.targetUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full h-full"
                        >
                            <img
                                src={settings.imageUrl}
                                alt="Advertisement"
                                className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                            />
                        </a>
                    ) : settings.type === 'code' && settings.code ? (
                        <div
                            className="w-full h-full flex items-center justify-center text-white p-4"
                            dangerouslySetInnerHTML={{ __html: settings.code }}
                        />
                    ) : (
                        <div className="text-gray-500 p-10 flex flex-col items-center">
                            <span className="mb-2">Ad Configuration Incomplete</span>
                            <span className="text-xs">Go to Admin &gt; Monetization to configure</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopupAd;
