import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipForward, SkipBack, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  servers?: string[];
  title: string;
  embedCode?: string;
  trailerUrl?: string;
  poster?: string;
}

const VideoPlayer = ({ servers = [], title, embedCode, trailerUrl, poster }: VideoPlayerProps) => {
  const [activeServer, setActiveServer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  // Auto-show trailer if no embed code is available
  const [showTrailer, setShowTrailer] = useState(!embedCode && !!trailerUrl);

  // Check if string is a URL
  const isUrl = (str: string): boolean => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const getVideoSource = () => {
    // Check for embed code first (when not in trailer mode)
    if (embedCode && !showTrailer) {
      // Check if embedCode is a URL instead of an iframe
      if (isUrl(embedCode)) {
        // Convert various video service URLs to embed URLs
        let embedUrl = embedCode;
                
        // Handle YouTube URLs
        if (embedCode.includes('youtube.com') || embedCode.includes('youtu.be')) {
          const youtubeEmbedUrl = getYouTubeEmbedUrl(embedCode);
          if (youtubeEmbedUrl) {
            embedUrl = youtubeEmbedUrl;
          }
        }
        // Handle other common video platforms
        else if (embedCode.includes('vimeo.com')) {
          // Convert Vimeo URL to embed URL
          const videoId = embedCode.split('/').pop();
          if (videoId) {
            embedUrl = `https://player.vimeo.com/video/${videoId}`;
          }
        }
        else if (embedCode.includes('dailymotion.com') || embedCode.includes('dai.ly')) {
          // Extract video ID from Dailymotion URL
          const match = embedCode.match(/(?:dailymotion.com\/video\/|\/video\/|dai.ly\/)([^_\/#\?\s]+)/);
          if (match && match[1]) {
            embedUrl = `https://www.dailymotion.com/embed/video/${match[1]}`;
          }
        }
        // Handle common streaming services used in movie sites
        else if (embedCode.includes('vidcloud') || embedCode.includes('filemoon') || embedCode.includes('streamsb') || embedCode.includes('streamtape')) {
          // For streaming services, we'll use the URL as is but ensure it's an embed URL
          embedUrl = embedCode;
                  
          // If it's not already an embed URL, try to convert it
          if (!embedCode.includes('/embed-') && !embedCode.includes('/e/')) {
            // Common pattern: replace /v/ with /e/
            embedUrl = embedCode.replace(/\/v\//g, '/e/');
            if (!embedUrl.includes('/e/')) {
              // Add /e/ before the last part of the path if it's not already an embed URL
              try {
                const url = new URL(embedUrl);
                if (!url.pathname.includes('/embed-') && !url.pathname.includes('/e/')) {
                  // Add /e/ before the last path segment
                  const pathSegments = url.pathname.split('/').filter(segment => segment !== '');
                  if (pathSegments.length > 0) {
                    const lastSegment = pathSegments.pop();
                    if (lastSegment) {
                      url.pathname = '/' + pathSegments.join('/') + '/e/' + lastSegment;
                    }
                  }
                  embedUrl = url.toString();
                }
              } catch (e) {
                // If URL parsing fails, just use the original URL
                embedUrl = embedCode;
              }
            }
          }
        }
                
        // Create iframe with the processed URL
        const iframeCode = `<iframe 
          src="${embedUrl}?autoplay=1&mute=1" 
          width="100%" 
          height="100%" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
          class="w-full h-full"
        ></iframe>`;
        return { type: 'embed', src: iframeCode };
      } else {
        // If it's already an iframe embed code, use it directly
        return { type: 'embed', src: embedCode };
      }
    }
    // Check for trailer URL
    if (trailerUrl && (showTrailer || !embedCode)) {
      const embedUrl = getYouTubeEmbedUrl(trailerUrl);
      if (embedUrl) {
        const iframeCode = `<iframe 
          src="${embedUrl}?autoplay=1&mute=1" 
          width="100%" 
          height="100%" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
          class="w-full h-full"
        ></iframe>`;
        return { type: 'embed', src: iframeCode };
      }
    }
    return { type: 'placeholder', src: null };
  };

  const videoSource = getVideoSource();

  return (
    <div className="w-full">
      {/* Player Container */}
      <div 
        className="relative aspect-video bg-black rounded-lg overflow-hidden group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Content */}
        {videoSource.type === 'embed' ? (
          <div 
            className="absolute inset-0 w-full h-full"
            dangerouslySetInnerHTML={{ __html: videoSource.src }}
          />
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-background">
              {poster && (
                <img 
                  src={poster} 
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
              )}
              <div className="relative text-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="play-button w-20 h-20 mb-4"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-primary-foreground" />
                  ) : (
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  )}
                </button>
                <p className="text-muted-foreground">
                  {isPlaying ? 'Now Playing' : 'Click to Play'}
                </p>
                {servers.length > 0 && !showTrailer && (
                  <p className="text-sm text-muted-foreground mt-1">Server: {servers[activeServer]}</p>
                )}
                {showTrailer && (
                  <p className="text-sm text-muted-foreground mt-1">Trailer</p>
                )}
              </div>
            </div>

            {/* Controls Overlay - Only show for placeholder */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300',
              showControls ? 'opacity-100' : 'opacity-0'
            )}>
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 p-4">
                <h3 className="font-display text-xl tracking-wider">{title}</h3>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                {/* Progress Bar */}
                <div className="relative h-1 bg-muted rounded-full cursor-pointer group/progress">
                  <div className="absolute left-0 top-0 h-full w-1/3 bg-primary rounded-full" />
                  <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-primary transition-colors">
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <button className="hover:text-primary transition-colors">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button className="hover:text-primary transition-colors">
                      <SkipForward className="w-5 h-5" />
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className="hover:text-primary transition-colors">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-sm text-muted-foreground">00:00 / 2:15:00</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="hover:text-primary transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button className="hover:text-primary transition-colors">
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Server & Trailer Selection */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-muted-foreground">Select Server</h4>
          {trailerUrl && (
            <Button
              variant={showTrailer ? "default" : "outline"}
              size="sm"
              onClick={() => setShowTrailer(!showTrailer)}
              className="gap-2"
            >
              <Film className="w-4 h-4" />
              {showTrailer || !embedCode ? "Watch Movie" : "Watch Trailer"}
            </Button>
          )}
        </div>
        {!showTrailer && servers.length > 0 && embedCode && (
          <div className="flex flex-wrap gap-2">
            {servers.map((server, i) => (
              <button
                key={server}
                onClick={() => setActiveServer(i)}
                className={cn(
                  'server-button',
                  i === activeServer && 'active'
                )}
              >
                {server}
              </button>
            ))}
          </div>
        )}
        {(showTrailer || !embedCode) && (
          <div className="text-sm text-muted-foreground">
            Now playing: Trailer
          </div>
        )}
        {!showTrailer && embedCode && servers.length === 0 && (
          <div className="text-sm text-muted-foreground">
            Now playing: Movie
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
