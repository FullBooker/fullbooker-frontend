import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const useThemeToggle = () => {
  const { theme = "light" } = useTheme();
  const [themeMode, setThemeMode] = useState('light')
  
  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  const isChecked = themeMode === 'light' ? true : false
  return isChecked;
};