
import { loginSchema } from '../../zod/login-schema'
import { mockUser, mockTokens } from '../../mock'

export async function mockLogin(input: unknown) {
    const parsed = loginSchema.safeParse(input)
    if (!parsed.success) return { success: false, error: 'Dados inválidos' }

    const { email, password } = parsed.data
    if (email === mockUser.email && password === mockUser.password) {
        return { success: true, token: mockTokens[0] }
    }

    return { success: false, error: 'E-mail ou senha incorretos.' }
}
