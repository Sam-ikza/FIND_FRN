import { create } from 'zustand';

interface ThemeStore {
  isDark: boolean;
  toggleDark: () => void;
}

const getInitialDark = () => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('roomsync-dark');
  if (stored !== null) return stored === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyDark = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('roomsync-dark', String(dark));
};

// Apply on load
if (typeof window !== 'undefined') {
  applyDark(getInitialDark());
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: getInitialDark(),
  toggleDark: () =>
    set((s) => {
      const next = !s.isDark;
      applyDark(next);
      return { isDark: next };
    }),
}));
