// data/templates.ts

// Define the template interface
export interface Template {
  id: string;
  name: string;
  content: string;
}

// Get all medical templates from local storage
export const getMedicalTemplates = (): Template[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    
    const templatesJson = localStorage.getItem('medicalTemplates');
    return templatesJson ? JSON.parse(templatesJson) : [];
  } catch (error) {
    console.error("Error loading templates:", error);
    return [];
  }
};

// Add a new template to storage
export const addTemplate = (template: Template): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    const templates = getMedicalTemplates();
    
    // Check if a template with this ID already exists
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      // Update existing template
      templates[existingIndex] = template;
    } else {
      // Add new template
      templates.push(template);
    }
    
    localStorage.setItem('medicalTemplates', JSON.stringify(templates));
  } catch (error) {
    console.error("Error saving template:", error);
    throw new Error("Erreur lors de l'enregistrement du modèle");
  }
};

// Remove a template from storage by ID
export const removeTemplate = (id: string): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    const templates = getMedicalTemplates();
    const filteredTemplates = templates.filter(t => t.id !== id);
    localStorage.setItem('medicalTemplates', JSON.stringify(filteredTemplates));
  } catch (error) {
    console.error("Error removing template:", error);
    throw new Error("Erreur lors de la suppression du modèle");
  }
};

// Get a single template by ID
export const getTemplateById = (id: string): Template | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const templates = getMedicalTemplates();
    return templates.find(t => t.id === id) || null;
  } catch (error) {
    console.error("Error getting template:", error);
    return null;
  }
};