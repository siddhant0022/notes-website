import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',

      setTheme: (theme) => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
        set({ theme });
      },

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },

      initTheme: () => {
        const { theme } = get();
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
      },
    }),
    {
      name: 'gcet-theme',
      onRehydrateStorage: () => (state) => {
        state?.initTheme();
      },
    }
  )
);

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

export const useFilterStore = create((set) => ({
  branch: '',
  semester: '',
  subject: '',
  resourceType: '',
  search: '',

  setFilter: (key, value) => set({ [key]: value }),
  resetFilters: () =>
    set({ branch: '', semester: '', subject: '', resourceType: '', search: '' }),
}));
