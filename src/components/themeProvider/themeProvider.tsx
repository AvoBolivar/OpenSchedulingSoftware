import { useEffect } from "react"
import type { ReactNode } from "react"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import type { ThemeName } from "../../definitions/theme"
import { ThemeContext } from "./themeContext"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<ThemeName>("theme", "slate")

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
