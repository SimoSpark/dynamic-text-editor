// Types for doctor data
export interface Doctor {
    id: string;
    name: string;
    title: string;
    license: string;
    contact: string;
    specialty?: string;
  }
  
  // Initial list of doctors
  const initialDoctors: Doctor[] = [
    {
      id: "dr1",
      name: "Dr. Martin Dupont",
      title: "Médecin généraliste",
      license: "N° 12345678",
      contact: "martin.dupont@example.com | Tel: 01 23 45 67 89",
      specialty: "Médecine générale"
    },
    {
      id: "dr2",
      name: "Dr. Sophie Laurent",
      title: "Cardiologue",
      license: "N° 87654321",
      contact: "sophie.laurent@example.com | Tel: 01 98 76 54 32",
      specialty: "Cardiologie"
    },
    {
      id: "dr3",
      name: "Dr. Thomas Moreau",
      title: "Pneumologue",
      license: "N° 23456789",
      contact: "thomas.moreau@example.com | Tel: 01 34 56 78 90",
      specialty: "Pneumologie"
    },
    {
      id: "dr4",
      name: "Dr. Emma Petit",
      title: "Neurologue",
      license: "N° 34567890",
      contact: "emma.petit@example.com | Tel: 01 45 67 89 01",
      specialty: "Neurologie"
    }
  ];
  
  // Check if localStorage is available (client-side only)
  const isLocalStorageAvailable = () => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage !== null;
    } catch (e) {
      return false;
    }
  };
  
  // Function to get all doctors
  export const getDoctors = (): Doctor[] => {
    if (!isLocalStorageAvailable()) return initialDoctors;
    
    const savedDoctors = localStorage.getItem("doctors");
    if (!savedDoctors) {
      // Initialize localStorage with default doctors
      localStorage.setItem("doctors", JSON.stringify(initialDoctors));
      return initialDoctors;
    }
    
    return JSON.parse(savedDoctors);
  };
  
  // Function to add a new doctor
  export const addDoctor = (doctor: Doctor): void => {
    if (!isLocalStorageAvailable()) return;
    
    const doctors = getDoctors();
    
    // Ensure unique ID
    const existingDoctor = doctors.find(d => d.id === doctor.id);
    if (existingDoctor) {
      doctor.id = `dr${Date.now()}`;
    }
    
    doctors.push(doctor);
    localStorage.setItem("doctors", JSON.stringify(doctors));
  };
  
  // Function to update a doctor
  export const updateDoctor = (doctor: Doctor): void => {
    if (!isLocalStorageAvailable()) return;
    
    const doctors = getDoctors();
    const index = doctors.findIndex(d => d.id === doctor.id);
    
    if (index !== -1) {
      doctors[index] = doctor;
      localStorage.setItem("doctors", JSON.stringify(doctors));
    }
  };
  
  // Function to remove a doctor
  export const removeDoctor = (doctorId: string): void => {
    if (!isLocalStorageAvailable()) return;
    
    const doctors = getDoctors();
    const filteredDoctors = doctors.filter(doctor => doctor.id !== doctorId);
    
    localStorage.setItem("doctors", JSON.stringify(filteredDoctors));
  };
  
  // Function to get a doctor by ID
  export const getDoctorById = (doctorId: string): Doctor | null => {
    const doctors = getDoctors();
    const doctor = doctors.find(doctor => doctor.id === doctorId);
    
    return doctor || null;
  };