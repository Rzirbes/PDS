// components/pain/pain-section.tsx
import React, { useState } from 'react';
import { View, Button, Modal, ScrollView, SafeAreaView } from 'react-native';
import { FormSection } from '../ui/form-section';
import { PainCard } from '../ui/pain-card';
import { PainForm, PainFormValues } from './pain-form';
import { BodySide, InjuryContext } from '../../types/enums';
import { useTheme } from '../../context/theme-context';
import { FormModal } from '../ui/form-modal';

type PainSectionProps = {
  pains: PainFormValues[];
  onAddPain: (pain: PainFormValues) => void;
  onDeletePain: (index: number) => void;
};

export const PainSection: React.FC<PainSectionProps> = ({ pains, onAddPain, onDeletePain }) => {
  const { colors } = useTheme();
  const [showPainModal, setShowPainModal] = useState(false);

  return (
    <FormSection title="Cadastrar Dores">
      {pains.map((pain, index) => (
        <PainCard
          key={index}
          data={pain}
          onDelete={() => onDeletePain(index)}
        />
      ))}
      <Button title="Adicionar Dor" color={colors.primary} onPress={() => setShowPainModal(true)} />
      <FormModal
        visible={showPainModal}
        title="Nova Dor Muscular"
        onClose={() => setShowPainModal(false)}
      >
        <PainForm
          onSubmit={(newPain) => {
            onAddPain(newPain);
            setShowPainModal(false);
          }}
          onClose={() => setShowPainModal(false)}
          defaultValues={{
            date: new Date(),
            bodyRegion: '',
            bodySide: BodySide.LEFT,
            occurredDuring: InjuryContext.TRAINING,
            intensity: 0,
            description: '',

          }}
        />
      </FormModal>
    </FormSection>
  );
};
