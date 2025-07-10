// components/injury/injury-section.tsx
import React, { useState } from 'react';
import { Button } from 'react-native';
import { FormSection } from '../ui/form-section';
import { InjuryCard } from '../ui/injury-card';
import { InjuryForm, InjuryFormValues } from './injury-form';
import { useTheme } from '../../context/theme-context';
import { defaultInjury } from './injury-form';
import { FormModal } from '../ui/form-modal';

type InjurySectionProps = {
    injuries: InjuryFormValues[];
    onAddInjury: (injury: InjuryFormValues) => void;
    onDeleteInjury: (index: number) => void;
};

export const InjurySection: React.FC<InjurySectionProps> = ({ injuries, onAddInjury, onDeleteInjury }) => {
    const { colors } = useTheme();
    const [showModal, setShowModal] = useState(false);

    return (
        <FormSection title="Cadastrar Lesões">
            {injuries.map((injury, index) => (
                <InjuryCard
                    key={index}
                    data={injury}
                    onDelete={() => onDeleteInjury(index)}
                />
            ))}

            <Button title="Adicionar Lesão" color={colors.primary} onPress={() => setShowModal(true)} />

            <FormModal
                visible={showModal}
                title="Nova Lesão"
                onClose={() => setShowModal(false)}
            >
                <InjuryForm
                    onSubmit={(injury) => {
                        onAddInjury(injury);
                        setShowModal(false);
                    }}
                    onClose={() => setShowModal(false)}
                    defaultValues={defaultInjury}
                />
            </FormModal>
        </FormSection>
    );
};
