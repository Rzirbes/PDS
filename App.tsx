import 'react-native-reanimated'
import Routes from './src/navigation'
import { ThemeProvider } from './src/context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  )
}
