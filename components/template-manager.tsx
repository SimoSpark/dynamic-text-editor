"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2, X } from "lucide-react";
import { addTemplate, getMedicalTemplates, removeTemplate } from "@/data/templates";

export default function TemplateManager() {
  const [templates, setTemplates] = useState(getMedicalTemplates());
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");

  // Refresh templates list
  const refreshTemplates = () => {
    setTemplates(getMedicalTemplates());
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
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Contenu du modèle
              </label>
              <textarea
                className="w-full p-2 border rounded-md min-h-[200px]"
                placeholder="Entrez le contenu du modèle ici..."
                value={newTemplateContent}
                onChange={(e) => setNewTemplateContent(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Utilisez pour insérer la date actuelle. Les informations du patient seront automatiquement ajoutées.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleCreateTemplate}
                className="flex items-center gap-2"
              >
                <Save className="size-4" /> Enregistrer
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