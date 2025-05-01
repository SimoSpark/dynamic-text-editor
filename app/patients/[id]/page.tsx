"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Patient } from "@/types/patient";
import { getPatientById, updatePatient } from "@/data/patients";
import PatientRapportEditor from "@/components/patient-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Printer } from "lucide-react";
import { getMedicalTemplates } from "@/data/templates";

// Individual patient (rapport) page
export default function PatientPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [rapport, setRapport] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("default");

  // Loads patient details by ID
  useEffect(() => {
    const patientId = Number(params.id);
    const patientData = getPatientById(patientId);
    
    if (patientData) {
      setPatient(patientData);
    }
    
    // Load available templates
    setTemplates(getMedicalTemplates());
    setLoading(false);
  }, [params.id]);

  const handleRetour = () => {
    router.push("/patients");
  };

  const handleSave = () => {
    if (patient) {
      updatePatient({...patient, rapport});
      alert("Le rapport médical a été enregistré.");
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
            className="flex items-center gap-2"
          >
            <Save className="size-4" /> Enregistrer
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

      {/* Template selector */}
      <div className="mb-4 print:hidden">
        <label htmlFor="template" className="block text-sm font-medium mb-2">
          Type d'examen / Condition médicale:
        </label>
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

      <div className="mb-6 print:mb-4">
        <PatientRapportEditor 
          patient={patient} 
          onChange={handleRapportChange}
          templateId={selectedTemplate}
        />
      </div>
    </div>
  );
}