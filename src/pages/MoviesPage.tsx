import { useState } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useMovieStore } from '@/store/movieStore';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import AdContainer from '@/components/AdContainer';

const MoviesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const movies = useMovieStore((state) => state.movies);
  const { adSettings } = useSettingsStore();

  const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Fantasy', 'Thriller'];

  const filteredMovies = selectedGenre && selectedGenre !== 'All'
    ? movies.filter(m => m.genres.includes(selectedGenre) && m.type === 'movie')
    : movies.filter(m => m.type === 'movie');

  return (
    <div className="min-h-screen bg-[--stream-bg] text-white">

      <div className="container mx-auto px-4 py-8 pt-36 md:pt-24">
        <div className="container mx-auto px-4">

          {/* Ad Space */}
          <div className="mb-8">
            <AdContainer code={adSettings?.moviesAdCode} label="Advertisement" />
          </div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl md:text-5xl tracking-wider">Movies</h1>
              <p className="text-muted-foreground mt-1">Explore our collection of movies</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={cn(viewMode === 'grid' && 'bg-primary text-primary-foreground')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('list')}
                className={cn(viewMode === 'list' && 'bg-primary text-primary-foreground')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre === 'All' ? null : genre)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  (selectedGenre === genre || (genre === 'All' && !selectedGenre))
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-primary/20'
                )}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Movies Grid */}
          <div className={cn(
            'grid gap-3 md:gap-6',
            viewMode === 'grid'
              ? 'grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
              : 'grid-cols-1'
          )}>
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No movies found in this genre.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MoviesPage;
