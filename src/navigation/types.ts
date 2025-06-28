export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Athletes: undefined;
  AthleteDetails: { athleteId: string };
  EditAthlete: { athleteId: string };
  Collaborators: undefined;
  CollaboratorDetails: { coachId: string };
  Trainings: undefined;
  Schedule: undefined;
  CreateAthlete: undefined;
};
