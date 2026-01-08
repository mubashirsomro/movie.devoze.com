import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => void;
  updateCategory: (id: string, updatedCategory: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  importCategories: (categories: Category[]) => void;
  resetCategories: () => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Featured', slug: 'featured', color: '#ef4444' },
  { id: '2', name: 'Trending', slug: 'trending', color: '#f59e0b' },
  { id: '3', name: 'New Releases', slug: 'new-releases', color: '#10b981' },
  { id: '4', name: 'Popular', slug: 'popular', color: '#8b5cf6' },
  { id: '5', name: 'Top Rated', slug: 'top-rated', color: '#3b82f6' },
  { id: '6', name: 'Coming Soon', slug: 'coming-soon', color: '#ec4899' },
  { id: '7', name: 'Exclusive', slug: 'exclusive', color: '#06b6d4' },
  { id: '8', name: 'Action', slug: 'action', color: '#ef4444' },
  { id: '9', name: 'Horror', slug: 'horror', color: '#8b5cf6' },
  { id: '10', name: 'Romance', slug: 'romance', color: '#ec4899' },
  { id: '11', name: 'Comedy', slug: 'comedy', color: '#22c55e' },
  { id: '12', name: 'Sci-Fi', slug: 'sci-fi', color: '#06b6d4' },
  { id: '13', name: 'Anime', slug: 'anime', color: '#f97316' }
];

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,

      addCategory: (category: Omit<Category, 'id' | 'slug'>) => {
        const newCategory: Category = {
          id: Date.now().toString(),
          slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim('-'),
          ...category
        };
        set((state) => ({
          categories: [...state.categories, newCategory]
        }));
      },

      updateCategory: (id, updatedCategory) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updatedCategory } : category
          )
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id)
        }));
      },

      getCategoryById: (id) => {
        return get().categories.find((category) => category.id === id);
      },

      getCategoryBySlug: (slug) => {
        return get().categories.find((category) => category.slug === slug);
      },

      importCategories: (categories) => {
        set({ categories });
      },

      resetCategories: () => {
        set({ categories: defaultCategories });
      }
    }),
    {
      name: 'category-storage'
    }
  )
);

// Export functions for backward compatibility
export const getCategories = () => useCategoryStore.getState().categories;
export const getCategoryById = (id: string) => useCategoryStore.getState().getCategoryById(id);
export const getCategoryBySlug = (slug: string) => useCategoryStore.getState().getCategoryBySlug(slug);