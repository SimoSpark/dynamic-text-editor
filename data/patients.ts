import { Patient } from '@/types/patient';
export const patients: Patient[] = [
  {
    //Our fake database of patients

    id: 1,
    nom: 'Dynar',
    prenom: 'Mohamed',
    age: 45,
    description: '<p>Fracture du tibia droit suite à une chute..</p><p>Radiographie montre une fracture nette sans déplacement.</p>',
    conseils: '<p>Repos complet pendant 3 semaines.</p><p>Éviter tout appui sur la jambe droite....</p><p>Prendre les analgésiques prescrits toutes les 6 heures...</p>'
  },
  {
    id: 2,
    nom: 'Hanounny',
    prenom: 'Mariem',
    age: 32,
    description: '<p>Entorse de la cheville gauche.</p><p>Gonflement modéré, mobilité réduite.</p>',
    conseils: '<p>Application de glace 3 fois par jour.</p><p>Élévation du membre pendant le repos.</p><p>Rendez-vous de contrôle dans une semaine.</p>'
  },
  {
    id: 3,
    nom: 'Younessy',
    prenom: 'Youness',
    age: 58,
    description: '<p>Hypertension artérielle non contrôlée...</p><p>Dernière mesure: 170/95 mmHg.</p>',
    conseils: '<p>Suivre le traitement prescrit sans interruption.</p><p>Réduire l\'apport en sel.</p><p>Contrôler la tension à domicile quotidiennement.</p>'
  }
];

// Fonction pour trouver un patient par son ID
export function getPatientById(id: number): Patient | undefined {
  return patients.find(patient => patient.id === id);
}

// Fonction pour mettre à jour les données d'un patient
export function updatePatient(updatedPatient: Patient): void {
  const index = patients.findIndex(patient => patient.id === updatedPatient.id);
  if (index !== -1) {
    patients[index] = updatedPatient;
  }
}