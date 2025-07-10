import { useState, useEffect } from "react";
import { Plus, Save, Trash2, X, CalendarDays, MessageSquare, User, Stethoscope } from "lucide-react";

// Template interface
interface Template {
  id: string;
  name: string;
  content: string;
}

export default function TemplateManager() {
  // Using React state instead of localStorage
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

  // Content blocks with variables and real values
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

  // Template management functions using React state
  const addTemplate = (template: Template): void => {
    setTemplates(prev => [...prev, template]);
  };

  const removeTemplate = (id: string): void => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Insert date variable
  const insertDateVariable = (date: { label: string, value: string, realValue: string }) => {
    const insertText = `<span data-variable="${date.value}">${date.realValue}</span>`;
    setNewTemplateContent(prev => prev + insertText);
  };

  // Insert patient variable
  const insertPatientVariable = (info: { label: string, value: string, realValue: string }) => {
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

    // Add template to state
    addTemplate(template);
    
    // Reset form
    setNewTemplateName("");
    setNewTemplateContent("");
    setIsCreating(false);
  };

  // Handle removing a template
  const handleRemoveTemplate = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce modèle?")) {
      removeTemplate(id);
    }
  };

  // Simple Accordion component
  const Accordion = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full">{children}</div>
  );

  const AccordionItem = ({ value, children }: { value: string, children: React.ReactNode }) => (
    <div className="border rounded-md mb-2">{children}</div>
  );

  const AccordionTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button 
          className={`w-full p-3 text-left hover:bg-gray-50 ${className}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {children}
        </button>
        {isOpen && (
          <div className="p-3 border-t">
            {/* Content will be rendered by AccordionContent */}
          </div>
        )}
      </div>
    );
  };

  const AccordionContent = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );

  // Simple Tabs component
  const Tabs = ({ children, defaultValue, value, onValueChange }: { 
    children: React.ReactNode, 
    defaultValue: string,
    value: string,
    onValueChange: (value: string) => void
  }) => (
    <div className="w-full">{children}</div>
  );

  const TabsList = ({ children }: { children: React.ReactNode }) => (
    <div className="flex border-b mb-4">{children}</div>
  );

  const TabsTrigger = ({ value, children }: { value: string, children: React.ReactNode }) => (
    <button
      className={`px-4 py-2 border-b-2 ${selectedTab === value ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
      onClick={() => setSelectedTab(value)}
    >
      {children}
    </button>
  );

  const TabsContent = ({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) => (
    selectedTab === value ? <div className={className}>{children}</div> : null
  );

  return (
    <div className="border rounded-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Gestion des modèles</h2>
        
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <Plus className="size-4" /> Nouveau modèle
          </button>
        )}
      </div>

      {/* Template creation form */}
      {isCreating && (
        <div className="border rounded-md p-4 mb-4 bg-slate-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium">Nouveau modèle</h3>
            <button 
              className="p-1 hover:bg-gray-200 rounded"
              onClick={() => setIsCreating(false)}
            >
              <X className="size-4" />
            </button>
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
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList>
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
                
                {/* Help for available variables */}
                <div className="mb-2 p-2 bg-blue-50 rounded border border-blue-100 text-sm">
                  <p><strong>Astuce :</strong> Utilisez les boutons ci-dessous pour insérer des variables dynamiques. Vous verrez les valeurs d'exemple affichées directement dans l'éditeur.</p>
                </div>
                
                {/* Available elements */}
                <div className="space-y-4">
                  <div className="border rounded-md">
                    <button 
                      className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm font-medium"
                      onClick={() => {}} // Toggle logic would go here
                    >
                      <CalendarDays className="size-4" /> Insérer des dates
                    </button>
                    <div className="p-3 border-t">
                      <div className="grid grid-cols-2 gap-2">
                        {contentBlocks.dates.map((date, index) => (
                          <button 
                            key={index}
                            className="p-2 border rounded text-left hover:bg-gray-50 text-sm"
                            onClick={() => insertDateVariable(date)}
                          >
                            <div className="flex justify-between w-full">
                              <span>{date.label}</span>
                              <span className="text-xs text-blue-600">{date.realValue}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <button 
                      className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm font-medium"
                      onClick={() => {}} // Toggle logic would go here
                    >
                      <User className="size-4" /> Informations patient
                    </button>
                    <div className="p-3 border-t">
                      <div className="grid grid-cols-2 gap-2">
                        {contentBlocks.patient.map((info, index) => (
                          <button 
                            key={index}
                            className="p-2 border rounded text-left hover:bg-gray-50 text-sm"
                            onClick={() => insertPatientVariable(info)}
                          >
                            <div className="flex justify-between w-full">
                              <span>{info.label}</span>
                              <span className="text-xs text-green-600">{info.realValue}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <button 
                      className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm font-medium"
                      onClick={() => {}} // Toggle logic would go here
                    >
                      <MessageSquare className="size-4" /> Conseils prédéfinis
                    </button>
                    <div className="p-3 border-t">
                      <div className="grid grid-cols-1 gap-2">
                        {contentBlocks.advice.map((advice, index) => (
                          <button 
                            key={index}
                            className="p-2 border rounded text-left hover:bg-gray-50 text-sm"
                            onClick={() => insertAdvice(advice)}
                          >
                            {advice.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <button 
                      className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm font-medium"
                      onClick={() => {}} // Toggle logic would go here
                    >
                      <Stethoscope className="size-4" /> Sections médicales
                    </button>
                    <div className="p-3 border-t">
                      <div className="grid grid-cols-1 gap-2">
                        {contentBlocks.sections.map((section, index) => (
                          <button 
                            key={index}
                            className="p-2 border rounded text-left hover:bg-gray-50 text-sm"
                            onClick={() => insertSection(section)}
                          >
                            {section.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="border rounded-md p-4">
                <div className="bg-white p-4 border rounded-md min-h-[200px]"
                     dangerouslySetInnerHTML={{ __html: newTemplateContent }} />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <button 
                onClick={handleCreateTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Save className="size-4" /> Enregistrer le modèle
              </button>
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
                <button
                  onClick={() => handleRemoveTemplate(template.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}