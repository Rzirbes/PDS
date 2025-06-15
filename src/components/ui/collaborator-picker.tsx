import React, { useState } from 'react'
import { Modal, View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native'
import { useTheme } from '../../context/theme-context'

interface Collaborator {
    id: number
    name: string
}

interface Props {
    selectedId: number | null
    onSelect: (id: number | null) => void
    collaborators: Collaborator[]
}

export default function CollaboratorPicker({ selectedId, onSelect, collaborators }: Props) {
    const { colors } = useTheme()
    const [isVisible, setIsVisible] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredCollaborators = collaborators.filter(collab =>
        collab.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelect = (id: number | null) => {
        onSelect(id)
        setIsVisible(false)
        setSearchTerm('') // Limpar busca ao fechar
    }

    const selectedLabel =
        selectedId !== null
            ? collaborators.find(c => c.id === selectedId)?.name
            : 'Filtrar por colaborador...'

    return (
        <>
            <TouchableOpacity
                style={{
                    backgroundColor: colors.secondary,
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 10,
                }}
                onPress={() => setIsVisible(true)}
            >
                <Text style={{ color: colors.text }}>{selectedLabel}</Text>
            </TouchableOpacity>

            <Modal visible={isVisible} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: '#00000088', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: colors.background, margin: 20, borderRadius: 8, padding: 16, maxHeight: '80%' }}>
                        {/* Campo de Busca */}
                        <TextInput
                            placeholder="Buscar colaborador..."
                            placeholderTextColor={colors.muted}
                            style={{
                                backgroundColor: colors.secondary,
                                color: colors.text,
                                padding: 10,
                                borderRadius: 8,
                                marginBottom: 10,
                            }}
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />

                        {/* Opção de "Todos" */}
                        <TouchableOpacity onPress={() => handleSelect(null)}>
                            <Text style={{ padding: 10, color: colors.text }}>Todos</Text>
                        </TouchableOpacity>

                        {/* Lista filtrada */}
                        <FlatList
                            data={filteredCollaborators}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelect(item.id)}>
                                    <Text style={{ padding: 10, color: colors.text }}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={{ textAlign: 'center', color: colors.muted, marginTop: 20 }}>
                                    Nenhum colaborador encontrado.
                                </Text>
                            }
                        />

                        {/* Botão de Fechar */}
                        <TouchableOpacity onPress={() => setIsVisible(false)}>
                            <Text style={{ textAlign: 'center', color: colors.text, marginTop: 10 }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}
