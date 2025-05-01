/////Defines what a patient looks like in our app
//basic infos de patient
export interface Patient {
    id: number;
    nom: string;
    prenom: string;
    age: number;
    description: string;
    conseils: string;
    rapport?: string; // we add this to store the saved report
  }