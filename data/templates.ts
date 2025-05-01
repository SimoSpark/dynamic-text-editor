// Collection of medical templates
const medicalTemplates: MedicalTemplate[] = [
  {
    id: "xray",
    name: "Radiographie",
    content: `
      <h2>Examen radiologique</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Type d'examen:</strong> Radiographie conventionnelle</p>
        <p><strong>Région anatomique:</strong> À compléter</p>
        <p><strong>Date de l'examen:</strong> {{DATE}}</p>
      </div>
      
      <h2>Résultats d'imagerie</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p>Les clichés radiographiques montrent:</p>
        <ul>
          <li>Absence de fracture visible</li>
          <li>Alignement osseux conservé</li>
          <li>Absence d'anomalie articulaire significative</li>
          <li>Densité osseuse normale</li>
        </ul>
      </div>
      
      <h2>Interprétation et recommandations</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p>Aucune anomalie radiologique significative n'est détectée sur les clichés réalisés ce jour.</p>
        <p>Un suivi clinique est recommandé en cas de persistance des symptômes.</p>
      </div>
    `
  },
  {
    id: "mri",
    name: "IRM",
    content: `
      <h2>Examen d'imagerie par résonance magnétique</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Type d'examen:</strong> IRM</p>
        <p><strong>Région anatomique:</strong> À compléter</p>
        <p><strong>Date de l'examen:</strong> {{DATE}}</p>
        <p><strong>Séquences réalisées:</strong> T1, T2, STIR, séquences avec injection de produit de contraste</p>
      </div>
      
      <h2>Résultats d'imagerie</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p>L'IRM met en évidence:</p>
        <ul>
          <li>Morphologie normale des structures osseuses</li>
          <li>Pas d'anomalie de signal médullaire osseux</li>
          <li>Structures ligamentaires en place</li>
          <li>Absence de lésion musculaire ou tendineuse</li>
          <li>Pas d'épanchement articulaire significatif</li>
        </ul>
      </div>
      
      <h2>Interprétation et recommandations</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p>Examen d'IRM sans anomalie significative.</p>
        <p>Corrélation clinique recommandée.</p>
      </div>
    `
  },
  {
    id: "fracture-knee",
    name: "Fracture du genou",
    content: `
      <h2>Examen clinique - Fracture du genou</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Diagnostic:</strong> Fracture du plateau tibial</p>
        <p><strong>Localisation:</strong> Genou droit/gauche</p>
        <p><strong>Mécanisme lésionnel:</strong> Traumatisme direct lors d'une chute</p>
      </div>
      
      <h2>Bilan radiologique</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p>Radiographie du genou montre une fracture du plateau tibial externe sans déplacement significatif.</p>
        <p>Absence de lésion associée visible.</p>
      </div>
      
      <h2>Prise en charge et traitement</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Traitement immédiat:</strong></p>
        <ul>
          <li>Immobilisation par attelle cruro-pédieuse pour 6 semaines</li>
          <li>Analgésie adaptée</li>
          <li>Interdiction d'appui complet sur le membre inférieur atteint</li>
        </ul>
        
        <p><strong>Suivi:</strong></p>
        <ul>
          <li>Contrôle radiologique à 3 semaines</li>
          <li>Réévaluation de l'immobilisation à 6 semaines</li>
          <li>Rééducation fonctionnelle à prévoir après consolidation</li>
        </ul>
      </div>
    `
  },
  {
    id: "fracture-hand",
    name: "Fracture de la main",
    content: `
      <h2>Examen clinique - Fracture de la main</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Diagnostic:</strong> Fracture du métacarpe</p>
        <p><strong>Localisation:</strong> 5ème métacarpe main droite/gauche</p>
        <p><strong>Mécanisme lésionnel:</strong> Choc direct/indirect</p>
      </div>
      
      <h2>Bilan radiologique</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p>Fracture du col du 5ème métacarpe non déplacée.</p>
        <p>Pas de luxation associée.</p>
      </div>
      
      <h2>Prise en charge et traitement</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Traitement immédiat:</strong></p>
        <ul>
          <li>Immobilisation par attelle plâtrée postérieure pour 4 semaines</li>
          <li>Analgésie par paracétamol et anti-inflammatoires non stéroïdiens</li>
          <li>Surélévation du membre supérieur pendant 48h</li>
        </ul>
        
        <p><strong>Suivi:</strong></p>
        <ul>
          <li>Contrôle clinique à 10 jours</li>
          <li>Retrait de l'immobilisation à 4 semaines</li>
          <li>Auto-rééducation selon protocole remis au patient</li>
        </ul>
      </div>
    `
  },
  {
    id: "ct-scan",
    name: "Scanner (TDM)",
    content: `
      <h2>Examen tomodensitométrique</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Type d'examen:</strong> Scanner (TDM)</p>
        <p><strong>Région anatomique:</strong> À compléter</p>
        <p><strong>Date de l'examen:</strong> {{DATE}}</p>
        <p><strong>Protocole:</strong> Acquisition hélicoïdale, coupes millimétriques, avec injection de produit de contraste</p>
      </div>
      
      <h2>Résultats d'imagerie</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p>Le scanner met en évidence:</p>
        <ul>
          <li>Absence d'anomalie parenchymateuse</li>
          <li>Structures osseuses sans particularité</li>
          <li>Absence de collection ou d'épanchement</li>
          <li>Pas d'adénopathie significative</li>
        </ul>
      </div>
      
      <h2>Interprétation et recommandations</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        <p>Examen tomodensitométrique sans anomalie significative.</p>
        <p>Corrélation avec la clinique recommandée.</p>
      </div>
    `
  }
];

// Fonction pour obtenir tous les templates
export function getMedicalTemplates(): MedicalTemplate[] {
  return medicalTemplates;
}

// Fonction pour trouver un template par son ID
export function getTemplateById(id: string): MedicalTemplate | undefined {
  return medicalTemplates.find(template => template.id === id);
}