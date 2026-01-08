import { create } from 'zustand';
import { Movie } from '@/data/movies';

export interface DownloadItem {
  id: string;
  movie: Movie;
  quality: string;
  downloadStatus: 'pending' | 'downloading' | 'completed' | 'failed';
  downloadProgress: number;
  fileSize: string;
  episodes?: {
    id: string;
    season: number;
    episode: number;
    downloadStatus: 'pending' | 'downloading' | 'completed' | 'failed';
    downloadProgress: number;
  }[];
}

interface DownloadStore {
  downloads: DownloadItem[];
  addDownload: (movie: Movie, quality: string) => void;
  removeDownload: (id: string) => void;
  getDownloadById: (id: string) => DownloadItem | undefined;
  getCompletedDownloads: () => DownloadItem[];
  clearCompletedDownloads: () => void;
  importDownloads: (downloads: DownloadItem[]) => void;
  getFileSize: (quality: string, isSeries?: boolean) => string;
}

export const useDownloadStore = create<DownloadStore>((set, get) => ({
  downloads: [],

  addDownload: (movie, quality) => {
    const fileSize = get().getFileSize(quality, movie.type === 'series');
    const newDownload: DownloadItem = {
      id: movie.id,
      movie,
      quality,
      downloadStatus: 'downloading',
      downloadProgress: 0,
      fileSize,
      episodes: movie.type === 'series' && movie.episodeList ? movie.episodeList.map(ep => ({
        id: ep.id,
        season: ep.season,
        episode: ep.episode,
        downloadStatus: 'pending',
        downloadProgress: 0
      })) : undefined
    };

    set((state) => ({
      downloads: [...state.downloads, newDownload]
    }));

    // Simulate download progress
    const interval = setInterval(() => {
      set((state) => {
        const download = state.downloads.find(d => d.id === movie.id);
        if (!download) {
          clearInterval(interval);
          return state;
        }

        if (download.downloadProgress >= 100) {
          clearInterval(interval);
          return {
            downloads: state.downloads.map(d =>
              d.id === movie.id ? { ...d, downloadStatus: 'completed', downloadProgress: 100 } : d
            )
          };
        }

        return {
          downloads: state.downloads.map(d =>
            d.id === movie.id ? { ...d, downloadProgress: d.downloadProgress + 5 } : d
          )
        };
      });
    }, 1000);
  },

  removeDownload: (id) => {
    set((state) => ({
      downloads: state.downloads.filter(d => d.id !== id)
    }));
  },

  getDownloadById: (id) => {
    return get().downloads.find(d => d.id === id);
  },

  getCompletedDownloads: () => {
    return get().downloads.filter(d => d.downloadStatus === 'completed');
  },

  clearCompletedDownloads: () => {
    set((state) => ({
      downloads: state.downloads.filter(d => d.downloadStatus !== 'completed')
    }));
  },

  importDownloads: (downloads) => {
    set({ downloads });
  },

  getFileSize: (quality, isSeries) => {
    // Use more realistic base sizes
    const baseSize = isSeries ? 0.8 : 0.5; // GB - more realistic for streaming content
    switch (quality) {
      case '4K': return `${(baseSize * 4).toFixed(1)} GB`;
      case 'Full HD': return `${(baseSize * 2).toFixed(1)} GB`;
      case 'HD': return `${baseSize.toFixed(1)} GB`;
      default: return `${baseSize.toFixed(1)} GB`;
    }
  }
}));
