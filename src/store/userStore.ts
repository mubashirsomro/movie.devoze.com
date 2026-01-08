import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'SuperAdmin' | 'Admin' | 'Editor' | 'Uploader';
  status: 'Active' | 'Inactive';
  lastSeen: Date;
  joinedDate: Date;
  viewsToday: number;
  totalViews: number;
  ip?: string;
  location?: string;
  device?: string;
}

interface UserStore {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updatedUser: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getTotalUsers: () => number;
  getActiveUsers: () => number;
  getInactiveUsers: () => number;
  getUsersByRole: (role: User['role']) => User[];
  importUsers: (users: User[]) => void;
  resetUsers: () => void;
  updateUserActivity: (userId: string) => void;
  incrementUserViews: (userId: string) => void;
  getActiveUsersToday: () => number;
  getRecentUsers: (minutes: number) => User[];
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastSeen: new Date(), joinedDate: new Date(Date.now() - 86400000 * 30), viewsToday: 12, totalViews: 342, ip: '192.168.1.10', location: 'New York', device: 'Desktop' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active', lastSeen: new Date(), joinedDate: new Date(Date.now() - 86400000 * 25), viewsToday: 8, totalViews: 210, ip: '192.168.1.15', location: 'London', device: 'Mobile' },
        { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'Uploader', status: 'Inactive', lastSeen: new Date(Date.now() - 86400000 * 5), joinedDate: new Date(Date.now() - 86400000 * 40), viewsToday: 0, totalViews: 45, ip: '192.168.1.20', location: 'Tokyo', device: 'Tablet' },
        { id: '4', name: 'Alice Johnson', email: 'alice@example.com', role: 'Uploader', status: 'Active', lastSeen: new Date(), joinedDate: new Date(Date.now() - 86400000 * 15), viewsToday: 15, totalViews: 187, ip: '192.168.1.25', location: 'Paris', device: 'Desktop' },
        { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor', status: 'Active', lastSeen: new Date(Date.now() - 3600000), joinedDate: new Date(Date.now() - 86400000 * 10), viewsToday: 5, totalViews: 98, ip: '192.168.1.30', location: 'Sydney', device: 'Mobile' },
      ],

      addUser: (user) => {
        const newUser = {
          ...user,
          id: Date.now().toString(),
          lastSeen: new Date(),
          joinedDate: new Date(),
          viewsToday: 0,
          totalViews: 0,
        };
        set((state) => ({
          users: [...state.users, newUser],
        }));
      },

      updateUser: (id, updatedUser) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updatedUser } : user
          ),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },

      getUserById: (id) => {
        return get().users.find((user) => user.id === id);
      },

      getTotalUsers: () => {
        return get().users.length;
      },

      getActiveUsers: () => {
        return get().users.filter(user => user.status === 'Active').length;
      },

      getInactiveUsers: () => {
        return get().users.filter(user => user.status === 'Inactive').length;
      },

      getUsersByRole: (role) => {
        return get().users.filter(user => user.role === role);
      },

      importUsers: (users) => {
        set({ users });
      },

      resetUsers: () => {
        set({ users: [] });
      },

      updateUserActivity: (userId) => {
        set((state) => ({
          users: state.users.map(user =>
            user.id === userId
              ? { ...user, lastSeen: new Date() }
              : user
          ),
        }));
      },

      incrementUserViews: (userId) => {
        const today = new Date().toISOString().split('T')[0];
        const todayFormatted = new Date().toISOString();

        set((state) => ({
          users: state.users.map(user => {
            if (user.id === userId) {
              // Check if it's the same day to update viewsToday
              const lastSeenDate = new Date(user.lastSeen).toISOString().split('T')[0];
              const isToday = lastSeenDate === today;

              return {
                ...user,
                lastSeen: new Date(),
                viewsToday: isToday ? user.viewsToday + 1 : 1,
                totalViews: user.totalViews + 1,
              };
            }
            return user;
          }),
        }));
      },

      getActiveUsersToday: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().users.filter(user => {
          const userDate = new Date(user.lastSeen).toISOString().split('T')[0];
          return userDate === today && user.status === 'Active';
        }).length;
      },

      getRecentUsers: (minutes) => {
        const timeAgo = new Date(Date.now() - minutes * 60000);
        return get().users.filter(user => user.lastSeen >= timeAgo);
      },
    }),
    {
      name: 'user-storage',
    }
  )
);