import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import MovieSection from '@/components/MovieSection';
import Footer from '@/components/Footer';
import AdContainer from '@/components/AdContainer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useMovieStore } from '@/store/movieStore';
import { useSettingsStore } from '@/store/settingsStore';

const Index = () => {
  const movies = useMovieStore((state) => state.movies);
  const { adSettings } = useSettingsStore();

  const trendingMovies = movies.filter(m => m.rating >= 8.5);
  const latestMovies = movies.filter(m => m.year === 2024);
  const seriesMovies = movies.filter(m => m.type === 'series');
  const allMovies = movies;

  const [showPromoPopup, setShowPromoPopup] = useState(false);

  useEffect(() => {
    // Check for Brand Popup
    if (adSettings?.brandPromotion?.enabled && adSettings.brandPromotion.position === 'popup') {
      // Small delay to not annoy immediately
      const timer = setTimeout(() => setShowPromoPopup(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [adSettings]);

  return (
    <div className="min-h-screen bg-[--stream-bg] text-white">

      {/* Header Brand Promotion */}
      {adSettings?.brandPromotion?.enabled && adSettings.brandPromotion.position === 'header' && (
        <a
          href={adSettings.brandPromotion.targetUrl || '#'}
          target="_blank"
          rel="noreferrer"
          className="block w-full h-16 md:h-24 bg-black relative overflow-hidden group"
        >
          <img
            src={adSettings.brandPromotion.imageUrl}
            alt="Featured Promotion"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute top-1 right-2 bg-black/50 text-[10px] px-1 rounded text-white/70">SPONSORED</div>
        </a>
      )}

      <HeroSlider />

      {/* Home Page Ad */}
      <div className="container mx-auto px-4">
        <AdContainer code={adSettings?.homeAdCode} label="Advertisement" />
      </div>

      <MovieSection title="Trending Now" movies={trendingMovies} />
      <MovieSection title="Latest Movies" movies={latestMovies} />

      {/* Inter-Category Ad */}
      <div className="container mx-auto px-4 my-8">
        <AdContainer code={adSettings?.interCategoryAdCode} label="Advertisement" />
      </div>

      {/* Global Popunder/Script Injection */}
      <AdContainer code={adSettings?.popunderCode} className="hidden" />

      <MovieSection title="Popular Series" movies={seriesMovies} />
      <MovieSection title="All Movies" movies={allMovies} />

      {/* Footer Brand Promotion */}
      {adSettings?.brandPromotion?.enabled && adSettings.brandPromotion.position === 'footer' && (
        <div className="container mx-auto px-4 mt-12 mb-[-3rem]">
          <a
            href={adSettings.brandPromotion.targetUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="block w-full h-32 md:h-48 rounded-xl overflow-hidden relative group"
          >
            <img
              src={adSettings.brandPromotion.imageUrl}
              alt="Featured Promotion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            <div className="absolute top-2 right-2 bg-black/60 text-xs px-2 py-0.5 rounded text-white/80">Ad</div>
          </a>
        </div>
      )}

      <Footer />

      {/* Popup Brand Promotion */}
      {showPromoPopup && adSettings?.brandPromotion?.enabled && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative max-w-lg w-full bg-card rounded-xl overflow-hidden shadow-2xl border border-primary/20">
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 z-10 rounded-full w-8 h-8 bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={() => setShowPromoPopup(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            <a href={adSettings.brandPromotion.targetUrl || '#'} target="_blank" rel="noreferrer" className="block relative aspect-video group">
              <img
                src={adSettings.brandPromotion.imageUrl}
                alt="Special Offer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-white font-medium text-center">Click to learn more</p>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
