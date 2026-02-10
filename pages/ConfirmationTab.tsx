
import React, { useState } from 'react';
import { useAuth } from '../App';
import { MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_PROFILES } from '../services/mockData';
import { auditService } from '../services/auditService';
import { Phone, MessageSquare, Check, X, Clock, HelpCircle, AlertCircle } from 'lucide-react';
import { APPOINTMENT_STATUS_LABELS } from '../constants';

const ConfirmationTab: React.FC = () => {
  const { user } = useAuth();
  
  // Get appointments for tomorrow
  const tomorrowStr = new Date(Date.now() + 86400000).toDateString();
  const tomorrowApps = MOCK_APPOINTMENTS.filter(app => new Date(app.startAt).toDateString() === tomorrowStr);

  const handleConfirm = (appId: string) => {
    const app = MOCK_APPOINTMENTS.find(a => a.id === appId);
    const professional = MOCK_PROFILES.find(p => p.id === app?.professionalId);
    
    auditService.log(user!.id, user!.nombre, 'CONFIRM_APPOINTMENT_24H', 'APPOINTMENT', appId);
    
    // Simulate detailed reminder
    const reminderMsg = `Enviando Recordatorio de Preparación (WhatsApp):
    - Consultorio: ${professional?.consultorio || 'A confirmar'}
    - Doc. Requerida: DNI + Credencial
    - Estudios: Organizados por fecha
    - Claves Portales: Activo
    - Lista de Dudas: Sugerida`;
    
    console.log(reminderMsg);
    alert(`Turno Confirmado. Se ha enviado al paciente el recordatorio detallado con el Consultorio ${professional?.consultorio || 'N/A'} y la lista de materiales requeridos.`);
  };

  const handleStatusChange = (appId: string, status: string) => {
    auditService.log(user!.id, user!.nombre, `SET_STATUS_${status.toUpperCase()}`, 'APPOINTMENT', appId);
    alert(`Estado cambiado a: ${status}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Confirmación de Mañana</h2>
          <p className="text-slate-500">Gestión proactiva de asistencia para el {new Date(Date.now() + 86400000).toLocaleDateString('es-AR', { dateStyle: 'long' })}</p>
        </div>
        <div className="flex items-center space-x-2 bg-sky-50 px-4 py-2 rounded-xl border border-sky-100">
           <MessageSquare size={18} className="text-sky-600" />
           <span className="text-sm font-bold text-sky-800">{tomorrowApps.length} Turnos para Mañana</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {tomorrowApps.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">No hay turnos agendados para mañana.</p>
          </div>
        ) : (
          tomorrowApps.map((app) => {
            const patient = MOCK_PATIENTS.find(p => p.id === app.patientId);
            const professional = MOCK_PROFILES.find(p => p.id === app.professionalId);
            return (
              <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-sky-200 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                    <span className="text-xs font-black leading-none uppercase">{new Date(app.startAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{app.patientDisplayName}</h3>
                    <div className="flex flex-col space-y-1 mt-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-slate-500 flex items-center">
                          <Phone size={12} className="mr-1" /> {patient?.celular}
                        </span>
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded uppercase">
                          {professional?.apellido} • Cons. {professional?.consultorio || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => handleConfirm(app.id)}
                    className="flex-1 md:flex-none flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-md active:scale-95"
                  >
                    <Check size={18} className="mr-2" /> Confirmar
                  </button>
                  <button 
                    onClick={() => handleStatusChange(app.id, 'reprogramar')}
                    className="flex-1 md:flex-none flex items-center justify-center bg-sky-50 hover:bg-sky-100 text-sky-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-sky-100"
                  >
                    <Clock size={18} className="mr-2" /> Reprogramar
                  </button>
                  <button 
                    onClick={() => handleStatusChange(app.id, 'cancelado')}
                    className="flex-1 md:flex-none flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-red-100"
                  >
                    <X size={18} className="mr-2" /> Cancelar
                  </button>
                  <button 
                    onClick={() => handleStatusChange(app.id, 'pendiente_contacto')}
                    className="flex-1 md:flex-none flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 p-2.5 rounded-xl transition-colors border border-slate-200"
                    title="Pendiente de Contacto"
                  >
                    <HelpCircle size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex items-start space-x-4 shadow-sm">
        <div className="p-3 bg-white text-amber-500 rounded-2xl shadow-sm"><AlertCircle size={20} /></div>
        <div>
          <p className="text-sm text-amber-900 font-black uppercase tracking-tight mb-1">Log de Notificaciones Automáticas</p>
          <p className="text-xs text-amber-800 leading-relaxed">
            Al presionar <span className="font-bold">Confirmar</span>, se dispara el protocolo de preparación que incluye el número de consultorio del profesional y las instrucciones de documentación requerida. Este evento queda auditado en el historial del paciente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationTab;
