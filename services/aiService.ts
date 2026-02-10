
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export type DocumentType = 'discapacidad' | 'justificacion_tratamiento' | 'certificado_atencion' | 'licencia_medica' | 'resumen_hce';

export const aiService = {
  async generateClinicalDocument(patientName: string, history: any[], type: DocumentType, additionalContext?: string) {
    try {
      let docTask = "";
      switch(type) {
        case 'discapacidad':
          docTask = "un borrador de Certificado de Discapacidad resaltando limitaciones funcionales y diagnósticos crónicos";
          break;
        case 'justificacion_tratamiento':
          docTask = "una Justificación de Inicio o Cambio de Tratamiento dirigida a una obra social, fundamentando con la evolución clínica y métricas";
          break;
        case 'certificado_atencion':
          docTask = "un Certificado Médico de Atención estándar (constancia de visita)";
          break;
        case 'licencia_medica':
          docTask = "una Licencia Médica indicando necesidad de reposo y diagnóstico, sugiriendo cantidad de días según la gravedad";
          break;
        default:
          docTask = "un resumen ejecutivo profesional de la historia clínica";
      }

      const prompt = `Eres un asistente médico experto de MEDNOVA Nexus (Argentina). 
      Tu tarea es redactar ${docTask} para el paciente ${patientName}.
      
      CONTEXTO CLÍNICO: ${JSON.stringify(history)}
      ${additionalContext ? `CONTEXTO ADICIONAL DEL MÉDICO: ${additionalContext}` : ''}
      
      REGLAS DE REDACCIÓN:
      1. Usa lenguaje médico formal y preciso.
      2. En Argentina se usa 'DNI' y 'Obra Social'.
      3. No inventes datos que no estén en el contexto. Si falta algo, deja el espacio [PARA COMPLETAR].
      4. El tono debe ser profesional y directo.
      5. Devuelve solo el texto del documento, sin introducciones tuyas.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text || "No se pudo generar el documento.";
    } catch (error) {
      console.error("AI Service Error:", error);
      return "Error: No se pudo contactar con el motor de IA Nexus.";
    }
  },

  async suggestICD10Codes(description: string) {
    try {
      const prompt = `Actúa como un codificador médico experto. El médico describe un cuadro clínico y tú debes sugerir los 5 códigos CIE-10 (ICD-10) más precisos.
      DESCRIPCIÓN DEL MÉDICO: "${description}"
      
      Responde estrictamente en formato JSON con la siguiente estructura:
      [{ "code": "CÓDIGO", "label": "DESCRIPCIÓN OFICIAL", "category": "CATEGORÍA" }]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING },
                label: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["code", "label", "category"]
            }
          }
        }
      });

      return JSON.parse(response.text || "[]");
    } catch (error) {
      console.error("ICD10 Suggestion Error:", error);
      return [];
    }
  },

  async analyzeClinicalCase(patientData: any, currentSymptoms: string) {
    try {
      const prompt = `Actúa como un panel de soporte a la decisión clínica para un médico especialista.
      PACIENTE: ${JSON.stringify(patientData)}
      MOTIVO DE CONSULTA/SÍNTOMAS: ${currentSymptoms}
      
      TAREA:
      1. Analiza posibles diagnósticos diferenciales (top 3).
      2. Sugiere alertas de seguridad (Red Flags).
      3. Recomienda estudios complementarios basados en medicina basada en la evidencia (MBE).
      4. NO des tratamiento definitivo, solo orientación diagnóstica y precauciones.
      
      Responde en formato Markdown limpio.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      return "Error en el análisis clínico de IA.";
    }
  },

  async checkPrescriptionSafety(medication: string, patientHistory: any) {
    try {
      const prompt = `Verifica la seguridad de la siguiente prescripción: "${medication}".
      HISTORIAL DEL PACIENTE: ${JSON.stringify(patientHistory)}
      
      Identifica:
      - Interacciones con medicamentos actuales.
      - Contraindicaciones con diagnósticos previos.
      - Alertas de dosis (si aplica).
      
      Sé breve y directo. Si todo parece seguro, indícalo.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      return "No se pudo realizar el chequeo de seguridad en este momento.";
    }
  }
};
