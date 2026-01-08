import { Toaster } from "@/components/ui/toaster";
import MobileNav from "@/components/MobileNav";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import WatchPage from "./pages/WatchPage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import TrendingPage from "./pages/TrendingPage";
import GenrePage from "./pages/GenrePage";
import AdminPage from "./pages/AdminPage";
import DownloadsPage from "./pages/DownloadsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useLocation } from "react-router-dom";

import AppLayout from "@/components/AppLayout";
import PopupAd from "@/components/PopupAd";

const App = () => {
  const { settings, codeInjection } = useSettingsStore();

  useEffect(() => {
    // Dynamic Font Loading
    const font = settings?.fontStyle || 'Inter';
    const weight = settings?.fontWeight || '400';
    const linkId = 'dynamic-font-link';
    const styleId = 'dynamic-font-style';

    // 1. Link Tag for Google Fonts
    let link = document.getElementById(linkId) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;

    // 2. Style Tag for Global Application
    let style = document.getElementById(styleId) as HTMLStyleElement;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.innerHTML = `
        * {
            font-family: '${font}', sans-serif !important;
        }
        body {
            font-weight: ${weight} !important;
        }
    `;

  }, [settings?.fontStyle, settings?.fontWeight]);

  useEffect(() => {
    // Update Title & Favicon
    document.title = settings.siteName;
    if (settings.faviconUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) link.href = settings.faviconUrl;
    }

    // Inject Head Code
    if (codeInjection.headCode) {
      const script = document.createElement('script');
      script.text = codeInjection.headCode;
      document.head.appendChild(script);
      return () => { document.head.removeChild(script) };
    }
  }, [settings, codeInjection.headCode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PopupAd />
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/watch/:id" element={<WatchPage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/series" element={<SeriesPage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/genre/:slug" element={<GenrePage />} />
                <Route path="/downloads" element={<DownloadsPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Route outside Layout? Or inside? Usually Admin has internal layout handling. 
                  However, `AdminPage` currently has its own sidebar. 
                  We should keep AdminPage independent of AppLayout to avoid double sidebars. 
              */}
              <Route path="/admin/:tab?" element={<AdminPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
