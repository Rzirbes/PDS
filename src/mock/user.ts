import { TokenTypeEnum } from "../types/token-types"

export const mockUser = {
    email: 'admin@ct.com',
    password: '123456',
}

export const mockTokens = [
    {
        id: 1,
        uuid: 'abcd1234-5678-9012-abcd-1234567890ef',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
        token: 'mocked-access-token-123',
        type: TokenTypeEnum.ACCESS,
        userId: 1,
        expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24), // +1 dia
        isValid: true,
    },
]
