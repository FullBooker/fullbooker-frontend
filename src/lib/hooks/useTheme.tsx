import { useState, useEffect } from "react";

export function useThemeMode(initialTheme: "light" | "dark" = "light") {
  const [themeMode, setThemeMode] = useState(initialTheme);

  useEffect(() => {
    setThemeMode(initialTheme);
  }, [initialTheme]);

  return { themeMode, setThemeMode };
}
