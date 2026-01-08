import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Genre {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

interface GenreStore {
  genres: Genre[];
  addGenre: (genre: Omit<Genre, 'id' | 'slug'>) => void;
  updateGenre: (id: string, updatedGenre: Partial<Genre>) => void;
  deleteGenre: (id: string) => void;
  getGenreById: (id: string) => Genre | undefined;
  getGenreBySlug: (slug: string) => Genre | undefined;
  importGenres: (genres: Genre[]) => void;
  resetGenres: () => void;
}

const defaultGenres: Genre[] = [
  { id: '1', name: 'Action', slug: 'action', color: '#ef4444' },
  { id: '2', name: 'Comedy', slug: 'comedy', color: '#22c55e' },
  { id: '3', name: 'Drama', slug: 'drama', color: '#3b82f6' },
  { id: '4', name: 'Horror', slug: 'horror', color: '#8b5cf6' },
  { id: '5', name: 'Sci-Fi', slug: 'sci-fi', color: '#06b6d4' },
  { id: '6', name: 'Romance', slug: 'romance', color: '#ec4899' },
  { id: '7', name: 'Fantasy', slug: 'fantasy', color: '#f59e0b' },
  { id: '8', name: 'Thriller', slug: 'thriller', color: '#64748b' },
  { id: '9', name: 'Adventure', slug: 'adventure', color: '#84cc16' },
  { id: '10', name: 'Crime', slug: 'crime', color: '#f97316' },
  { id: '11', name: 'Mystery', slug: 'mystery', color: '#8b5cf6' },
  { id: '12', name: 'Animation', slug: 'animation', color: '#14b8a6' }
];

export const useGenreStore = create<GenreStore>()(
  persist(
    (set, get) => ({
      genres: defaultGenres,

      addGenre: (genre: Omit<Genre, 'id' | 'slug'>) => {
        const newGenre: Genre = {
          id: Date.now().toString(),
          slug: genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim('-'),
          ...genre
        };
        set((state) => ({
          genres: [...state.genres, newGenre]
        }));
      },

      updateGenre: (id, updatedGenre) => {
        set((state) => ({
          genres: state.genres.map((genre) =>
            genre.id === id ? { ...genre, ...updatedGenre } : genre
          )
        }));
      },

      deleteGenre: (id) => {
        set((state) => ({
          genres: state.genres.filter((genre) => genre.id !== id)
        }));
      },

      getGenreById: (id) => {
        return get().genres.find((genre) => genre.id === id);
      },

      getGenreBySlug: (slug) => {
        return get().genres.find((genre) => genre.slug === slug);
      },

      importGenres: (genres) => {
        set({ genres });
      },

      resetGenres: () => {
        set({ genres: defaultGenres });
      }
    }),
    {
      name: 'genre-storage'
    }
  )
);

// Export functions for backward compatibility
export const getGenres = () => useGenreStore.getState().genres;
export const getGenreById = (id: string) => useGenreStore.getState().getGenreById(id);
export const getGenreBySlug = (slug: string) => useGenreStore.getState().getGenreBySlug(slug);
