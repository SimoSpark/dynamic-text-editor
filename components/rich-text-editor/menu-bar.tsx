import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  MessageSquarePlus,
  Strikethrough,
} from "lucide-react";
import { Toggle } from "../ui/toggle";
import { Editor } from "@tiptap/react";
import { Patient } from "@/types/patient";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface MenuBarProps {
  editor: Editor | null;
  patient?: Patient;
}

export default function MenuBar({ editor, patient }: MenuBarProps) {
  if (!editor) {
    return null;
  }

  // Fonction pour insérer un conseil dynamique
  const insertDynamicAdvice = (type: string) => {
    if (!patient) return;

    let advice = "";
    const patientFullName = `${patient.prenom} ${patient.nom}`;

    switch (type) {
      case "rest":
        advice = `<p><strong>Je conseille ${patientFullName}</strong> de se reposer complètement pendant 3 semaines et d'éviter toute activité physique intense.</p>`;
        break;
      case "medication":
        advice = `<p><strong>Je conseille ${patientFullName}</strong> de prendre les médicaments prescrits selon le calendrier établi et de signaler tout effet secondaire.</p>`;
        break;
      case "followup":
        advice = `<p><strong>Je conseille ${patientFullName}</strong> de programmer un rendez-vous de suivi dans 2 semaines pour évaluer l'évolution de son état.</p>`;
        break;
      case "diet":
        advice = `<p><strong>Je conseille ${patientFullName}</strong> de suivre un régime pauvre en sel et riche en fruits et légumes frais pendant toute la durée du traitement.</p>`;
        break;
      case "exercise":
        advice = `<p><strong>Je conseille ${patientFullName}</strong> de pratiquer des exercices doux comme la marche légère ou la natation, à raison de 20 minutes par jour maximum.</p>`;
        break;
      default:
        advice = `<p><strong>Je conseille ${patientFullName}</strong> de </p>`;
    }

    editor.commands.insertContent(advice);
   
    editor.commands.focus();
  };

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
  ];

  return (
    <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50 flex items-center">
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.pressed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}

      {/* Dropdown pour les conseils dynamiques */}
      {patient && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 flex items-center gap-1 text-sm"
            >
              <MessageSquarePlus className="size-4" /> 
              Insérer un conseil
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => insertDynamicAdvice("rest")}>
              Conseil de repos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertDynamicAdvice("medication")}>
              Conseil de médication
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertDynamicAdvice("followup")}>
              Conseil de suivi
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertDynamicAdvice("diet")}>
              Conseil de régime
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertDynamicAdvice("exercise")}>
              Conseil exercice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertDynamicAdvice("custom")}>
              Conseil personnalisé
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
