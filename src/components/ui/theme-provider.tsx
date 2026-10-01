import { createContext, useContext, useState } from 'react';

interface ThemeContextType { theme: string; setTheme: (theme: string) => void; }
const ThemeContext = createContext<ThemeContextType>({ theme: 'system', setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('system');
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
