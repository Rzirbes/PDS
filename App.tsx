import 'react-native-reanimated';
import Routes from './src/navigation';
import { ThemeProvider } from './src/context/theme-context';
import { AuthProvider } from './src/context/auth-context';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </AuthProvider>
  );
}
