"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Patient } from "@/types/patient";
import { getPatientById } from "@/data/patients";
import PatientRapportEditor from "@/components/patient-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Printer, PenSquare } from "lucide-react";
import { getMedicalTemplates } from "@/data/templates";
import TemplateManager from "@/components/template-manager";

// Individual patient (rapport) page
export default function PatientPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rapport, setRapport] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("default");
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  // Loads patient details by ID
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientId = Number(params.id);
        // First try to load from local data (for compatibility)
        const patientData = getPatientById(patientId);
        
        if (patientData) {
          setPatient(patientData);
          // If there's saved rapport content in the patient data, use it
          if (patientData.rapport) {
            setRapport(patientData.rapport);
          }
        }
        
        // Load available templates
        refreshTemplates();
      } catch (error) {
        console.error("Error loading patient:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatient();
  }, [params.id]);

  // Refresh templates list
  const refreshTemplates = () => {
    setTemplates(getMedicalTemplates());
  };

  const handleRetour = () => {
    router.push("/patients");
  };

  const handleSave = async () => {
    if (!patient) return;
    
    try {
      setSaving(true);
      
      // Make API request to save the rapport
      const response = await fetch(`/api/patients/${patient.id}/reports`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rapport }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save report');
      }
      
      const updatedPatient = await response.json();
      
      // Update local state with the saved patient data
      setPatient(prev => prev ? {...prev, rapport} : null);
      
      // For compatibility with the existing code, also update the local data
      updatePatient({...patient, rapport});
      
      alert("Le rapport médical a été enregistré.");
    } catch (error) {
      console.error("Error saving report:", error);
      alert(`Erreur lors de l'enregistrement du rapport: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setSaving(false);
    }
  };
  
  // This function is needed to maintain compatibility with your existing code
  const updatePatient = (updatedPatient: Patient) => {
    try {
      // Get the patients array from localStorage or create empty array
      const storedPatients = localStorage.getItem('patients');
      const patients = storedPatients ? JSON.parse(storedPatients) : [];
      
      // Find and update the patient in the array
      const updatedPatients = patients.map((p: Patient) => 
        p.id === updatedPatient.id ? updatedPatient : p
      );
      
      // Save updated patients array back to localStorage
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
    } catch (error) {
      console.error("Error updating patient in local storage:", error);
    }
  };
  
  // We can print the report 
  const handlePrint = () => {
    window.print();
  };
  
  const handleRapportChange = (content: string) => {
    setRapport(content);
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
  };

  // Toggle template manager visibility
  const toggleTemplateManager = () => {
    const newState = !showTemplateManager;
    setShowTemplateManager(newState);
    
    // Refresh templates when closing the manager
    if (!newState) {
      refreshTemplates();
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-8">Chargement...</div>;
  }

  if (!patient) {
    return <div className="max-w-4xl mx-auto py-8">Patient non trouvé</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Button 
          variant="outline" 
          onClick={handleRetour}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="size-4" /> Retour
        </Button>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="size-4" /> {saving ? 'Sauvegarde en cours...' : 'Enregistrer'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="size-4" /> Imprimer
          </Button>
        </div>
      </div>

      {/* Template management section */}
      <div className="mb-4 print:hidden">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="template" className="block text-sm font-medium">
            Type d'examen 
          </label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTemplateManager}
            className="flex items-center gap-1 text-sm"
          >
            <PenSquare className="size-4" /> 
            {showTemplateManager ? "Fermer" : "Gérer les modèles"}
          </Button>
        </div>
        
        <select
          id="template"
          className="w-full p-2 border rounded-md"
          value={selectedTemplate}
          onChange={handleTemplateChange}
        >
          <option value="default">Rapport médical standard</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {/* Template manager */}
      {showTemplateManager && (
        <div className="print:hidden">
          <TemplateManager />
        </div>
      )}

      <div className="mb-6 print:mb-4">
        <PatientRapportEditor 
          patient={patient} 
          onChange={handleRapportChange}
          templateId={selectedTemplate}
          initialContent={patient.rapport}
        />
      </div>
    </div>
  );
}