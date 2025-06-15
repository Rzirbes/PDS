import { View, Text, StyleSheet } from 'react-native'
import DashboardCard from '../components/dashboard-card'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '../context/theme-context'
import HeaderProfileMenu from '../components/header-profile-menu'
import { RootStackParamList } from '../navigation/types'

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const { colors, toggleTheme } = useTheme()

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <HeaderProfileMenu />


            <View style={styles.grid}>
                <DashboardCard icon="users" label="Atletas" onPress={() => navigation.navigate('Athletes')} />
                <DashboardCard icon="user-check" label="Colaboradores" onPress={() => navigation.navigate('Collaborators')} />
                <DashboardCard icon="activity" label="Treinos" onPress={() => navigation.navigate('Trainings')} />
                <DashboardCard icon="calendar" label="Agenda" onPress={() => navigation.navigate('Schedule')} />
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 30
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 32,
    },
    toggle: {
        marginTop: 32,
        textAlign: 'center',
        fontWeight: '600',
    },
})
