import { Link } from 'react-router-dom';
import { Play, Star, Clock, Tv, Film } from 'lucide-react';
import { Movie } from '@/data/movies';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard = ({ movie, className }: MovieCardProps) => {
  return (
    <Link
      to={`/watch/${movie.id}`}
      className={cn('movie-card group block', className)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        {/* Poster Image */}
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Quality Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className={cn(
            'quality-badge',
            movie.quality === 'CAM' && 'bg-stream-gold text-background'
          )}>
            {movie.quality}
          </span>
        </div>

        {/* Top Right Badges */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          {/* Series Badge */}
          {movie.type === 'series' && (
            <span className="px-2 py-1 rounded bg-secondary/90 text-xs font-medium flex items-center gap-1">
              <Tv className="w-3 h-3" />
              S{movie.seasons}
            </span>
          )}

          {/* Trailer Badge */}
          {movie.trailerUrl && (
            <span className="px-2 py-1 rounded bg-stream-gold/90 text-background text-xs font-medium flex items-center gap-1">
              <Film className="w-3 h-3" />
              Trailer
            </span>
          )}
        </div>

        {/* Play Overlay */}
        <div className="movie-card-overlay z-20">
          <div className="play-button">
            <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
          </div>
        </div>

        {/* Bottom Gradient with Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(transparent, hsl(var(--stream-bg)))' }}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-stream-gold fill-stream-gold" />
              {movie.rating}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {movie.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Title & Info */}
      <div className="mt-2 space-y-1">
        <h3 className="text-sm md:text-base font-medium tracking-normal leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>{movie.year}</span>
          <span>•</span>
          <span>{movie.genres[0]}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
