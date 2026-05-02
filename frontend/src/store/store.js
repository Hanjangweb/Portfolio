import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isAdmin: localStorage.getItem('role') === 'admin',

  setUser: (user, token, role) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    set({ user, token, isAuthenticated: true, isAdmin: role === 'admin' });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
  },

  setAdmin: (isAdmin) => set({ isAdmin }),
}));

export const useThemeStore = create((set) => ({
  isDark: localStorage.getItem('theme') === 'dark',
  toggleTheme: () => {
    set((state) => {
      const newTheme = !state.isDark;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return { isDark: newTheme };
    });
  },
}));
