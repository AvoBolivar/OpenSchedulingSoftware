import Home from "./pages/home"
import Toast from "./components/basic/toast/toast"
import { ThemeProvider } from "./components/themeProvider/themeProvider"

function App() {
  return (
    <ThemeProvider>
      <Home />
      <Toast />
    </ThemeProvider>
  )
}

export default App
