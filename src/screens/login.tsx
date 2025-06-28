import { useNavigation } from '@react-navigation/native'
import { useMemo, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Keyboard,
  Alert,
  ActivityIndicator,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import { Eye, EyeOff } from 'lucide-react-native'
import type { RootStackParamList } from '../navigation/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { saveSession } from '../services/session-service'
import { login } from '../services/auth-service'
import { useAuth } from '../context/auth-context'
import { useTheme } from '../context/theme-context'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepConnected, setKeepConnected] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { colors } = useTheme()
  const { setToken } = useAuth()

  const themedStyles = useMemo(() => StyleSheet.create({
    input: {
      ...styles.input,
      borderColor: colors.muted,
      color: colors.text,
    },
    passwordInput: {
      ...styles.passwordInput,
      color: colors.text,
    },
    passwordInputContainer: {
      ...styles.passwordInputContainer,
      borderColor: colors.muted,
    },
    label: {
      ...styles.label,
      color: colors.text,
    },
    title: {
      ...styles.title,
      color: colors.primary,
    },
    subtitle: {
      ...styles.subtitle,
      color: colors.muted,
    },
    loginButton: {
      ...styles.loginButton,
      backgroundColor: colors.primary,
    },
    loginButtonText: {
      ...styles.loginButtonText,
    },
    forgotPassword: {
      ...styles.forgotPassword,
      color: colors.primary,
    },
    switchLabel: {
      ...styles.switchLabel,
      color: colors.text,
    },
  }), [colors])

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha e-mail e senha.')
      return
    }

    setLoading(true)
    try {
      const data = await login(email, password)
      await saveSession(data.token, data.refreshToken, keepConnected)
      console.log('Login OK, token salvo:', data.token)
      setToken(data.token)
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  const FormContent = (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={themedStyles.title}>Acesse sua conta</Text>
      <Text style={themedStyles.subtitle}>Insira seu e-mail para acessar o painel do usuário.</Text>

      <View style={styles.fieldContainer}>
        <Text style={themedStyles.label}>E-mail</Text>
        <TextInput
          placeholder="Digite o seu e-mail..."
          keyboardType="email-address"
          placeholderTextColor={colors.muted}
          style={themedStyles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={themedStyles.label}>Senha</Text>
        <View style={themedStyles.passwordInputContainer}>
          <TextInput
            placeholder="Digite a sua senha..."
            secureTextEntry={!showPassword}
            placeholderTextColor={colors.muted}
            style={themedStyles.passwordInput}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={20} color={colors.muted} />
            ) : (
              <Eye size={20} color={colors.muted} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Switch
          value={keepConnected}
          onValueChange={setKeepConnected}
          trackColor={{ false: '#ccc', true: colors.primary }}
          thumbColor="#fff"
        />
        <Text style={themedStyles.switchLabel}>Manter-se conectado</Text>
      </View>

      <TouchableOpacity
        style={themedStyles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={themedStyles.loginButtonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={themedStyles.forgotPassword}>Esqueceu sua senha?</Text>
      </TouchableOpacity>
    </View>
  )


  if (Platform.OS === 'web') {
    return FormContent
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {FormContent}
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: {
    marginLeft: 8,
  },
  loginButton: {
    borderRadius: 8,
    width: '100%',
    paddingVertical: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  forgotPassword: {
    textDecorationLine: 'underline',
  },
})
