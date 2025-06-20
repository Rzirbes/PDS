import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { useTheme } from '../context/theme-context';

export default function HeaderProfileMenu() {
    const { colors } = useTheme();
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.left}>
                <TouchableOpacity onPress={() => setOpen(!open)} style={styles.menuButton}>
                    <Feather name="menu" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>My Dashboard</Text>
            </View>

            <Image
                source={{ uri: 'https://i.pravatar.cc/100' }}
                style={styles.avatar}
            />

            {open && (
                <View style={[styles.menu, { backgroundColor: colors.secondary }]}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={[styles.menuText, { color: colors.text }]}>Minha conta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={[styles.menuText, { color: colors.text }]}>Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={[styles.menuText, { color: colors.text }]}>Configurações</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <Feather name="log-out" size={16} color={colors.text} style={{ marginRight: 8 }} />
                        <Text style={[styles.menuText, { color: colors.text }]}>Sair</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 48,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    menu: {
        position: 'absolute',
        top: 90,
        left: 16,
        width: 200,
        paddingVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 10,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    menuText: {
        fontSize: 14,
    },
});
