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
import { addDays, addMonths, addWeeks, format } from "date-fns";
import { fr } from "date-fns/locale";

interface PatientRapportEditorProps {
  patient: Patient;
  onChange: (content: string) => void;
  templateId?: string;
  doctor?: string; // Optional doctor name
}

export default function PatientRapportEditor({
  patient,
  onChange,
  templateId = "default",
  doctor,
}: PatientRapportEditorProps) {
  const [date, setDate] = useState<string>("");
  const [shortDate, setShortDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [refId, setRefId] = useState<string>("");
  const [weekday, setWeekday] = useState<string>("");
  const [futureDates, setFutureDates] = useState<Record<string, string>>({});

  useEffect(() => {
    // Format current date
    const now = new Date();
    
    // Full date format
    setDate(format(now, 'dd MMMM yyyy', { locale: fr }));
    
    // Short date format
    setShortDate(format(now, 'dd/MM/yyyy'));
    
    // Time format
    setCurrentTime(format(now, 'HH:mm'));
    
    // Weekday
    setWeekday(format(now, 'EEEE', { locale: fr }));
    
    // Future dates
    setFutureDates({
      "1W": format(addWeeks(now, 1), 'dd MMMM yyyy', { locale: fr }),
      "2W": format(addWeeks(now, 2), 'dd MMMM yyyy', { locale: fr }),
      "1M": format(addMonths(now, 1), 'dd MMMM yyyy', { locale: fr }),
      "3M": format(addMonths(now, 3), 'dd MMMM yyyy', { locale: fr }),
      "6M": format(addMonths(now, 6), 'dd MMMM yyyy', { locale: fr }),
    });
    
    // Generate reference ID
    const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setRefId(`RM-${patient.id}-${randomId}-${now.getFullYear()}`);
  }, [patient.id]);

  // Process template and replace variables
  const processTemplate = (templateContent: string): string => {
    // Replace all dynamic variables in the template
    return templateContent
      // Dates
      .replace(/{{DATE}}/g, date)
      .replace(/{{DATE_SHORT}}/g, shortDate)
      .replace(/{{HEURE}}/g, currentTime)
      .replace(/{{JOUR_SEMAINE}}/g, weekday)
      .replace(/{{DATE_FUTURE_1W}}/g, futureDates["1W"] || "")
      .replace(/{{DATE_FUTURE_2W}}/g, futureDates["2W"] || "")
      .replace(/{{DATE_FUTURE_1M}}/g, futureDates["1M"] || "")
      .replace(/{{DATE_FUTURE_3M}}/g, futureDates["3M"] || "")
      .replace(/{{DATE_FUTURE_6M}}/g, futureDates["6M"] || "")
      // Patient
      .replace(/{{PATIENT_NOM}}/g, patient.nom)
      .replace(/{{PATIENT_PRENOM}}/g, patient.prenom)
      .replace(/{{PATIENT_AGE}}/g, patient.age.toString())
      .replace(/{{PATIENT_DESC}}/g, patient.description || "")
      .replace(/{{PATIENT_CONSEILS}}/g, patient.conseils || "")
      // Document
      .replace(/{{REF_ID}}/g, refId)
      .replace(/{{CABINET_NOM}}/g, "Cabinet Médical")
      .replace(/{{CABINET_ADRESSE}}/g, "123 Rue de la Médecine")
      .replace(/{{CABINET_TEL}}/g, "01 23 45 67 89");
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
            <p><strong>Date:</strong> ${date}</p>
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
    
    // Add the standard patient header and footer if not already included in the template
    if (!templateContent.includes("<h1") && !templateContent.includes("RAPPORT MÉDICAL")) {
      templateContent = `
        <h1 style="text-align: center;">RAPPORT MÉDICAL</h1>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p><strong>Patient:</strong> ${patient.prenom} ${patient.nom}</p>
            <p><strong>Âge:</strong> ${patient.age} ans</p>
          </div>
          <div>
            <p><strong>Date:</strong> ${date}</p>
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
    } else {
      // Le template inclut déjà un en-tête, donc on le laisse tel quel
      templateContent = templateContent;
    }
    
    return templateContent;
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
  }, [patient, date, templateId]);

  return (
    <div className="print:shadow-none">
      <div className="print:hidden">
        <MenuBar editor={editor} patient={patient} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}