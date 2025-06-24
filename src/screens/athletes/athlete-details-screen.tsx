import { useWindowDimensions, View, Text } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import { useTheme } from '../../context/theme-context'
import type { RootStackParamList } from '../../navigation/types'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HeaderWithBack from '../../components/atheltes/header-with-back'
import MonitoringContainer from '../../components/charts/monitoring-container'
import { useAthleteById, useAthletes } from '../../hooks/use-athlete'
import AthleteInfoScreen from '../../components/atheltes/athlete-infor'

type AthleteDetailsRouteProp = RouteProp<RootStackParamList, 'AthleteDetails'>
type RouteType = {
    key: string
    title: string
}

export default function AthleteDetailsScreen() {
    const layout = useWindowDimensions()
    const route = useRoute<AthleteDetailsRouteProp>()
    const { colors } = useTheme()
    const { athleteId } = route.params

    const { athlete, isLoading } = useAthleteById(athleteId);

    const [index, setIndex] = useState(0)
    const [routes] = useState<RouteType[]>([
        { key: 'monitoramento', title: 'Monitoramento' },
        { key: 'planejados', title: 'Planejados' },
        { key: 'concluidos', title: 'Concluídos' },
        { key: 'info', title: 'Informações' },
    ])

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: colors.primary }}
            style={{ backgroundColor: colors.background }}
            activeColor={colors.primary}
            inactiveColor={colors.text}
            renderLabel={({ route, color, focused }: { route: RouteType; color: string; focused: boolean }) => (
                <Text style={{ color, fontWeight: focused ? 'bold' : 'normal', margin: 8 }}>{route.title}</Text>
            )}
        />
    )

    const renderScene = SceneMap({
        monitoramento: () => <MonitoringContainer athleteId={athleteId} />,
        planejados: () => (
            <View style={{ padding: 16 }}>
                <Text style={{ color: colors.text }}>🗓️ Treinos planejados</Text>
            </View>
        ),
        concluidos: () => (
            <View style={{ padding: 16 }}>
                <Text style={{ color: colors.text }}>✅ Treinos concluídos</Text>
            </View>
        ),
        info: () => <AthleteInfoScreen athlete={athlete as any} />,
    })

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            {isLoading || !athlete ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: colors.text }}>Carregando informações do atleta...</Text>
                </View>
            ) : (
                <>
                    <HeaderWithBack title={athlete.name} />
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                    />
                </>
            )}
        </SafeAreaView>
    );
}
