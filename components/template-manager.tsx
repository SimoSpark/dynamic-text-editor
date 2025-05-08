"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2, X, Info, CalendarDays, MessageSquare, User, Stethoscope } from "lucide-react";
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
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TemplateManagerImproved() {
  const [templates, setTemplates] = useState(getMedicalTemplates());
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");
  const [selectedTab, setSelectedTab] = useState("editor");

  // Blocs de contenus prédéfinis
  const contentBlocks = {
    dates: [
      { label: "Date d'aujourd'hui", value: "{{DATE}}" },
      { label: "Date courte (JJ/MM/AAAA)", value: "{{DATE_SHORT}}" },
      { label: "Heure actuelle", value: "{{HEURE}}" },
      { label: "Dans une semaine", value: "{{DATE_FUTURE_1W}}" },
      { label: "Dans deux semaines", value: "{{DATE_FUTURE_2W}}" },
      { label: "Dans un mois", value: "{{DATE_FUTURE_1M}}" },
      { label: "Dans 3 mois", value: "{{DATE_FUTURE_3M}}" },
      { label: "Dans 6 mois", value: "{{DATE_FUTURE_6M}}" },
      { label: "Jour de la semaine", value: "{{JOUR_SEMAINE}}" },
    ],
    patient: [
      { label: "Nom du patient", value: "{{PATIENT_NOM}}" },
      { label: "Prénom du patient", value: "{{PATIENT_PRENOM}}" },
      { label: "Âge du patient", value: "{{PATIENT_AGE}}" },
      { label: "Numéro de dossier", value: "{{REF_ID}}" },
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

  // Refresh templates list
  const refreshTemplates = () => {
    setTemplates(getMedicalTemplates());
  };

  // Insert element into template content
  const insertContent = (content: string) => {
    setNewTemplateContent(prev => prev + content);
  };

  // Insert a date placeholder with user-friendly label
  const insertDatePlaceholder = (date: { label: string, value: string }) => {
    // On insère uniquement la valeur technique ({{DATE}}) mais on affiche le libellé à l'utilisateur
    insertContent(`<span data-date-var="${date.value}" class="bg-blue-100 px-2 py-1 rounded text-blue-800">${date.label}</span>`);
  };

  // Insert a patient info placeholder
  const insertPatientPlaceholder = (info: { label: string, value: string }) => {
    insertContent(`<span data-patient-var="${info.value}" class="bg-green-100 px-2 py-1 rounded text-green-800">${info.label}</span>`);
  };

  // Insert advice block
  const insertAdvice = (advice: { title: string, content: string }) => {
    insertContent(advice.content);
  };

  // Insert section block
  const insertSection = (section: { title: string, content: string }) => {
    insertContent(section.content);
  };

  // Handle creating a new template
  const handleCreateTemplate = () => {
    if (newTemplateName.trim() === "" || newTemplateContent.trim() === "") {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // Process content to convert user-friendly spans to actual variables
    let processedContent = newTemplateContent;
    
    // Replace date spans with actual variables
    contentBlocks.dates.forEach(date => {
      const spanRegex = new RegExp(`<span data-date-var="${date.value}" class="[^"]*">${date.label}<\/span>`, 'g');
      processedContent = processedContent.replace(spanRegex, date.value);
    });
    
    // Replace patient info spans with actual variables
    contentBlocks.patient.forEach(info => {
      const spanRegex = new RegExp(`<span data-patient-var="${info.value}" class="[^"]*">${info.label}<\/span>`, 'g');
      processedContent = processedContent.replace(spanRegex, info.value);
    });

    // Generate unique ID based on template name
    const templateId = newTemplateName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

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

  // Preview the template with sample data
  const getPreviewContent = () => {
    let previewContent = newTemplateContent;
    
    // Replace with preview values
    contentBlocks.dates.forEach(date => {
      const spanRegex = new RegExp(`<span data-date-var="${date.value}" class="[^"]*">${date.label}<\/span>`, 'g');
      let previewValue = "";
      
      // Generate sample dates for preview
      switch(date.value) {
        case "{{DATE}}":
          previewValue = "8 mai 2025";
          break;
        case "{{DATE_SHORT}}":
          previewValue = "08/05/2025";
          break;
        case "{{HEURE}}":
          previewValue = "14:30";
          break;
        case "{{DATE_FUTURE_1W}}":
          previewValue = "15 mai 2025";
          break;
        case "{{DATE_FUTURE_2W}}":
          previewValue = "22 mai 2025";
          break;
        case "{{DATE_FUTURE_1M}}":
          previewValue = "8 juin 2025";
          break;
        case "{{DATE_FUTURE_3M}}":
          previewValue = "8 août 2025";
          break;
        case "{{DATE_FUTURE_6M}}":
          previewValue = "8 novembre 2025";
          break;
        case "{{JOUR_SEMAINE}}":
          previewValue = "Jeudi";
          break;
        default:
          previewValue = "[date]";
      }
      
      previewContent = previewContent.replace(spanRegex, previewValue);
    });
    
    // Replace patient spans with preview values
    contentBlocks.patient.forEach(info => {
      const spanRegex = new RegExp(`<span data-patient-var="${info.value}" class="[^"]*">${info.label}<\/span>`, 'g');
      let previewValue = "";
      
      switch(info.value) {
        case "{{PATIENT_NOM}}":
          previewValue = "Dupont";
          break;
        case "{{PATIENT_PRENOM}}":
          previewValue = "Jean";
          break;
        case "{{PATIENT_AGE}}":
          previewValue = "45";
          break;
        case "{{REF_ID}}":
          previewValue = "RM-1234-5678-2025";
          break;
        default:
          previewValue = "[info patient]";
      }
      
      previewContent = previewContent.replace(spanRegex, previewValue);
    });
    
    return previewContent;
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
                            onClick={() => insertDatePlaceholder(date)}
                          >
                            {date.label}
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
                            onClick={() => insertPatientPlaceholder(info)}
                          >
                            {info.label}
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
                <div 
                  className="min-h-[200px] p-4 border rounded-md bg-white"
                  dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Ceci est un aperçu avec des données d'exemple. Les variables seront remplacées par les informations réelles du patient lors de l'utilisation.
                </p>
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