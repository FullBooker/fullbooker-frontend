import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"

interface CardProps {
  children: React.ReactNode
}

const Card: React.FC<CardProps> = ({ children }) => {
  const { theme = 'light' } = useTheme()
  const [themeMode, setThemeMode] = useState('light')
  
  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  return (
    <div
      className={`lg:bg-cardColor border-0 sm:px-0 sm:py-0 lg:px-10 lg:py-12 rounded-3xl ${
        themeMode === "light" ? "lg:shadow-card-auth-shadow" : ""
      }`}
    >
      <div className="flex flex-col space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 lg:justify-center lg:items-center">
        {children}
      </div>
    </div>
  )
}

export default Card;