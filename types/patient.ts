export interface Patient {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  description?: string;
  conseils?: string;
  rapport?: string;
  createdAt?: Date;
  updatedAt?: Date;
}