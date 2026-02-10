
export enum UserRole {
  SUPERADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  PROFESIONAL = 'Profesional',
  SECRETARIA = 'Secretaria',
  INVESTIGADOR = 'Investigador',
  AUDITOR = 'Auditor'
}

export interface Specialty {
  id: string;
  name: string;
  isMedical: boolean;
}

export interface Diagnosis {
  id: string;
  code: string;
  label: string;
  category: string;
}

export interface ClinicalField {
  id: string;
  label: string;
  type: string;
}

export interface ClinicalTemplate {
  id: string;
  name: string;
  specialty: string;
  active: boolean;
  createdAt: string;
  fields: ClinicalField[];
}

export interface Profile {
  id: string;
  userId: string;
  nombre: string;
  apellido: string;
  matricula?: string;
  tipoProfesional?: 'médico' | 'no-médico' | 'administrativo';
  especialidades?: string[]; 
  especsIds?: string[]; // Para filtrado dinámico en turnos
  consultorio?: string;
  cvSummary?: string; 
  rol: UserRole;
  activo: boolean;
  email: string;
  phone?: string;
  agendaConfig?: {
    dias: string[];
    desde: string;
    hasta: string;
    slotDuration: number;
  };
}

export interface Patient {
  id: string;
  nombres: string;
  apellidos: string;
  fechaNac: string;
  sexo: 'M' | 'F' | 'X';
  docTipo: 'DNI' | 'Pasaporte' | 'LC' | 'LE';
  docNro: string;
  direccion: string;
  telefono?: string;
  celular: string;
  whatsappNumber: string;
  email: string;
  obraSocialNombre: string;
  obraSocialPlan: string;
  obraSocialNumero: string;
  preferredChannel: 'whatsapp' | 'email' | 'ambos' | 'ninguno';
  whatsappOptIn: boolean;
  marketingOptIn: boolean;
  doNotContact: boolean;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientDisplayName: string;
  professionalId: string;
  startAt: string;
  endAt: string;
  motivo?: string; 
  status: 'solicitado' | 'confirmado' | 'cancelado' | 'ausente' | 'atendido' | 'presente' | 'pendiente_contacto' | 'pendiente_reprogramacion';
  channel: 'presencial' | 'telemedicina' | 'administrativo';
  surveySent: boolean;
  checkInAt?: string;
  consultationStartAt?: string; 
  consultationEndAt?: string; 
}

export interface AuditLog {
  id: string;
  actorUserId: string;
  actorName: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: any;
  createdAt: string;
}

export interface Encounter {
  id: string;
  appointmentId?: string;
  patientId: string;
  professionalId: string;
  fechaHora: string;
  motivo: string;
  notasAdicionales?: string;
  diagnosisId: string;
}

export type ReportStatus = 'draft' | 'validation' | 'published' | 'withdrawn';

export interface Report {
  id: string;
  patientId: string;
  patientName: string;
  uploadedByUserId: string;
  filePath: string;
  fileType: string;
  title: string;
  studyType: string;
  studyDate: string;
  site: string;
  reportingProfessional?: string;
  status: ReportStatus;
  publishedAt?: string;
  viewedByPatientAt?: string;
  createdAt: string;
  updatedAt: string;
}
