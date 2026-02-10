
import { UserRole, Profile, Patient, Appointment, Specialty, Diagnosis, AuditLog, ClinicalTemplate, Encounter, Report } from '../types';

export const MOCK_PROFILES: Profile[] = [
  { 
    id: 'p1', userId: 'u1', nombre: 'Roberto', apellido: 'Lores', rol: UserRole.PROFESIONAL, 
    tipoProfesional: 'médico', activo: true, email: 'roberto.lores@mednova.com',
    matricula: 'MN 12345', consultorio: '101', especsIds: ['traumato', 'k_gen'],
    agendaConfig: { dias: ['Lunes', 'Martes', 'Viernes'], desde: '08:00', hasta: '14:00', slotDuration: 20 }
  },
  { 
    id: 'p2', userId: 'u2', nombre: 'Lucía', apellido: 'Gómez', rol: UserRole.SECRETARIA, 
    activo: true, email: 'lucia.adm@mednova.com' 
  },
  { 
    id: 'p3', userId: 'u3', nombre: 'Admin', apellido: 'Sistemas', rol: UserRole.ADMIN, 
    activo: true, email: 'admin@mednova.com' 
  },
  {
    id: 'p4', userId: 'u4', nombre: 'Elena', apellido: 'Paz', rol: UserRole.PROFESIONAL,
    tipoProfesional: 'médico', activo: true, email: 'elena.paz@mednova.com',
    matricula: 'MN 54321', consultorio: '202', especsIds: ['k_sp', 'k_rpg'],
    agendaConfig: { dias: ['Miércoles', 'Jueves'], desde: '09:00', hasta: '17:00', slotDuration: 30 }
  },
  {
    id: 'p5', userId: 'u5', nombre: 'Marcos', apellido: 'Ruiz', rol: UserRole.PROFESIONAL,
    tipoProfesional: 'médico', activo: true, email: 'marcos.ruiz@mednova.com',
    matricula: 'MN 99887', consultorio: '105', especsIds: ['cardio', 'clinica'],
    agendaConfig: { dias: ['Lunes', 'Miércoles'], desde: '08:00', hasta: '12:00', slotDuration: 20 }
  },
  {
    id: 'p6', userId: 'u6', nombre: 'Sofia', apellido: 'Vial', rol: UserRole.PROFESIONAL,
    tipoProfesional: 'médico', activo: true, email: 'sofia.vial@mednova.com',
    matricula: 'MP 77665', consultorio: '301', especsIds: ['k_plantillas'],
    agendaConfig: { dias: ['Viernes'], desde: '14:00', hasta: '19:00', slotDuration: 45 }
  }
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat1', nombres: 'María Elena', apellidos: 'Gómez', fechaNac: '1985-05-12', sexo: 'F',
    docTipo: 'DNI', docNro: '31444555', direccion: 'Av. Corrientes 1234', celular: '1155556666', whatsappNumber: '1155556666',
    email: 'maria.gomez@gmail.com', obraSocialNombre: 'OSDE', obraSocialPlan: '210', obraSocialNumero: '123456789',
    preferredChannel: 'whatsapp', whatsappOptIn: true, marketingOptIn: true, doNotContact: false, createdAt: new Date().toISOString()
  }
];

// Extendemos Specialty para incluir el brand de origen
export interface ExtendedSpecialty extends Specialty {
  brand: 'MEDNOVA' | 'KINESIOLP';
}

export const MOCK_SPECIALTIES: ExtendedSpecialty[] = [
  // MedNova
  { id: 'clinica', name: 'Clínica Médica', isMedical: true, brand: 'MEDNOVA' },
  { id: 'cardio', name: 'Cardiología', isMedical: true, brand: 'MEDNOVA' },
  { id: 'traumato', name: 'Traumatología', isMedical: true, brand: 'MEDNOVA' },
  { id: 'nutri', name: 'Nutrición', isMedical: true, brand: 'MEDNOVA' },
  // Kinesio LP
  { id: 'k_gen', name: 'Kinesiología General', isMedical: false, brand: 'KINESIOLP' },
  { id: 'k_sp', name: 'Kinesiología de Suelo Pélvico', isMedical: false, brand: 'KINESIOLP' },
  { id: 'k_rpg', name: 'Rehabilitación Postural Global (RPG)', isMedical: false, brand: 'KINESIOLP' },
  { id: 'k_plantillas', name: 'Diseño de Plantillas Propioceptivas', isMedical: false, brand: 'KINESIOLP' }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'app1', patientId: 'pat1', patientDisplayName: 'María Elena Gómez',
    professionalId: 'p1', startAt: new Date().toISOString(), endAt: new Date().toISOString(),
    motivo: 'Evaluación Suelo Pélvico', status: 'presente', channel: 'presencial', surveySent: false
  }
];

export const MOCK_DIAGNOSES: Diagnosis[] = [
  { id: 'd1', code: 'M54.5', label: 'Lumbalgia', category: 'Osteomuscular' },
  { id: 'd2', code: 'N39.3', label: 'Incontinencia de esfuerzo', category: 'Urinario' }
];

export const MOCK_CLINICAL_TEMPLATES: ClinicalTemplate[] = [
  {
    id: 'temp_sp',
    name: 'Ficha de Suelo Pélvico',
    specialty: 'Kinesiología de Suelo Pélvico',
    active: true,
    createdAt: new Date().toISOString(),
    fields: [
      { id: 'f1', label: 'Antecedentes Obstétricos', type: 'text' },
      { id: 'f2', label: 'Fuerza Muscular (0-5)', type: 'number' },
      { id: 'f3', label: 'Presencia de Prolapso', type: 'checkbox' }
    ]
  }
];

export const MOCK_ENCOUNTERS: Encounter[] = [];
export const MOCK_REPORTS: Report[] = [];
export const MOCK_LOGS: AuditLog[] = [];
