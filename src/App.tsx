import Home from "./pages/home"
import { ThemeProvider } from "./components/themeProvider/themeProvider"

function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  )
}

export default App
