
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../App';
import { MOCK_PATIENTS, MOCK_PROFILES } from '../services/mockData';
import { auditService } from '../services/auditService';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Timer,
  User,
  ExternalLink,
  Calendar as CalendarIcon,
  Filter,
  Stethoscope,
  MapPin,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Coffee
} from 'lucide-react';
import { APPOINTMENT_STATUS_LABELS } from '../constants';
import { UserRole, Appointment, Profile } from '../types';

interface AppointmentsProps {
  onOpenHCE?: (appId: string) => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ onOpenHCE }) => {
  const { user, appointments, updateAppointment } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProfId, setSelectedProfId] = useState<string>(
    user?.rol === UserRole.PROFESIONAL ? user.id : 'all'
  );

  const isAdmin = user?.rol === UserRole.ADMIN || user?.rol === UserRole.SUPERADMIN || user?.rol === UserRole.SECRETARIA;

  // Generar días para el Calendar Strip (7 días desde hoy)
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = -2; i < 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  // Filtrar turnos por fecha y profesional
  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const appDate = new Date(app.startAt);
      const isSameDate = appDate.toDateString() === selectedDate.toDateString();
      const matchesProf = selectedProfId === 'all' || app.professionalId === selectedProfId;
      const matchesSearch = app.patientDisplayName.toLowerCase().includes(searchTerm.toLowerCase());
      return isSameDate && matchesProf && matchesSearch;
    }).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [appointments, selectedDate, selectedProfId, searchTerm]);

  const stats = useMemo(() => {
    const total = filteredAppointments.length;
    const attended = filteredAppointments.filter(a => a.status === 'atendido').length;
    const waiting = filteredAppointments.filter(a => a.status === 'presente').length;
    return { total, attended, waiting, pending: total - attended };
  }, [filteredAppointments]);

  const handleCheckIn = (appId: string) => {
    const now = new Date().toISOString();
    updateAppointment(appId, { 
      status: 'presente', 
      checkInAt: now 
    });
    auditService.log(user!.id, user!.nombre, 'PATIENT_CHECK_IN', 'APPOINTMENT', appId);
  };

  const calculateWaitTime = (app: Appointment) => {
    if (!app.checkInAt) return null;
    const start = new Date(app.checkInAt);
    const end = app.consultationStartAt ? new Date(app.consultationStartAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'presente': return 'bg-emerald-500 text-white border-emerald-600';
      case 'atendido': return 'bg-slate-400 text-white border-slate-500';
      case 'confirmado': return 'bg-sky-500 text-white border-sky-600';
      case 'cancelado': return 'bg-red-500 text-white border-red-600';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER & DATE SELECTOR */}
      <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <CalendarIcon className="text-[#3fb0ac]" size={24} />
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agenda Nexus</h2>
            </div>
            <p className="text-slate-500 font-medium ml-9">
              {selectedDate.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <div className="relative group">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  value={selectedProfId}
                  onChange={(e) => setSelectedProfId(e.target.value)}
                  className="pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-sky-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Todo el Centro</option>
                  {MOCK_PROFILES.filter(p => p.rol === UserRole.PROFESIONAL).map(p => (
                    <option key={p.id} value={p.id}>Dr. {p.apellido}</option>
                  ))}
                </select>
              </div>
            )}
            <button className="bg-slate-900 hover:bg-[#3fb0ac] text-white px-8 py-4 rounded-2xl text-sm font-black flex items-center transition-all shadow-xl active:scale-95">
              <Plus size={20} className="mr-2" /> Agendar Cita
            </button>
          </div>
        </div>

        {/* CALENDAR STRIP */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-4 no-scrollbar">
          {calendarDays.map((date, i) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 w-20 py-4 rounded-[1.5rem] border-2 transition-all flex flex-col items-center group ${
                  isSelected 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-sky-200'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? 'text-sky-300' : 'text-slate-400'}`}>
                  {date.toLocaleDateString('es-AR', { weekday: 'short' })}
                </span>
                <span className="text-xl font-black">{date.getDate()}</span>
                {isToday && !isSelected && <div className="mt-1 w-1.5 h-1.5 bg-[#3fb0ac] rounded-full"></div>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* MAIN TIMELINE */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex items-center px-8">
            <Search className="text-slate-400 mr-4" size={20} />
            <input 
              type="text" 
              placeholder="Buscar paciente en la agenda de hoy..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 outline-none text-sm font-medium"
            />
          </div>

          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="bg-white p-24 text-center rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <CalendarIcon size={40} className="text-slate-200" />
                 </div>
                 <h4 className="text-slate-900 font-black uppercase text-sm tracking-widest">Sin actividad registrada</h4>
                 <p className="text-slate-400 text-xs mt-2">No hay turnos para los filtros seleccionados en esta fecha.</p>
              </div>
            ) : (
              filteredAppointments.map((app, index) => {
                const isPresent = app.status === 'presente';
                const isAttended = app.status === 'atendido';
                const waitTime = calculateWaitTime(app);
                const prof = MOCK_PROFILES.find(p => p.id === app.professionalId);

                return (
                  <div key={app.id} className="relative pl-12">
                    {/* Time Dot/Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                    <div className={`absolute left-2.5 top-10 w-3.5 h-3.5 rounded-full border-4 border-white shadow-sm z-10 ${isPresent ? 'bg-emerald-500 scale-125' : 'bg-slate-300'}`}></div>

                    <div 
                      className={`bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden group hover:shadow-xl ${
                        isPresent ? 'border-emerald-200 bg-emerald-50/10 ring-2 ring-emerald-500/5' : 
                        isAttended ? 'border-slate-50 opacity-60' : 
                        'border-slate-100'
                      }`}
                    >
                      <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-start space-x-6">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-black text-slate-900">
                              {new Date(app.startAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Slot {index + 1}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-black text-slate-900 group-hover:text-[#3fb0ac] transition-colors">{app.patientDisplayName}</h3>
                              <button 
                                onClick={() => !isAttended && onOpenHCE?.(app.id)}
                                className="p-1.5 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all"
                              >
                                <ExternalLink size={16} />
                              </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center bg-slate-50 px-2 py-0.5 rounded-md">
                                <User size={10} className="mr-1.5" /> DNI {MOCK_PATIENTS.find(p => p.id === app.patientId)?.docNro || 'S/D'}
                              </span>
                              <span className="text-[10px] font-black text-[#3fb0ac] uppercase tracking-widest border border-[#3fb0ac]/20 px-2 py-0.5 rounded-md">
                                {MOCK_PATIENTS.find(p => p.id === app.patientId)?.obraSocialNombre}
                              </span>
                            </div>
                            {app.motivo && (
                               <p className="text-xs text-slate-500 font-medium italic mt-2 border-l-2 border-slate-100 pl-3">"{app.motivo}"</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          {isPresent && waitTime !== null && (
                            <div className={`flex flex-col items-end ${waitTime > 15 ? 'text-red-500' : 'text-emerald-600'}`}>
                               <p className="text-xs font-black uppercase tracking-tighter">Espera</p>
                               <div className="flex items-center font-black text-lg">
                                  <Timer size={16} className="mr-1" /> {waitTime}m
                               </div>
                            </div>
                          )}

                          <div className="flex flex-col items-end gap-2">
                             <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusColor(app.status)}`}>
                               {APPOINTMENT_STATUS_LABELS[app.status] || app.status}
                             </div>
                             
                             <div className="flex items-center space-x-2">
                                {!isAttended && !isPresent && (
                                  <button 
                                    onClick={() => handleCheckIn(app.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg transition-all active:scale-95 flex items-center"
                                  >
                                    <CheckCircle2 size={14} className="mr-2" /> Anunciar
                                  </button>
                                )}
                                <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all shadow-sm">
                                  <MoreVertical size={18} />
                                </button>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SIDEBAR STATS */}
        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 mb-8">Estado de la Jornada</h4>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-3xl font-black">{stats.attended}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atendidos</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl text-emerald-400"><UserCheck size={24} /></div>
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-3xl font-black">{stats.pending}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pendientes</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl text-amber-400"><Clock size={24} /></div>
                 </div>
                 <div className="pt-6 border-t border-white/5">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-2">
                       <span>Progreso Diario</span>
                       <span>{stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div 
                        className="h-full bg-sky-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${stats.total > 0 ? (stats.attended / stats.total) * 100 : 0}%` }}
                       ></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                 <TrendingUp size={14} className="mr-2 text-[#3fb0ac]" /> Indicadores Nexus
              </h4>
              <div className="grid grid-cols-1 gap-4">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-xl font-black text-slate-900">14 min</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Espera Promedio</p>
                 </div>
                 <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                    <p className="text-xl font-black text-emerald-700">98%</p>
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">Efectividad Agenda</p>
                 </div>
              </div>
           </div>

           <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white text-amber-500 rounded-full shadow-sm"><Coffee size={24} /></div>
              <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-relaxed">
                 Nexus ha detectado un hueco de 40 min a las 11:00 hs. ¿Desea habilitar sobreturnos?
              </p>
              <button className="text-[10px] font-black uppercase text-white bg-amber-600 px-6 py-2.5 rounded-xl shadow-lg hover:bg-amber-700 transition-all">Ver Recomendación</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
