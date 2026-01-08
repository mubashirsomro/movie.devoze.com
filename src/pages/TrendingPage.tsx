import MovieCard from '@/components/MovieCard';
import Footer from '@/components/Footer';
import { getTrendingMovies } from '@/store/movieStore';

import { useSettingsStore } from '@/store/settingsStore';
import AdContainer from '@/components/AdContainer';

const TrendingPage = () => {
  const trending = getTrendingMovies();
  const { adSettings } = useSettingsStore();

  return (
    <div className="min-h-screen bg-background">

      <main className="pt-36 pb-24 md:pt-24 md:pb-12">
        <div className="container mx-auto px-4">

          {/* Ad Space */}
          <div className="mb-8">
            <AdContainer code={adSettings?.trendingAdCode} label="Advertisement" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl md:text-5xl tracking-wider">Trending Now</h1>
            <p className="text-muted-foreground mt-1">What everyone is watching right now</p>
          </div>

          {/* Trending Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
            {trending.map((movie, index) => (
              <div key={movie.id} className="relative">
                <span className="absolute -left-2 -top-2 z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-display text-lg">
                  {index + 1}
                </span>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrendingPage;
