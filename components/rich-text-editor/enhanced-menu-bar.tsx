import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Calendar,
    FileSignature,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Italic,
    List,
    ListOrdered,
    MessageSquarePlus,
    Strikethrough,
    User,
  } from "lucide-react";
  import { Toggle } from "../ui/toggle";
  import { Editor } from "@tiptap/react";
  import { Patient } from "@/types/patient";
  import { Button } from "../ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../ui/dropdown-menu";
  import { format } from 'date-fns';
  import { fr } from 'date-fns/locale';
  
  interface MenuBarProps {
    editor: Editor | null;
    patient?: Patient;
  }
  
  export default function EnhancedMenuBar({ editor, patient }: MenuBarProps) {
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
        case "hydration":
          advice = `<p><strong>Je conseille ${patientFullName}</strong> de boire au moins 2 litres d'eau par jour pour maintenir une bonne hydratation et faciliter l'élimination des toxines.</p>`;
          break;
        case "sleep":
          advice = `<p><strong>Je conseille ${patientFullName}</strong> d'adopter un rythme de sommeil régulier avec 7-8 heures de repos nocturne et d'éviter les écrans 1 heure avant le coucher.</p>`;
          break;
        case "stress":
          advice = `<p><strong>Je conseille ${patientFullName}</strong> de pratiquer des techniques de relaxation comme la respiration profonde ou la méditation pour réduire le niveau de stress.</p>`;
          break;
        default:
          advice = `<p><strong>Je conseille ${patientFullName}</strong> de </p>`;
      }
  
      editor.commands.insertContent(advice);
      // Focus l'éditeur après insertion
      editor.commands.focus();
    };
  
    // Fonction pour insérer la date
    const insertDate = (format: string) => {
      const today = new Date();
      let dateString = "";
  
      switch (format) {
        case "full":
          dateString = today.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          break;
        case "short":
          dateString = today.toLocaleDateString('fr-FR');
          break;
        case "withTime":
          dateString = today.toLocaleDateString('fr-FR') + ' à ' + 
            today.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
          break;
      }
  
      editor.commands.insertContent(`<span>${dateString}</span>`);
      editor.commands.focus();
    };
  
    // Fonction pour insérer la signature du médecin
    const insertDoctorSignature = (doctorId: string) => {
      const doctors = {
        dr1: {
          name: "Dr. Martin Dupont",
          title: "Médecin généraliste",
          license: "N° 12345678",
          contact: "martin.dupont@example.com | Tel: 01 23 45 67 89"
        },
        dr2: {
          name: "Dr. Sophie Laurent",
          title: "Cardiologue",
          license: "N° 87654321",
          contact: "sophie.laurent@example.com | Tel: 01 98 76 54 32"
        },
        dr3: {
          name: "Dr. Thomas Moreau",
          title: "Pneumologue",
          license: "N° 23456789",
          contact: "thomas.moreau@example.com | Tel: 01 34 56 78 90"
        },
        dr4: {
          name: "Dr. Emma Petit",
          title: "Neurologue",
          license: "N° 34567890",
          contact: "emma.petit@example.com | Tel: 01 45 67 89 01"
        }
      };
  
      const doctor = doctors[doctorId as keyof typeof doctors];
      
      const signature = `
        <div style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px;">
          <p><strong>${doctor.name}</strong><br>
          ${doctor.title}<br>
          ${doctor.license}<br>
          ${doctor.contact}</p>
        </div>
      `;
  
      editor.commands.insertContent(signature);
      editor.commands.focus();
    };
  
    // Section pour insérer des structures de rapport pré-définies
    const insertReportSection = (sectionType: string) => {
      let section = "";
  
      switch (sectionType) {
        case "examination":
          section = `
            <h3>Examen clinique</h3>
            <ul>
              <li>Poids: </li>
              <li>Température: </li>
              <li>Tension artérielle: </li>
              <li>Fréquence cardiaque: </li>
              <li>Observations: </li>
            </ul>
          `;
          break;
        case "diagnosis":
          section = `
            <h3>Diagnostic</h3>
            <p>Au vu des symptômes présentés et des résultats d'examens, le diagnostic retenu est:</p>
            <p><strong></strong></p>
          `;
          break;
        case "treatment":
          section = `
            <h3>Traitement prescrit</h3>
            <ol>
              <li>Médicament: , Posologie: , Durée: </li>
              <li>Médicament: , Posologie: , Durée: </li>
            </ol>
          `;
          break;
        case "followup":
          section = `
            <h3>Suivi recommandé</h3>
            <p>Un rendez-vous de contrôle est à prévoir dans:</p>
            <p>Examens complémentaires à réaliser avant la prochaine consultation:</p>
          `;
          break;
      }
  
      editor.commands.insertContent(section);
      editor.commands.focus();
    };
  
    // Fonction pour insérer des informations sur le patient
    const insertPatientInfo = (infoType: string) => {
      if (!patient) return;
  
      let info = "";
      
      switch (infoType) {
        case "basic":
          info = `
            <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 10px;">
              <p><strong>Patient:</strong> ${patient.prenom} ${patient.nom}</p>
              <p><strong>Âge:</strong> ${patient.age} ans</p>
            </div>
          `;
          break;
        case "description":
          info = `
            <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 10px;">
              <h3>Description médicale</h3>
              <p>${patient.description || "Non spécifiée"}</p>
            </div>
          `;
          break;
        case "advice":
          info = `
            <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px; margin-bottom: 10px;">
              <h3>Conseils précédents</h3>
              <p>${patient.conseils || "Aucun conseil précédent"}</p>
            </div>
          `;
          break;
      }
  
      editor.commands.insertContent(info);
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
      <div className="border rounded-md p-1 mb-1 bg-slate-50 flex items-center flex-wrap gap-1">
        {/* Options de formatage de base */}
        <div className="flex flex-wrap gap-1">
          {Options.map((option, index) => (
            <Toggle
              key={index}
              pressed={option.pressed}
              onPressedChange={option.onClick}
            >
              {option.icon}
            </Toggle>
          ))}
        </div>
  
        <div className="border-l h-6 mx-1"></div>
  
        {/* Dropdown pour les conseils médicaux */}
        {patient && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-sm"
              >
                <MessageSquarePlus className="size-4" /> 
                Conseils
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => insertDynamicAdvice("rest")}>
                Repos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertDynamicAdvice("medication")}>
                Médication
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertDynamicAdvice("followup")}>
                Rendez-vous de suivi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertDynamicAdvice("diet")}>
                Régime alimentaire
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertDynamicAdvice("exercise")}>
                Exercice physique
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertDynamicAdvice("hydration")}>
                Hydratation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertDynamicAdvice("sleep")}>
                Sommeil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertDynamicAdvice("stress")}>
                Gestion du stress
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => insertDynamicAdvice("custom")}>
                Conseil personnalisé
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
  
       
      
        
      </div>
    );
  }