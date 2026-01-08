import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMovieStore } from '@/store/movieStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const movies = useMovieStore((state) => state.movies);
  const featuredMovies = movies.slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);

  const currentMovie = featuredMovies[currentSlide];

  return (
    <section className="relative h-[55vh] sm:h-[65vh] md:h-[85vh] overflow-hidden pt-20 md:pt-0">
      {/* Background Image */}
      <div className="absolute inset-0">
        {currentMovie.backdrop ? (
          <img
            src={currentMovie.backdrop}
            alt={currentMovie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={heroBg}
            alt="Featured"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      {/* Content Container */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">

        {/* Desktop Layout (Original) - Hidden on Mobile */}
        <div className="hidden md:block max-w-2xl animate-fade-in-up">
          {/* Tags */}
          <div className="flex items-center gap-3 mb-4">
            <span className="quality-badge">{currentMovie.quality}</span>
            <span className="rating-badge">
              <Star className="w-3 h-3 fill-current" />
              {currentMovie.rating}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {currentMovie.duration}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-7xl lg:text-8xl leading-none tracking-wider mb-4">
            {currentMovie.title}
          </h1>

          {/* Genres */}
          <div className="flex items-center gap-2 mb-4">
            {currentMovie.genres.map((genre, i) => (
              <span key={genre} className="text-sm text-muted-foreground">
                {genre}{i < currentMovie.genres.length - 1 && <span className="mx-2">•</span>}
              </span>
            ))}
            <span className="text-sm text-muted-foreground">• {currentMovie.year}</span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground line-clamp-3 mb-8 max-w-lg">
            {currentMovie.description}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <Link to={`/watch/${currentMovie.id}`}>
              <Button size="lg" className="gap-2 glow-accent px-8">
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </Button>
            </Link>
            <Link to={`/watch/${currentMovie.id}`}>
              <Button size="lg" variant="outline" className="gap-2">
                <Info className="w-5 h-5" />
                Details
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Layout (Card Carousel) - Visible only on Mobile */}
        <div className="md:hidden absolute bottom-4 left-0 right-0 px-4 overflow-visible">
          <div
            className="flex transition-transform duration-500 ease-out gap-3"
            style={{ transform: `translateX(-${currentSlide * 85}%)` }} // Slide effect
          >
            {featuredMovies.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "relative flex-shrink-0 w-[85%] rounded-xl overflow-hidden transition-all duration-300",
                  index === currentSlide ? "opacity-100 scale-100" : "opacity-50 scale-95"
                )}
              >
                {/* Glassmorphic Card Background */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md border border-white/10" />

                <div className="relative p-3 flex items-center gap-3">
                  {/* Poster Thumbnail */}
                  <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate mb-1">{movie.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                      <span className="bg-white/10 px-1.5 py-0.5 rounded">{movie.year}</span>
                      <span className="truncate">{movie.genres[0]}</span>
                    </div>
                  </div>

                  {/* Play Button (Round) */}
                  <Link to={`/watch/${movie.id}`} className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
                      <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Navigation (Desktop Only) */}
        <div className="hidden md:flex absolute bottom-8 right-8 items-center gap-4">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {featuredMovies.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  i === currentSlide ? 'bg-primary w-8' : 'bg-muted hover:bg-muted-foreground'
                )}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
