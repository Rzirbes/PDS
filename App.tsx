import 'react-native-reanimated';
import Routes from './src/navigation';
import { AuthProvider } from './src/context/auth-context';
import { ThemeProvider } from './src/context/theme-context';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </AuthProvider>
  );
}
