import React, { createContext, useState, useEffect, useContext } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children, defaultTheme = "system", enableSystem = true }) {
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      root.style.setProperty('--theme-animation', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)')
    } else {
      root.classList.add(theme)
    }
  }, [theme, enableSystem])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

