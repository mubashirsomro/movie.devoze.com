import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, Calendar, Tv, Play, Download, Share2, Heart, Video, DownloadCloud } from 'lucide-react';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import MovieSection from '@/components/MovieSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getMovieById, getMovies } from '@/store/movieStore';
import { useDownloadStore } from '@/store/downloadStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useViewStore } from '@/store/viewsStore';
import { useUserStore } from '@/store/userStore';
import AdContainer from '@/components/AdContainer';

const WatchPage = () => {
  const { id } = useParams();
  const movie = getMovieById(id || '1');
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<'HD' | 'Full HD' | '4K'>('HD');
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);

  // Download store
  const { addDownload, getDownloadById, getFileSize } = useDownloadStore();
  const existingDownload = movie ? getDownloadById(movie.id) : null;

  // Toggle favorite functionality
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (isFavorite) {
      // Remove from favorites
      const newFavorites = favorites.filter((favId: string) => favId !== movie.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      // Add to favorites
      const newFavorites = [...favorites, movie.id];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(true);
    }
  };

  // Complete download functionality
  const handleCompleteDownload = async () => {
    if (movie) {
      // Add download to store
      addDownload(movie, selectedQuality);
      setIsDownloadDialogOpen(false);

      try {
        // Get the download item to access its properties
        const downloadItem = { id: movie.id, movie, quality: selectedQuality, downloadStatus: 'downloading', downloadProgress: 0, fileSize: getFileSize(selectedQuality, movie.type === 'series') };

        // In a real implementation, this would fetch the actual video file from a server
        // For now, we'll simulate the download with a more realistic approach

        // Create a temporary download link for the video
        // We'll try to get a more appropriate download URL from the embed code or servers
        let downloadUrl = '';

        // Check for custom download URL first
        if (movie.downloadUrl) {
          downloadUrl = movie.downloadUrl;
        }
        // If embedCode exists and is an iframe, extract the source
        else if (movie.embedCode) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(movie.embedCode, 'text/html');
          const iframe = doc.querySelector('iframe');
          if (iframe) {
            downloadUrl = iframe.src;
          } else {
            // If embedCode is a URL, use it directly
            try {
              new URL(movie.embedCode);
              downloadUrl = movie.embedCode;
            } catch (e) {
              // If not a valid URL, try trailer URL
              downloadUrl = movie.trailerUrl || movie.poster;
            }
          }
        } else {
          // Fallback to trailer URL or poster
          downloadUrl = movie.trailerUrl || movie.poster;
        }

        // Create a temporary download link
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${movie.title.replace(/[^a-z0-9]/gi, '_')}_${selectedQuality}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Redirect to downloads page after a short delay
        setTimeout(() => {
          window.location.href = '/downloads';
        }, 1500);
      } catch (error) {
        console.error('Download failed:', error);
        // In case of error, still redirect to downloads page
        window.location.href = '/downloads';
      }
    }
  };

  // Download functionality
  const handleDownload = () => {
    // Create a temporary link to download movie poster
    const link = document.createElement('a');
    link.href = movie.poster;
    link.download = `${movie.title.replace(/[^a-z0-9]/gi, '_')}_poster.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addView = useViewStore((state) => state.addView);
  const incrementUserViews = useUserStore((state) => state.incrementUserViews);

  // Function to get or create a user ID
  const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `user_${Date.now()}`;
      localStorage.setItem('userId', userId);
    }
    return userId;
  };

  // Check if movie is in favorites on component mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(movie.id));
  }, [movie.id]);

  // Track view and user activity when the page loads
  useEffect(() => {
    if (movie) {
      addView(movie.id);

      // Track user activity
      const userId = getUserId();
      incrementUserViews(userId);
    }
  }, [movie, addView, incrementUserViews, getUserId]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display mb-4">Movie Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  // Get episodes from episodeList or create dummy ones for backward compatibility
  const episodes = movie.type === 'series'
    ? (movie.episodeList && movie.episodeList.length > 0
      ? movie.episodeList
      : Array.from({ length: movie.episodes || 8 }, (_, i) => {
        const seasonNumber = Math.floor(i / 8) + 1; // 8 episodes per season
        const episodeNumber = (i % 8) + 1;
        return {
          id: `ep-${i + 1}`,
          title: `Episode ${episodeNumber}`,
          season: seasonNumber,
          episode: episodeNumber,
          description: '',
          duration: '45 min',
          thumbnail: '',
          trailerUrl: '',
          embedCode: '',
          servers: []
        };
      })
    )
    : [];

  // Get unique seasons from episodes
  const seasons = Array.from(new Set(episodes.map(ep => ep.season))).sort((a, b) => a - b);

  // Filter episodes by selected season
  const seasonEpisodes = episodes.filter(ep => ep.season === selectedSeason);

  // Get the current episode's embed code, or fall back to the main movie embed code
  const currentEpisode = selectedEpisode
    ? episodes.find(ep => ep.id === selectedEpisode)
    : seasonEpisodes[0];

  const embedCode = currentEpisode?.embedCode || movie.embedCode;

  return (
    <div className="min-h-screen bg-background">

      <main className="pt-24 md:pt-20 pb-24 md:pb-12">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-2 mb-2">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Video Player */}
        <div className="container mx-auto px-4 mb-8">
          <div className="video-player-container">
            <VideoPlayer
              servers={movie.servers || ['Vidcloud', 'Filemoon']}
              title={movie.type === 'series' && currentEpisode ? currentEpisode.title : movie.title}
              embedCode={embedCode}
              trailerUrl={movie.trailerUrl}
              poster={movie.poster}
            />
          </div>

          {/* Ad Space */}
          <div className="mt-6">
            <AdContainer code={useSettingsStore.getState().adSettings?.watchAdCode} label="Advertisement" />
          </div>
        </div>

        {/* Movie Info */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full max-w-sm mx-auto rounded-xl shadow-2xl"
                />

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 max-w-sm mx-auto">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => {
                      // Scroll to video player
                      const videoPlayer = document.querySelector('.video-player-container');
                      if (videoPlayer) {
                        videoPlayer.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Play Now
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFavorite}
                    className={isFavorite ? 'text-red-500 hover:text-red-600' : ''}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      // Share functionality
                      if (navigator.share) {
                        navigator.share({
                          title: movie.title,
                          text: `Check out ${movie.title} on StreamSphere Hub!`,
                          url: window.location.href
                        });
                      } else {
                        // Fallback - copy to clipboard
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownload}
                    title="Download Poster"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                {/* Complete Download Button */}
                <div className="mt-4">
                  <Dialog open={isDownloadDialogOpen} onOpenChange={setIsDownloadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        className="w-full gap-2"
                        disabled={!!existingDownload}
                      >
                        <DownloadCloud className="w-4 h-4" />
                        {existingDownload ?
                          (existingDownload.downloadStatus === 'completed' ? 'Downloaded' :
                            existingDownload.downloadStatus === 'downloading' ? `Downloading... ${Math.round(existingDownload.downloadProgress)}%` :
                              'Download Queued') :
                          `Download ${movie.type === 'series' ? 'Series' : 'Movie'}`
                        }
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Download {movie.type === 'series' ? 'Series' : 'Movie'}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">{movie.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {movie.type === 'series' ? `${movie.episodes} Episodes` : `${movie.duration} • ${movie.year}`}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Select Quality</label>
                          <div className="space-y-2">
                            {(['HD', 'Full HD', '4K'] as const).map((quality) => (
                              <div
                                key={quality}
                                onClick={() => setSelectedQuality(quality)}
                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${selectedQuality === quality
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                                  }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border-2 ${selectedQuality === quality
                                    ? 'border-primary bg-primary'
                                    : 'border-muted-foreground'
                                    }`}>
                                    {selectedQuality === quality && (
                                      <div className="w-2 h-2 rounded-full bg-white mx-auto mt-0.5" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">{quality}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {getFileSize(quality, movie.type === 'series')}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsDownloadDialogOpen(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleCompleteDownload}
                            className="flex-1 gap-2"
                          >
                            <DownloadCloud className="w-4 h-4" />
                            Download {getFileSize(selectedQuality, movie.type === 'series')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {existingDownload && existingDownload.downloadStatus === 'downloading' && (
                    <div className="mt-2">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${existingDownload.downloadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Details */}
            <div className="lg:col-span-2">
              {/* Title */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wider mb-4">
                {movie.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="rating-badge">
                  <Star className="w-3 h-3 fill-current" />
                  {movie.rating}
                </span>
                <span className="quality-badge">{movie.quality}</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {movie.year}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {movie.duration}
                </span>
                {movie.type === 'series' && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Tv className="w-4 h-4" />
                    {movie.seasons} Seasons • {movie.episodes} Episodes
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-4 py-1.5 rounded-full bg-secondary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-display text-xl tracking-wider mb-3">Synopsis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Episodes (for series) */}
              {movie.type === 'series' && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-xl tracking-wider">Episodes</h3>
                    {seasons.length > 1 && (
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Season:</label>
                        <select
                          value={selectedSeason}
                          onChange={(e) => {
                            const newSeason = parseInt(e.target.value);
                            setSelectedSeason(newSeason);
                            // Reset selected episode and auto-select first episode of new season
                            const newSeasonEpisodes = episodes.filter(ep => ep.season === newSeason);
                            if (newSeasonEpisodes.length > 0) {
                              setSelectedEpisode(newSeasonEpisodes[0].id);
                            } else {
                              setSelectedEpisode(null);
                            }
                          }}
                          className="px-3 py-1 rounded-md border border-input bg-background text-sm"
                        >
                          {seasons.map(season => (
                            <option key={season} value={season}>
                              Season {season}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    {seasonEpisodes.length > 0 ? (
                      seasonEpisodes.map((ep) => (
                        <div
                          key={ep.id}
                          onClick={() => setSelectedEpisode(ep.id)}
                          className={`flex items-center gap-4 p-4 rounded-lg transition-colors cursor-pointer group ${selectedEpisode === ep.id || (!selectedEpisode && seasonEpisodes.indexOf(ep) === 0)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card hover:bg-secondary'
                            }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedEpisode === ep.id || (!selectedEpisode && seasonEpisodes.indexOf(ep) === 0)
                            ? 'bg-primary-foreground text-primary'
                            : 'bg-secondary group-hover:bg-primary'
                            }`}>
                            <Play className="w-4 h-4 group-hover:fill-current" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{ep.title}</h4>
                            <p className={`text-sm ${selectedEpisode === ep.id || (!selectedEpisode && seasonEpisodes.indexOf(ep) === 0)
                              ? 'text-primary-foreground/80'
                              : 'text-muted-foreground'
                              }`}>
                              Episode {ep.episode} • {ep.duration}
                              {ep.description && ` • ${ep.description.substring(0, 100)}${ep.description.length > 100 ? '...' : ''}`}
                            </p>
                          </div>
                          {ep.embedCode && (
                            <div className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                              <span className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                Embed Available
                              </span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No episodes available for Season {selectedSeason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Servers */}
              <div className="mb-8">
                <h3 className="font-display text-xl tracking-wider mb-3">Servers</h3>
                <div className="flex flex-wrap gap-2">
                  {(movie.servers || []).map((server, i) => (
                    <button
                      key={server}
                      className={`server-button ${i === 0 ? 'active' : ''}`}
                    >
                      {server}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Movies */}
          <MovieSection
            title="You May Also Like"
            movies={getMovies().filter(m => m.id !== movie.id).slice(0, 6)}
            className="mt-12"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WatchPage;
