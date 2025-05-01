//The medical report editor
"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import MenuBar from "./rich-text-editor/menu-bar";
import { Patient } from "@/types/patient";
import { useEffect, useState } from "react";

interface PatientRapportEditorProps {
  patient: Patient;
  onChange: (content: string) => void;
}

export default function PatientRapportEditor({
  patient,
  onChange,
}: PatientRapportEditorProps) {
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    // Formatter la date actuelle
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setDate(now.toLocaleDateString('fr-FR', options));
  }, []);

  // Créer le contenu initial du rapport(template with patient info)
  const createInitialContent = () => {
    return `
      <h1 style="text-align: center;">RAPPORT MÉDICAL</h1>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <p><strong>Patient:</strong> ${patient.prenom} ${patient.nom}</p>
          <p><strong>Âge:</strong> ${patient.age} ans</p>
        </div>
        <div>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Référence:</strong> RM-${patient.id}-${new Date().getFullYear()}</p>
        </div>
      </div>
      
      <h2>Description médicale</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        ${patient.description}
      </div>
      
      <h2>Conseils et prescriptions</h2>
      <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 20px;">
        ${patient.conseils}
      </div>
      
      <div style="margin-top: 40px;">
        <p><strong>Médecin:</strong> Dr ti7rt</p>
        <p><strong>Signature:</strong> ti7rt ahmed </p>
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

  // Mettre à jour le contenu quand le patient change
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(createInitialContent());
    }
  }, [patient, date]);

  return (
    <div className="print:shadow-none">
      <div className="print:hidden">
        <MenuBar editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}