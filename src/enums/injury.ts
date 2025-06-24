export const BodySideLabel: Record<string, string> = {
    LEFT: 'Esquerdo',
    RIGHT: 'Direito',
};

export const InjuryDegreeLabel: Record<string, string> = {
    MICROTRAUMA: 'Microtrauma (sobrecarga leve)',
    GRAU_I: 'Grau I (leve)',
    GRAU_II: 'Grau II (moderada)',
    GRAU_III: 'Grau III (grave)',
    TOTAL: 'Total (ruptura completa)',
};

export const InjuryContextLabel: Record<string, string> = {
    GAME: 'Jogo',
    TRAINING: 'Treino',
    ACADEMY: 'Academia',
    OUT_FIELD: 'Fora do campo',
    OTHERS: 'Outros',
};

export const BooleanLabel: Record<'true' | 'false', string> = {
    true: 'Sim',
    false: 'Não',
};