
export const APP_NAME = "MEDNOVA & KINESIO LP";
export const SUBTITLE = "Centro Médico & Rehabilitación Integral";
export const SLOGAN = "Sinergia Médica y Rehabilitación Integral: Cuidado de Vanguardia";
export const TIMEZONE = "America/Argentina/Buenos_Aires";

export const COLORS = {
  primary: "#3fb0ac", // Teal MedNova
  secondary: "#c7a4ff", // Lila Kinesio LP principal
  lavenderLight: "#E9DDFF",
  lavenderMedium: "#D8C3FF",
  lavenderDeep: "#CBB2FF",
  dark: "#1e293b",
  accent: "#f8fafc",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  surface: "#ffffff",
  background: "#f8fafc",
};

export const REPORT_STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  validation: "Validación",
  published: "Publicado",
  withdrawn: "Retirado",
};

export const STUDY_TYPES = [
  'Kinesiología Motora',
  'Kinesiología Deportiva',
  'RPG / Posturología',
  'Laboratorio',
  'Cardiología',
  'Otros'
];

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  solicitado: "Solicitado",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
  ausente: "Ausente",
  atendido: "Atendido",
  presente: "En Espera",
  pendiente_contacto: "Pendiente Contacto",
  pendiente_reprogramacion: "Pendiente Reprog.",
};
