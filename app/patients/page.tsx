"use client";

import { useEffect, useState } from "react";
import { patients } from "@/data/patients";
import { Patient } from "@/types/patient";
import Link from "next/link";
import { User } from "lucide-react";

export default function PatientsListPage() {
//List of patients page
  const [patientsList, setPatientsList] = useState<Patient[]>([]);
  //Shows all patients in a simple list
  useEffect(() => {
    setPatientsList(patients);
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Liste des patients</h1>
      
      <div className="space-y-3">
        {patientsList.map((patient) => (
          <Link
            href={`/patients/${patient.id}`}
            key={patient.id}
            className="block p-4 border rounded-md hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 rounded-full p-2">
                <User className="size-5 text-slate-600" />
              </div>
              <div>
                <h2 className="font-medium">
                  {patient.prenom} {patient.nom}
                </h2>
                <p className="text-sm text-slate-500">
                  {patient.age} ans
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}