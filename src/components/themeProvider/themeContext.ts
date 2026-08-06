import { createContext } from "react"
import type { ThemeName } from "../../definitions/theme"

export interface ThemeContextValue {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
