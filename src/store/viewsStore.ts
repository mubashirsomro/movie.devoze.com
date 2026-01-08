import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ViewStore {
  viewCounts: {
    [date: string]: {
      [movieId: string]: number;
    };
  };
  addView: (movieId: string) => void;
  getTodayViews: () => number;
  getMovieViews: (movieId: string) => number;
  getTotalViews: () => number;
  getViewsForDate: (date: string) => number;
  resetTodayViews: () => void;
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set, get) => ({
      viewCounts: {},

      addView: (movieId: string) => {
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const currentViewCounts = { ...get().viewCounts };
        
        if (!currentViewCounts[today]) {
          currentViewCounts[today] = {};
        }
        
        if (!currentViewCounts[today][movieId]) {
          currentViewCounts[today][movieId] = 0;
        }
        
        currentViewCounts[today][movieId] += 1;
        
        set({ viewCounts: currentViewCounts });
      },

      getTodayViews: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayViews = get().viewCounts[today] || {};
        return Object.values(todayViews).reduce((sum, count) => sum + count, 0);
      },

      getMovieViews: (movieId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const todayViews = get().viewCounts[today] || {};
        return todayViews[movieId] || 0;
      },

      getTotalViews: () => {
        const viewCounts = get().viewCounts;
        let total = 0;
        
        Object.values(viewCounts).forEach(dayViews => {
          Object.values(dayViews).forEach(count => {
            total += count;
          });
        });
        
        return total;
      },

      getViewsForDate: (date: string) => {
        const dayViews = get().viewCounts[date] || {};
        return Object.values(dayViews).reduce((sum, count) => sum + count, 0);
      },

      resetTodayViews: () => {
        const today = new Date().toISOString().split('T')[0];
        set(state => ({
          viewCounts: {
            ...state.viewCounts,
            [today]: {}
          }
        }));
      }
    }),
    {
      name: 'views-storage',
    }
  )
);