import { Palette } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { useTheme } from "../../../hooks/useTheme"
import { THEMES } from "../../../lib/theme"
import type { ThemeName } from "../../../definitions/theme"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Select value={theme} onValueChange={(value) => setTheme(value as ThemeName)}>
      <SelectTrigger aria-label="Theme" size="sm">
        <Palette aria-hidden="true" width={14} height={14} />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {THEMES.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
