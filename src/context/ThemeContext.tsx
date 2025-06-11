import { createContext, useContext, useState, ReactNode } from 'react'
import { colors } from '../theme/colors'

type ThemeType = 'light' | 'dark'

interface ThemeContextData {
    theme: ThemeType
    colors: typeof colors.light
    toggleTheme: () => void
}

const ThemeContext = createContext({} as ThemeContextData)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeType>('light')

    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

    return (
        <ThemeContext.Provider value={{ theme, colors: colors[theme], toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
