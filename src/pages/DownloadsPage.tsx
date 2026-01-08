import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Download, Trash2, Play, Clock, Tv, Film, CheckCircle, DownloadCloud, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useDownloadStore } from '@/store/downloadStore';

const DownloadsPage = () => {
  const { downloads, removeDownload, clearCompletedDownloads, getCompletedDownloads } = useDownloadStore();
  const [filter, setFilter] = useState<'all' | 'downloading' | 'completed'>('all');

  const filteredDownloads = downloads.filter(download => {
    if (filter === 'all') return true;
    if (filter === 'downloading') return download.downloadStatus === 'downloading' || download.downloadStatus === 'pending';
    if (filter === 'completed') return download.downloadStatus === 'completed';
    return true;
  });

  const completedDownloads = getCompletedDownloads();
  const totalSize = downloads.reduce((acc, download) => {
    if (download.downloadStatus === 'completed') {
      return acc + (download.movie.type === 'series' ? 2.5 : 1.2);
    }
    return acc;
  }, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'downloading':
        return <DownloadCloud className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'downloading':
        return 'Downloading';
      case 'pending':
        return 'Queued';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-[--stream-bg] text-white">
      <div className="container mx-auto px-4 py-8 pt-36 md:pt-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <h1 className="font-display text-3xl md:text-4xl tracking-wider">My Downloads</h1>
            </div>
            {completedDownloads.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearCompletedDownloads}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Completed
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Download className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{downloads.length}</p>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{completedDownloads.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <DownloadCloud className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {downloads.filter(d => d.downloadStatus === 'downloading' || d.downloadStatus === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Film className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{totalSize.toFixed(1)} GB</p>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({downloads.length})
            </Button>
            <Button
              variant={filter === 'downloading' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('downloading')}
            >
              Downloading ({downloads.filter(d => d.downloadStatus === 'downloading' || d.downloadStatus === 'pending').length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed ({completedDownloads.length})
            </Button>
          </div>

          {/* Downloads List */}
          {filteredDownloads.length > 0 ? (
            <div className="space-y-4">
              {filteredDownloads.map((download) => (
                <div key={download.id} className="bg-card rounded-lg p-6 border">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Movie Info */}
                    <div className="flex gap-4">
                      <img
                        src={download.movie.poster}
                        alt={download.movie.title}
                        className="w-20 h-28 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{download.movie.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span>{download.movie.year}</span>
                              <span>•</span>
                              <span>{download.movie.rating} ⭐</span>
                              <span>•</span>
                              <span>{download.movie.type === 'series' ? 'TV Series' : 'Movie'}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(download.downloadStatus)}
                              <span className="text-sm font-medium">{getStatusText(download.downloadStatus)}</span>
                              <span className="text-sm text-muted-foreground">• {download.fileSize}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDownload(download.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Progress Bar */}
                        {(download.downloadStatus === 'downloading' || download.downloadStatus === 'pending') && (
                          <div className="mb-4">
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${download.downloadProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.round(download.downloadProgress)}% downloaded
                            </p>
                          </div>
                        )}

                        {/* Episodes (for series) */}
                        {download.movie.type === 'series' && download.episodes && (
                          <div className="border-t pt-3">
                            <p className="text-sm font-medium mb-2">Episodes:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {download.episodes.map((episode) => (
                                <div key={episode.id} className="flex items-center gap-2 text-xs">
                                  {getStatusIcon(episode.downloadStatus)}
                                  <span>S{episode.season}:E{episode.episode}</span>
                                  {episode.downloadStatus === 'downloading' && (
                                    <span className="text-muted-foreground">({Math.round(episode.downloadProgress)}%)</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 lg:ml-auto">
                      {download.downloadStatus === 'completed' && (
                        <Link to={`/watch/${download.movie.id}`}>
                          <Button className="gap-2">
                            <Play className="w-4 h-4" />
                            Play Now
                          </Button>
                        </Link>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Download className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No downloads yet</h3>
              <p className="text-muted-foreground mb-6">Start downloading your favorite movies and series to watch offline</p>
              <Link to="/">
                <Button>Browse Content</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DownloadsPage;
