import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import MovieCard from '@/components/MovieCard';
import Footer from '@/components/Footer';
import { getMovies } from '@/store/movieStore';
import { Button } from '@/components/ui/button';

const GenrePage = () => {
  const { genre } = useParams();
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');

  // Get all movies
  const allMovies = getMovies();

  // Filter movies by genre (case-insensitive)
  const genreMovies = allMovies.filter(movie =>
    movie.genres.some(g => g.toLowerCase() === genre?.toLowerCase())
  );

  // Sort movies
  const sortedMovies = [...genreMovies].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'year':
        return b.year - a.year;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Format genre name for display
  const formatGenreName = (genreName: string | undefined) => {
    if (!genreName) return 'Unknown Genre';
    return genreName.charAt(0).toUpperCase() + genreName.slice(1);
  };

  return (
    <div className="min-h-screen bg-[--stream-bg] text-white">

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div>
                <h1 className="font-display text-3xl md:text-4xl tracking-wider">
                  {formatGenreName(genre)} Movies
                </h1>
                <p className="text-muted-foreground mt-1">
                  {genreMovies.length} {genreMovies.length === 1 ? 'movie' : 'movies'} found
                </p>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'year' | 'title')}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
              >
                <option value="rating">Sort by Rating</option>
                <option value="year">Sort by Year</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>

          {/* Movies Grid */}
          {sortedMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {sortedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  className="w-full"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                  <Filter className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">No movies found</h3>
                <p className="text-muted-foreground mb-8">
                  We couldn't find any movies in the "{formatGenreName(genre)}" genre.
                  Try browsing our other categories or check back later.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/">
                    <Button>Browse All Movies</Button>
                  </Link>
                  <Link to="/movies">
                    <Button variant="outline">All Movies</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Related Genres */}
          {genreMovies.length > 0 && (
            <div className="mt-16 pt-8 border-t">
              <h2 className="font-display text-2xl tracking-wider mb-6">Browse Other Genres</h2>
              <div className="flex flex-wrap gap-3">
                {['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'].map((otherGenre) => (
                  <Link
                    key={otherGenre}
                    to={`/genre/${otherGenre.toLowerCase()}`}
                    className="px-4 py-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                  >
                    {otherGenre}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default GenrePage;
