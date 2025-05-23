"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2, X, Info, CalendarDays, MessageSquare, User, Stethoscope } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// template interface
interface Template {
  id: string;
  name: string;
  content: string;
}

// These functions should be implemented in your data/templates.js file
 creating placeholders here for clarity
const getMedicalTemplates = (): Template[] => {
  try {
    const templatesJson = localStorage.getItem('medicalTemplates');
    return templatesJson ? JSON.parse(templatesJson) : [];
  } catch (error) {
    console.error("Error loading templates:", error);
    return [];
  }
};

const addTemplate = (template: Template): void => {
  try {
    const templates = getMedicalTemplates();
    templates.push(template);
    localStorage.setItem('medicalTemplates', JSON.stringify(templates));
  } catch (error) {
    console.error("Error saving template:", error);
  }
};

const removeTemplate = (id: string): void => {
  try {
    const templates = getMedicalTemplates();
    const filteredTemplates = templates.filter(t => t.id !== id);
    localStorage.setItem('medicalTemplates', JSON.stringify(filteredTemplates));
  } catch (error) {
    console.error("Error removing template:", error);
  }
};

export default function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");
  const [selectedTab, setSelectedTab] = useState("editor");

  // Current date values for preview and insertion
  const [currentDateValues, setCurrentDateValues] = useState({
    date: "",
    dateShort: "",
    heure: "",
    jourSemaine: "",
    dateFuture1W: "",
    dateFuture2W: "",
    dateFuture1M: "",
    dateFuture3M: "",
    dateFuture6M: "",
  });

  // Generate real date values
  useEffect(() => {
   
    const now = new Date();
    
    // Full date format
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    // Day of week
    const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    // Future dates
    const oneWeek = new Date(now);
    oneWeek.setDate(now.getDate() + 7);
    
    const twoWeeks = new Date(now);
    twoWeeks.setDate(now.getDate() + 14);
    
    const oneMonth = new Date(now);
    oneMonth.setMonth(now.getMonth() + 1);
    
    const threeMonths = new Date(now);
    threeMonths.setMonth(now.getMonth() + 3);
    
    const sixMonths = new Date(now);
    sixMonths.setMonth(now.getMonth() + 6);
    
    setCurrentDateValues({
      date: now.toLocaleDateString('fr-FR', options),
      dateShort: now.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      heure: now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      jourSemaine: joursSemaine[now.getDay()],
      dateFuture1W: oneWeek.toLocaleDateString('fr-FR', options),
      dateFuture2W: twoWeeks.toLocaleDateString('fr-FR', options),
      dateFuture1M: oneMonth.toLocaleDateString('fr-FR', options),
      dateFuture3M: threeMonths.toLocaleDateString('fr-FR', options),
      dateFuture6M: sixMonths.toLocaleDateString('fr-FR', options),
    });
  }, []);

  // Blocs de contenus prédéfinis avec variables et valeurs réelles
  const contentBlocks = {
    dates: [
      { 
        label: "Date d'aujourd'hui", 
        value: "{{DATE}}", 
        realValue: currentDateValues.date
      },
      { 
        label: "Date courte (JJ/MM/AAAA)", 
        value: "{{DATE_SHORT}}", 
        realValue: currentDateValues.dateShort
      },
      { 
        label: "Heure actuelle", 
        value: "{{HEURE}}", 
        realValue: currentDateValues.heure
      },
      { 
        label: "Dans une semaine", 
        value: "{{DATE_FUTURE_1W}}", 
        realValue: currentDateValues.dateFuture1W
      },
      { 
        label: "Dans deux semaines", 
        value: "{{DATE_FUTURE_2W}}", 
        realValue: currentDateValues.dateFuture2W
      },
      { 
        label: "Dans un mois", 
        value: "{{DATE_FUTURE_1M}}", 
        realValue: currentDateValues.dateFuture1M
      },
      { 
        label: "Dans 3 mois", 
        value: "{{DATE_FUTURE_3M}}", 
        realValue: currentDateValues.dateFuture3M
      },
      { 
        label: "Dans 6 mois", 
        value: "{{DATE_FUTURE_6M}}", 
        realValue: currentDateValues.dateFuture6M
      },
      { 
        label: "Jour de la semaine", 
        value: "{{JOUR_SEMAINE}}", 
        realValue: currentDateValues.jourSemaine
      },
    ],
    patient: [
      { 
        label: "Nom du patient", 
        value: "{{PATIENT_NOM}}", 
        realValue: "Dupont" 
      },
      { 
        label: "Prénom du patient", 
        value: "{{PATIENT_PRENOM}}", 
        realValue: "Jean" 
      },
      { 
        label: "Âge du patient", 
        value: "{{PATIENT_AGE}}", 
        realValue: "45" 
      },
      { 
        label: "Numéro de dossier", 
        value: "{{REF_ID}}", 
        realValue: "RM-1234-5678-2025" 
      },
    ],
    advice: [
      { 
        category: "Repos", 
        title: "Conseil de repos", 
        content: "<p><strong>Je conseille au patient</strong> de se reposer complètement pendant 3 semaines et d'éviter toute activité physique intense.</p>" 
      },
      { 
        category: "Médication", 
        title: "Conseil de médication", 
        content: "<p><strong>Je conseille au patient</strong> de prendre les médicaments prescrits selon le calendrier établi et de signaler tout effet secondaire.</p>" 
      },
      { 
        category: "Suivi", 
        title: "Conseil de suivi", 
        content: "<p><strong>Je conseille au patient</strong> de programmer un rendez-vous de suivi dans 2 semaines pour évaluer l'évolution de son état.</p>" 
      },
      { 
        category: "Régime", 
        title: "Conseil de régime", 
        content: "<p><strong>Je conseille au patient</strong> de suivre un régime pauvre en sel et riche en fruits et légumes frais pendant toute la durée du traitement.</p>" 
      },
      { 
        category: "Exercice", 
        title: "Conseil d'exercice", 
        content: "<p><strong>Je conseille au patient</strong> de pratiquer des exercices doux comme la marche légère ou la natation, à raison de 20 minutes par jour maximum.</p>" 
      },
      { 
        category: "Hydratation", 
        title: "Conseil d'hydratation", 
        content: "<p><strong>Je conseille au patient</strong> de boire au moins 2 litres d'eau par jour pour maintenir une bonne hydratation et faciliter l'élimination des toxines.</p>" 
      },
      { 
        category: "Sommeil", 
        title: "Conseil de sommeil", 
        content: "<p><strong>Je conseille au patient</strong> d'adopter un rythme de sommeil régulier avec 7-8 heures de repos nocturne et d'éviter les écrans 1 heure avant le coucher.</p>" 
      },
      { 
        category: "Stress", 
        title: "Conseil de gestion du stress", 
        content: "<p><strong>Je conseille au patient</strong> de pratiquer des techniques de relaxation comme la respiration profonde ou la méditation pour réduire le niveau de stress.</p>" 
      },
    ],
    sections: [
      { 
        title: "Examen clinique", 
        content: `
          <h3>Examen clinique</h3>
          <ul>
            <li>Poids: </li>
            <li>Température: </li>
            <li>Tension artérielle: </li>
            <li>Fréquence cardiaque: </li>
            <li>Observations: </li>
          </ul>
        `
      },
      { 
        title: "Diagnostic", 
        content: `
          <h3>Diagnostic</h3>
          <p>Au vu des symptômes présentés et des résultats d'examens, le diagnostic retenu est:</p>
          <p><strong></strong></p>
        `
      },
      { 
        title: "Traitement prescrit", 
        content: `
          <h3>Traitement prescrit</h3>
          <ol>
            <li>Médicament: , Posologie: , Durée: </li>
            <li>Médicament: , Posologie: , Durée: </li>
          </ol>
        `
      },
      { 
        title: "Suivi recommandé", 
        content: `
          <h3>Suivi recommandé</h3>
          <p>Un rendez-vous de contrôle est à prévoir dans:</p>
          <p>Examens complémentaires à réaliser avant la prochaine consultation:</p>
        `
      },
    ]
  };

  // Refresh templates list when component mounts
  useEffect(() => {
    refreshTemplates();
  }, []);

  // Refresh templates list
  const refreshTemplates = () => {
    setTemplates(getMedicalTemplates());
  };

  // Insert visible content but maintain template functionality
  const insertDateVariable = (date: { label: string, value: string, realValue: string }) => {
    // Insérer une combinaison de valeur visible et variable fonctionnelle
    const insertText = `<span data-variable="${date.value}">${date.realValue}</span>`;
    setNewTemplateContent(prev => prev + insertText);
  };

  // Insert patient info with actual example but maintain template functionality
  const insertPatientVariable = (info: { label: string, value: string, realValue: string }) => {
    // Insérer une combinaison de valeur visible et variable fonctionnelle
    const insertText = `<span data-variable="${info.value}">${info.realValue}</span>`;
    setNewTemplateContent(prev => prev + insertText);
  };

  // Insert advice block
  const insertAdvice = (advice: { title: string, content: string }) => {
    setNewTemplateContent(prev => prev + advice.content);
  };

  // Insert section block
  const insertSection = (section: { title: string, content: string }) => {
    setNewTemplateContent(prev => prev + section.content);
  };

  // Handle creating a new template
  const handleCreateTemplate = () => {
    if (newTemplateName.trim() === "" || newTemplateContent.trim() === "") {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // Generate unique ID based on template name
    const templateId = newTemplateName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    // Process the template content to convert spans to variables
    let processedContent = newTemplateContent;
    
    // Replace all spans with data-variable with their actual variable code
    const spanRegex = /<span data-variable="(.*?)">(.*?)<\/span>/g;
    processedContent = processedContent.replace(spanRegex, (match, variable) => {
      return variable;
    });

    // Create template with basic structure
    const template = {
      id: templateId,
      name: newTemplateName,
      content: processedContent
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

  return (
    <div className="border rounded-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Gestion des modèles</h2>
        
        {!isCreating && (
          <Button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus className="size-4" /> Nouveau modèle
          </Button>
        )}
      </div>

      {/* Template creation form */}
      {isCreating && (
        <div className="border rounded-md p-4 mb-4 bg-slate-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium">Nouveau modèle</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsCreating(false)}
            >
              <X className="size-4" />
            </Button>
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
            
            <Tabs 
              defaultValue="editor" 
              className="w-full"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor">Éditeur</TabsTrigger>
                <TabsTrigger value="preview">Aperçu</TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="border rounded-md p-4">
                <textarea
                  className="w-full p-2 border rounded-md min-h-[200px] mb-4"
                  placeholder="Entrez le contenu du modèle ici..."
                  value={newTemplateContent}
                  onChange={(e) => setNewTemplateContent(e.target.value)}
                />
                
                {/* Aide pour les variables disponibles */}
                <div className="mb-2 p-2 bg-blue-50 rounded border border-blue-100 text-sm">
                  <p><strong>Astuce :</strong> Utilisez les boutons ci-dessous pour insérer des variables dynamiques. Vous verrez les valeurs d'exemple affichées directement dans l'éditeur.</p>
                </div>
                
                {/* Éléments disponibles */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="dates">
                    <AccordionTrigger className="flex items-center gap-2 text-sm font-medium">
                      <CalendarDays className="size-4" /> Insérer des dates
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2 my-2">
                        {contentBlocks.dates.map((date, index) => (
                          <Button 
                            key={index}
                            variant="outline" 
                            size="sm"
                            className="justify-start text-left"
                            onClick={() => insertDateVariable(date)}
                          >
                            <span className="flex justify-between w-full">
                              <span>{date.label}</span>
                              <span className="text-xs text-blue-600">{date.realValue}</span>
                            </span>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="patient">
                    <AccordionTrigger className="flex items-center gap-2 text-sm font-medium">
                      <User className="size-4" /> Informations patient
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2 my-2">
                        {contentBlocks.patient.map((info, index) => (
                          <Button 
                            key={index}
                            variant="outline" 
                            size="sm"
                            className="justify-start text-left"
                            onClick={() => insertPatientVariable(info)}
                          >
                            <span className="flex justify-between w-full">
                              <span>{info.label}</span>
                              <span className="text-xs text-green-600">{info.realValue}</span>
                            </span>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="advice">
                    <AccordionTrigger className="flex items-center gap-2 text-sm font-medium">
                      <MessageSquare className="size-4" /> Conseils prédéfinis
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-2 my-2">
                        {contentBlocks.advice.map((advice, index) => (
                          <Button 
                            key={index}
                            variant="outline" 
                            size="sm"
                            className="justify-start text-left"
                            onClick={() => insertAdvice(advice)}
                          >
                            {advice.title}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="sections">
                    <AccordionTrigger className="flex items-center gap-2 text-sm font-medium">
                      <Stethoscope className="size-4" /> Sections médicales
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-2 my-2">
                        {contentBlocks.sections.map((section, index) => (
                          <Button 
                            key={index}
                            variant="outline" 
                            size="sm"
                            className="justify-start text-left"
                            onClick={() => insertSection(section)}
                          >
                            {section.title}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
              
              <TabsContent value="preview" className="border rounded-md p-4">
                <div className="bg-white p-4 border rounded-md min-h-[200px]"
                     dangerouslySetInnerHTML={{ __html: newTemplateContent }} />
              </TabsContent>
            </Tabs>
            
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
          <p className="text-sm text-slate-500">Aucun modèle personnalisé.</p>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="flex justify-between items-center p-2 border rounded-md mb-2 hover:bg-slate-50"
              >
                <span>{template.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTemplate(template.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
