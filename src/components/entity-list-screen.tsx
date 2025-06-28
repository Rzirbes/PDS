import { JSX, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from './search-bar';
import GenericList from './list';
import FloatingActionButton from './floating-button';
import { useTheme } from '../context/theme-context';
import { Feather } from '@expo/vector-icons'; // ou 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';

type Props<T> = {
    title?: string;
    data: T[];
    placeholder?: string;
    onFabPress: () => void;
    renderItem: (item: T) => JSX.Element;
    searchBy?: (item: T, query: string) => boolean;
    isLoading?: boolean;
    showBackButton?: boolean;
};

export default function EntityListScreen<T>({
    title,
    data,
    placeholder = 'Buscar...',
    onFabPress,
    renderItem,
    searchBy,
    isLoading,
    showBackButton = false,
}: Props<T>) {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [query, setQuery] = useState('');

    const filteredData = query
        ? data.filter((item) => (searchBy ? searchBy(item, query) : true))
        : data;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {title && (
                    <View style={styles.header}>
                        {showBackButton && (
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Feather name="chevron-left" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        )}
                        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    </View>
                )}

                <SearchBar placeholder={placeholder} onSearch={setQuery} />

                {isLoading ? (
                    <Text style={{ color: colors.text }}>Carregando...</Text>
                ) : (
                    <GenericList
                        data={filteredData}
                        keyExtractor={(item) => (item as any).id}
                        renderItem={renderItem}
                    />
                )}
                <FloatingActionButton onPress={onFabPress} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    backButton: {
        marginRight: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
