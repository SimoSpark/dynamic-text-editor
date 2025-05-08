
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2, X, Info, Check, FileText, Copy } from "lucide-react";
import { addTemplate, getMedicalTemplates, removeTemplate } from "@/data/templates";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

// Exemples de contenu pour aider à la création de templates
const templateExamples = [
  {
    id: "cardio",
    name: "Examen Cardiologique",
    content: `<h3>Examen Cardiologique du {{DATE}}</h3>
<p>Patient: {{PATIENT_PRENOM}} {{PATIENT_NOM}}, {{PATIENT_AGE}} ans</p>

<h4>Paramètres vitaux</h4>
<ul>
  <li>Tension artérielle: _______/_______</li>
  <li>Fréquence cardiaque: _______ bpm</li>
  <li>Saturation O2: _______</li>
</ul>

<h4>Auscultation</h4>
<p>_______________________________________________________</p>

<h4>ECG</h4>
<p>_______________________________________________________</p>

<h4>Conclusion</h4>
<p>_______________________________________________________</p>

<h4>Plan de traitement</h4>
<p>_______________________________________________________</p>

<h4>Prochain rendez-vous</h4>
<p>{{DATE_FUTURE_1M}}</p>`
  },
  {
    id: "pneumo",
    name: "Examen Pneumologique",
    content: `<h3>Examen Pneumologique du {{DATE}}</h3>
<p>Patient: {{PATIENT_PRENOM}} {{PATIENT_NOM}}, {{PATIENT_AGE}} ans</p>

<h4>Symptômes respiratoires</h4>
<ul>
  <li>Toux: □ Oui □ Non</li>
  <li>Expectorations: □ Oui □ Non</li>
  <li>Dyspnée: □ Oui □ Non</li>
</ul>

<h4>Auscultation pulmonaire</h4>
<p>_______________________________________________________</p>

<h4>Imagerie thoracique</h4>
<p>□ Normale □ Anormale</p>
<p>Détails: _____________________________________________</p>

<h4>Fonction respiratoire</h4>
<p>_______________________________________________________</p>

<h4>Prochain rendez-vous</h4>
<p>{{DATE_FUTURE_2W}}</p>`
  },
  {
    id: "neuro",
    name: "Consultation Neurologique",
    content: `<h3>Consultation Neurologique du {{DATE}}</h3>
<p>Patient: {{PATIENT_PRENOM}} {{PATIENT_NOM}}, {{PATIENT_AGE}} ans</p>

<h4>Motif de consultation</h4>
<p>_______________________________________________________</p>

<h4>Examen neurologique</h4>
<ul>
  <li>Conscience: _______________________________________</li>
  <li>Fonctions cognitives: _____________________________</li>
  <li>Motricité: _______________________________________</li>
  <li>Sensibilité: _____________________________________</li>
  <li>Réflexes: _______________________________________</li>
</ul>

<h4>Diagnostic</h4>
<p>_______________________________________________________</p>

<h4>Plan de suivi</h4>
<p>_______________________________________________________</p>

<h4>Prochain rendez-vous</h4>
<p>{{DATE_FUTURE_3M}}</p>`
  }
];

export default function TemplateManager() {
  const [templates, setTemplates] = useState(getMedicalTemplates());
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");
  const [selectedExample, setSelectedExample] = useState("");
  const [activeTab, setActiveTab] = useState("variables");
  const [copiedVariable, setCopiedVariable] = useState("");

  // Liste des variables dynamiques disponibles par catégorie
  const dynamicVariables = {
    dates: [
      { name: "{{DATE}}", description: "Date actuelle au format long (ex: 8 mai 2025)" },
      { name: "{{DATE_SHORT}}", description: "Date au format court (ex: 08/05/2025)" },
      { name: "{{HEURE}}", description: "Heure actuelle (ex: 14:30)" },
      { name: "{{DATE_FUTURE_1W}}", description: "Date dans 1 semaine" },
      { name: "{{DATE_FUTURE_2W}}", description: "Date dans 2 semaines" },
      { name: "{{DATE_FUTURE_1M}}", description: "Date dans 1 mois" },
      { name: "{{DATE_FUTURE_3M}}", description: "Date dans 3 mois" },
      { name: "{{DATE_FUTURE_6M}}", description: "Date dans 6 mois" },
      { name: "{{JOUR_SEMAINE}}", description: "Jour de la semaine (ex: Jeudi)" }
    ],
    patient: [
      { name: "{{PATIENT_NOM}}", description: "Nom du patient" },
      { name: "{{PATIENT_PRENOM}}", description: "Prénom du patient" },
      { name: "{{PATIENT_AGE}}", description: "Âge du patient" },
      { name: "{{PATIENT_DESC}}", description: "Description médicale du patient" },
      { name: "{{PATIENT_CONSEILS}}", description: "Conseils précédents" }
    ],
    document: [
      { name: "{{REF_ID}}", description: "Numéro de référence unique du document" },
      { name: "{{CABINET_NOM}}", description: "Nom du cabinet médical" },
      { name: "{{CABINET_ADRESSE}}", description: "Adresse du cabinet" },
      { name: "{{CABINET_TEL}}", description: "Téléphone du cabinet" }
    ]
  };

  // Refresh templates list
  const refreshTemplates = () => {
    setTemplates(getMedicalTemplates());
  };

  // Insert dynamic variable into template content
  const insertVariable = (variable: string) => {
    // Save cursor position for potential future improvements
    setNewTemplateContent(prev => prev + " " + variable + " ");
    
    // Visual feedback
    setCopiedVariable(variable);
    setTimeout(() => setCopiedVariable(""), 1500);
  };

  // Copy example template
  const useTemplateExample = (id: string) => {
    const example = templateExamples.find(t => t.id === id);
    if (example) {
      setNewTemplateName(example.name);
      setNewTemplateContent(example.content);
    }
  };

  // Handle creating a new template
  const handleCreateTemplate = () => {
    if (newTemplateName.trim() === "" || newTemplateContent.trim() === "") {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // Generate unique ID based on template name + timestamp
    const timestamp = new Date().getTime();
    const templateId = `${newTemplateName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}-${timestamp}`;

    // Create template with basic structure
    const template = {
      id: templateId,
      name: newTemplateName,
      content: newTemplateContent
    };

    // Add template to storage
    addTemplate(template);
    
    // Reset form and refresh list
    setNewTemplateName("");
    setNewTemplateContent("");
    setIsCreating(false);
    refreshTemplates();
  };

  // Handle removing a template
  const handleRemoveTemplate = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce modèle?")) {
      removeTemplate(id);
      refreshTemplates();
    }
  };

  // Toggle creation form visibility
  const toggleCreationForm = () => {
    setIsCreating(!isCreating);
    if (!isCreating) {
      // Reset form when opening
      setNewTemplateName("");
      setNewTemplateContent("");
      setSelectedExample("");
    }
  };

  return (
    <div className="border rounded-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Gestion des modèles de rapport</h2>
        
        <Button 
          onClick={toggleCreationForm}
          className="flex items-center gap-2"
          size="sm"
          variant={isCreating ? "outline" : "default"}
        >
          {isCreating ? (
            <>
              <X className="size-4" /> Annuler
            </>
          ) : (
            <>
              <Plus className="size-4" /> Nouveau modèle
            </>
          )}
        </Button>
      </div>

      {/* Template creation form */}
      {isCreating && (
        <div className="border rounded-md p-4 mb-4 bg-slate-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium">Nouveau modèle de rapport</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nom du modèle
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Ex: Examen cardiaque"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>
            
            {/* Examples dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FileText className="size-4" /> Utiliser un exemple de modèle
              </label>
              <div className="flex gap-2">
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedExample}
                  onChange={(e) => setSelectedExample(e.target.value)}
                >
                  <option value="">-- Sélectionner un exemple --</option>
                  {templateExamples.map(example => (
                    <option key={example.id} value={example.id}>
                      {example.name}
                    </option>
                  ))}
                </select>
                
                <Button 
                  variant="outline" 
                  onClick={() => useTemplateExample(selectedExample)}
                  disabled={!selectedExample}
                >
                  Utiliser
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Contenu du modèle
              </label>
              <textarea
                className="w-full p-2 border rounded-md min-h-[240px] font-mono text-sm"
                placeholder="Entrez le contenu du modèle ici..."
                value={newTemplateContent}
                onChange={(e) => setNewTemplateContent(e.target.value)}
              />
              
              {/* Variables dynamiques avec onglets */}
              <div className="mt-3 border-t pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium">Variables disponibles</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <Info className="size-4 text-slate-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Cliquez sur une variable pour l'insérer dans votre modèle</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <Tabs defaultValue="dates" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-2">
                    <TabsTrigger value="dates">Dates</TabsTrigger>
                    <TabsTrigger value="patient">Patient</TabsTrigger>
                    <TabsTrigger value="document">Document</TabsTrigger>
                  </TabsList>
                  
                  {Object.entries(dynamicVariables).map(([category, variables]) => (
                    <TabsContent key={category} value={category} className="m-0">
                      <div className="flex flex-wrap gap-2">
                        {variables.map((variable) => (
                          <TooltipProvider key={variable.name}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  type="button"
                                  variant="outline" 
                                  size="sm"
                                  className={`text-xs flex items-center gap-1 ${copiedVariable === variable.name ? 'bg-green-50 border-green-200' : ''}`}
                                  onClick={() => insertVariable(variable.name)}
                                >
                                  {copiedVariable === variable.name && (
                                    <Check className="size-3 text-green-500" />
                                  )}
                                  {variable.name}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">{variable.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleCreateTemplate}
                className="flex items-center gap-2"
              >
                <Save className="size-4" /> Enregistrer le modèle
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* List of existing templates */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-500 mb-2">Modèles disponibles</h3>
        
        {templates.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun modèle personnalisé. Créez votre premier modèle!</p>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="flex justify-between items-center p-2 border rounded-md mb-2 hover:bg-slate-50"
              >
                <span>{template.name}</span>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setIsCreating(true);
                            setNewTemplateName(`Copie de ${template.name}`);
                            setNewTemplateContent(template.content);
                          }}
                          className="text-slate-500"
                        >
                          <Copy className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Dupliquer ce modèle</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTemplate(template.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Supprimer ce modèle</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}