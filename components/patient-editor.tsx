"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import MenuBar from "./rich-text-editor/menu-bar";
import { Patient } from "@/types/patient";
import { useEffect, useState } from "react";
import { getTemplateById } from "@/data/templates";

interface PatientRapportEditorProps {
  patient: Patient;
  onChange: (content: string) => void;
  templateId?: string;
  doctor?: string;
}

export default function PatientRapportEditor({
  patient,
  onChange,
  templateId = "default",
  doctor,
}: PatientRapportEditorProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [shortDate, setShortDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [refId, setRefId] = useState<string>("");
  const [jourSemaine, setJourSemaine] = useState<string>("");
  const [dateFuture1W, setDateFuture1W] = useState<string>("");
  const [dateFuture2W, setDateFuture2W] = useState<string>("");
  const [dateFuture1M, setDateFuture1M] = useState<string>("");
  const [dateFuture3M, setDateFuture3M] = useState<string>("");
  const [dateFuture6M, setDateFuture6M] = useState<string>("");

  useEffect(() => {
    // Format current date
    const now = new Date();
    
    // Full date format
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setFormattedDate(now.toLocaleDateString('fr-FR', options));
    
    // Short date format
    setShortDate(now.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }));
    
    // Time format
    setCurrentTime(now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }));
    
    // Generate reference ID
    const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setRefId(`RM-${patient.id}-${randomId}-${now.getFullYear()}`);
    
    // Get day of week
    const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    setJourSemaine(joursSemaine[now.getDay()]);
    
    // Calculate future dates
    const oneWeek = new Date(now);
    oneWeek.setDate(now.getDate() + 7);
    setDateFuture1W(oneWeek.toLocaleDateString('fr-FR', options));
    
    const twoWeeks = new Date(now);
    twoWeeks.setDate(now.getDate() + 14);
    setDateFuture2W(twoWeeks.toLocaleDateString('fr-FR', options));
    
    const oneMonth = new Date(now);
    oneMonth.setMonth(now.getMonth() + 1);
    setDateFuture1M(oneMonth.toLocaleDateString('fr-FR', options));
    
    const threeMonths = new Date(now);
    threeMonths.setMonth(now.getMonth() + 3);
    setDateFuture3M(threeMonths.toLocaleDateString('fr-FR', options));
    
    const sixMonths = new Date(now);
    sixMonths.setMonth(now.getMonth() + 6);
    setDateFuture6M(sixMonths.toLocaleDateString('fr-FR', options));
    
  }, [patient.id]);

  // Process template and replace variables
  const processTemplate = (templateContent: string): string => {
    // Replace all dynamic variables in the template
    return templateContent
      .replace(/{{DATE}}/g, formattedDate)
      .replace(/{{DATE_SHORT}}/g, shortDate)
      .replace(/{{HEURE}}/g, currentTime)
      .replace(/{{PATIENT_NOM}}/g, patient.nom)
      .replace(/{{PATIENT_PRENOM}}/g, patient.prenom)
      .replace(/{{PATIENT_AGE}}/g, patient.age.toString())
      .replace(/{{REF_ID}}/g, refId)
      .replace(/{{JOUR_SEMAINE}}/g, jourSemaine)
      .replace(/{{DATE_FUTURE_1W}}/g, dateFuture1W)
      .replace(/{{DATE_FUTURE_2W}}/g, dateFuture2W)
      .replace(/{{DATE_FUTURE_1M}}/g, dateFuture1M)
      .replace(/{{DATE_FUTURE_3M}}/g, dateFuture3M)
      .replace(/{{DATE_FUTURE_6M}}/g, dateFuture6M);
  };

  // Create the initial report content (template with patient info)
  const createInitialContent = () => {
    // Get the selected template or use default
    const selectedTemplate = getTemplateById(templateId);
    
    // Default template if none specified or not found
    if (!selectedTemplate || templateId === "default") {
      return `
        <h1 style="text-align: center;">RAPPORT MÉDICAL</h1>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p><strong>Patient:</strong> ${patient.prenom} ${patient.nom}</p>
            <p><strong>Âge:</strong> ${patient.age} ans</p>
          </div>
          <div>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Référence:</strong> ${refId}</p>
          </div>
        </div>
        
        <h2>Description médicale</h2>
        <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
          ${patient.description || "Aucune description fournie"}
        </div>
        
        <h2>Conseils et prescriptions</h2>
        <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
          ${patient.conseils || "Ajoutez vos conseils et prescriptions ici"}
        </div>
        
        <div style="margin-top: 40px;">
          <p><strong>Médecin:</strong> ${doctor || "Dr. ________"}</p>
          <p><strong>Signature:</strong> ________________ </p>
        </div>
        
        <div style="margin-top: 30px; font-size: 0.8em; color: #666; text-align: center;">
          <p>Ce document est confidentiel et contient des informations médicales protégées.</p>
        </div>
      `;
    }
    
    // Apply template with patient information
    let templateContent = processTemplate(selectedTemplate.content);
    
    // Add the standard patient header and footer
    return `
      <h1 style="text-align: center;">RAPPORT MÉDICAL</h1>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <p><strong>Patient:</strong> ${patient.prenom} ${patient.nom}</p>
          <p><strong>Âge:</strong> ${patient.age} ans</p>
        </div>
        <div>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Référence:</strong> ${refId}</p>
        </div>
      </div>
      
      ${templateContent}
      
      <div style="margin-top: 40px;">
        <p><strong>Médecin:</strong> ${doctor || "Dr. ________"}</p>
        <p><strong>Signature:</strong> ________________ </p>
      </div>
      
      <div style="margin-top: 30px; font-size: 0.8em; color: #666; text-align: center;">
        <p>Ce document est confidentiel et contient des informations médicales protégées.</p>
      </div>
    `;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Placeholder.configure({
        placeholder: "Rapport médical...",
      }),
    ],
    content: createInitialContent(),
    editorProps: {
      attributes: {
        class: "min-h-[600px] border rounded-md bg-white py-6 px-8 print:border-none print:bg-white print:p-0",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update content when the patient or template changes
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(createInitialContent());
    }
  }, [patient, templateId]);

  return (
    <div className="print:shadow-none">
      <div className="print:hidden">
        <MenuBar editor={editor} patient={patient} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}