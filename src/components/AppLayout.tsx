import { useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileNav from '@/components/MobileNav';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    const { settings } = useSettingsStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!settings || !settings.layoutMode) return null;

    if (settings.layoutMode === 'sidebar') {
        return (
            <div className="min-h-screen bg-[--stream-bg] text-white">
                {/* Mobile Layout (Navbar + Bottom Nav) - Visible below lg */}
                <div className="lg:hidden">
                    <Navbar />
                    <main className="pb-16"> {/* Add padding for bottom nav */}
                        <Outlet />
                    </main>
                    <MobileNav />
                </div>

                {/* Desktop Layout (Sidebar + TopBar) - Visible lg and up */}
                <div className="hidden lg:flex min-h-screen">
                    {/* Sidebar */}
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        className="w-48" // Changed to 192px for more compact layout
                    />

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 pl-48">
                        <TopBar onMenuClick={() => setSidebarOpen(true)} />
                        <main className="flex-1 p-2 max-w-full">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    // Classic Mode
    return (
        <div className="min-h-screen bg-[--stream-bg] text-white">
            <Navbar />
            <main className="pb-16 lg:pb-0">
                <Outlet />
            </main>
            <MobileNav />
        </div>
    );
};

export default AppLayout;
