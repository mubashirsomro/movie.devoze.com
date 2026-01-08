import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '@/data/movies';
import { movies as initialMovies } from '@/data/movies';

interface MovieStore {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  getMovieById: (id: string) => Movie | undefined;
  resetMovies: () => void;
  importMovies: (movies: Movie[]) => void;
  syncWithServer: () => Promise<void>;
  isOnline: boolean;
  lastSyncTime: Date | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      movies: initialMovies,
      isOnline: navigator.onLine,
      lastSyncTime: null,
      syncStatus: 'idle',

      addMovie: (movie: Movie) => {
        set((state) => ({
          movies: [movie, ...state.movies],
          lastSyncTime: new Date(),
          syncStatus: 'success'
        }));

        // Simulate server sync
        if (navigator.onLine) {
          setTimeout(() => {
            console.log('Movie synced with server:', movie.title);
            set({ syncStatus: 'idle' });
          }, 1000);
        }
      },

      updateMovie: (id: string, updatedMovie: Partial<Movie>) => {
        set((state) => ({
          movies: state.movies.map((movie) =>
            movie.id === id ? { ...movie, ...updatedMovie } : movie
          ),
          lastSyncTime: new Date(),
          syncStatus: 'success'
        }));

        // Simulate server sync
        if (navigator.onLine) {
          setTimeout(() => {
            console.log('Movie updated on server:', id);
            set({ syncStatus: 'idle' });
          }, 1000);
        }
      },

      deleteMovie: (id: string) => {
        set((state) => ({
          movies: state.movies.filter((movie) => movie.id !== id),
          lastSyncTime: new Date(),
          syncStatus: 'success'
        }));

        // Simulate server sync
        if (navigator.onLine) {
          setTimeout(() => {
            console.log('Movie deleted from server:', id);
            set({ syncStatus: 'idle' });
          }, 1000);
        }
      },

      getMovieById: (id: string) => {
        return get().movies.find((movie) => movie.id === id);
      },

      resetMovies: () => {
        set({ movies: initialMovies, lastSyncTime: null, syncStatus: 'idle' });
      },

      importMovies: (movies: Movie[]) => {
        set({ movies, lastSyncTime: new Date(), syncStatus: 'success' });
      },

      syncWithServer: async () => {
        if (!navigator.onLine) {
          console.log('Cannot sync: offline');
          set({ syncStatus: 'error' });
          return;
        }

        set({ syncStatus: 'syncing' });

        try {
          // Simulate server sync
          await new Promise(resolve => setTimeout(resolve, 2000));
          set((state) => ({ ...state, lastSyncTime: new Date(), syncStatus: 'success' }));
          console.log('Movies synced with server');

          // Reset status after showing success
          setTimeout(() => {
            set({ syncStatus: 'idle' });
          }, 2000);
        } catch (error) {
          console.error('Sync failed:', error);
          set({ syncStatus: 'error' });

          // Reset status after showing error
          setTimeout(() => {
            set({ syncStatus: 'idle' });
          }, 2000);
        }
      }
    }),
    {
      name: 'movie-storage',
      onRehydrateStorage: () => (state) => {
        // Update online status on rehydrate
        state.setState?.({ isOnline: navigator.onLine });
      }
    }
  )
);

// Listen for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useMovieStore.setState({ isOnline: true });
  });

  window.addEventListener('offline', () => {
    useMovieStore.setState({ isOnline: false });
  });
}

// Export functions that match the original API for backward compatibility
export const getMovies = () => useMovieStore.getState().movies;
export const getMovieById = (id: string) => useMovieStore.getState().getMovieById(id);
export const getFeaturedMovies = () => getMovies().slice(0, 4);
export const getTrendingMovies = () => getMovies().filter(m => m.rating >= 8.5);
export const getLatestMovies = () => getMovies().filter(m => m.year === 2024);
export const getMoviesByGenre = (genre: string) => getMovies().filter(m => m.genres.includes(genre));
export const getSeries = () => getMovies().filter(m => m.type === 'series');

// Export initial movies data
export { initialMovies };
