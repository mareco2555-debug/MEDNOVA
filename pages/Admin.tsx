
import React, { useState } from 'react';
import { useAuth } from '../App';
import { MOCK_LOGS, MOCK_PROFILES, MOCK_SPECIALTIES, MOCK_CLINICAL_TEMPLATES } from '../services/mockData';
import { auditService } from '../services/auditService';
import { UserRole, Profile, Specialty, ClinicalTemplate, ClinicalField } from '../types';
import { 
  ShieldCheck, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  Stethoscope, 
  Save, 
  X, 
  Users,
  CalendarDays,
  FileText,
  Layout,
  ChevronRight,
  Type,
  List,
  Calendar,
  CheckSquare,
  Hash,
  Eye,
  Zap,
  GripVertical,
  Clock,
  UserPlus,
  Mail,
  ShieldAlert,
  MoreHorizontal,
  Key,
  Lock,
  UserCheck
} from 'lucide-react';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const isSecretary = user?.rol === UserRole.SECRETARIA;
  
  const [activeTab, setActiveTab] = useState<'users' | 'catalog' | 'templates' | 'audit'>(isSecretary ? 'users' : 'users');
  
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [specialties] = useState<Specialty[]>(MOCK_SPECIALTIES);
  const [templates, setTemplates] = useState<ClinicalTemplate[]>(MOCK_CLINICAL_TEMPLATES);

  // User Form States
  const [userNombre, setUserNombre] = useState('');
  const [userApellido, setUserApellido] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.PROFESIONAL);
  const [userMatricula, setUserMatricula] = useState('');
  const [userConsultorio, setUserConsultorio] = useState('');
  
  // Agenda States
  const [agendaDays, setAgendaDays] = useState<string[]>(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
  const [agendaFrom, setAgendaFrom] = useState('08:00');
  const [agendaTo, setAgendaTo] = useState('16:00');
  const [agendaSlot, setAgendaSlot] = useState(20);

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: Profile = {
      id: `p-${Date.now()}`,
      userId: `u-${Date.now()}`,
      nombre: userNombre,
      apellido: userApellido,
      email: userEmail,
      rol: userRole,
      activo: true,
      matricula: userRole === UserRole.PROFESIONAL ? userMatricula : undefined,
      consultorio: userRole === UserRole.PROFESIONAL ? userConsultorio : undefined,
      agendaConfig: userRole === UserRole.PROFESIONAL ? {
        dias: agendaDays,
        desde: agendaFrom,
        hasta: agendaTo,
        slotDuration: agendaSlot
      } : undefined
    };

    setProfiles([newProfile, ...profiles]);
    auditService.log(user!.id, user!.nombre, 'STAFF_CREATE_WITH_CREDENTIALS', 'USER', newProfile.id, { 
      role: userRole, 
      createdBy: user?.rol,
      initialPasswordSet: !!userPassword
    });
    
    setShowUserForm(false);
    resetUserForm();
    alert(`USUARIO CREADO: El profesional ${newProfile.nombre} ${newProfile.apellido} ya puede ingresar con su email y la clave proporcionada. Su agenda ha sido abierta.`);
  };

  const resetUserForm = () => {
    setUserNombre('');
    setUserApellido('');
    setUserEmail('');
    setUserPassword('');
    setUserRole(UserRole.PROFESIONAL);
    setUserMatricula('');
    setUserConsultorio('');
    setAgendaDays(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
    setAgendaFrom('08:00');
    setAgendaTo('16:00');
    setAgendaSlot(20);
  };

  const toggleDay = (day: string) => {
    setAgendaDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-slate-900 text-white rounded-[2rem] shadow-xl">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Nexus <span className="text-[#3fb0ac]">Staff</span></h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Gestión de Usuarios, Roles y Agendas Habilitadas</p>
          </div>
        </div>
        
        {!showUserForm && !showTemplateForm && (
          <div className="flex space-x-3">
             {activeTab === 'users' && (
                <button onClick={() => setShowUserForm(true)} className="bg-black hover:bg-[#3fb0ac] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center transition-all shadow-xl active:scale-95 group">
                  <UserPlus size={18} className="mr-3" /> Generar Staff & Agenda
                </button>
             )}
             {!isSecretary && activeTab === 'templates' && (
                <button onClick={() => setShowTemplateForm(true)} className="bg-black hover:bg-[#3fb0ac] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center transition-all shadow-xl active:scale-95 group">
                  <Layout size={18} className="mr-3" /> Constructor de HCE
                </button>
             )}
          </div>
        )}
      </header>

      <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[700px]">
        <div className="flex border-b border-slate-100 bg-slate-50/30 px-6">
          <button onClick={() => setActiveTab('users')} className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 transition-all ${activeTab === 'users' ? 'border-[#3fb0ac] text-slate-900 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Directorio & Agendas</button>
          {!isSecretary && (
            <>
              <button onClick={() => setActiveTab('templates')} className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 transition-all ${activeTab === 'templates' ? 'border-[#3fb0ac] text-slate-900 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Modelos HCE</button>
              <button onClick={() => setActiveTab('audit')} className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 transition-all ${activeTab === 'audit' ? 'border-[#3fb0ac] text-slate-900 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Auditoría Nexus</button>
            </>
          )}
        </div>

        <div className="p-10">
          {activeTab === 'users' && (
            showUserForm ? (
              <div className="animate-in slide-in-from-bottom-6 duration-500 max-w-4xl mx-auto">
                 <form onSubmit={handleSaveUser} className="space-y-12">
                    <div className="flex items-center justify-between border-b pb-8">
                       <div className="flex items-center space-x-6">
                          <div className="p-5 bg-teal-50 text-[#3fb0ac] rounded-[1.5rem]"><UserCheck size={32} /></div>
                          <div>
                             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Alta de Personal</h3>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Defina el perfil profesional y sus claves de acceso</p>
                          </div>
                       </div>
                       <button type="button" onClick={() => setShowUserForm(false)} className="p-3 text-slate-300 hover:text-red-500 transition-colors bg-slate-50 rounded-2xl"><X size={28} /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                          <input required value={userNombre} onChange={e => setUserNombre(e.target.value)} className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-[#3fb0ac] transition-all" placeholder="Roberto" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellido</label>
                          <input required value={userApellido} onChange={e => setUserApellido(e.target.value)} className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-[#3fb0ac] transition-all" placeholder="Lores" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Usuario de Acceso)</label>
                          <div className="relative">
                            <Mail className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="email" required value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-[#3fb0ac] transition-all" placeholder="ejemplo@mednova.com" />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña Inicial</label>
                          <div className="relative">
                            <Lock className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="text" required value={userPassword} onChange={e => setUserPassword(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-[#3fb0ac] transition-all" placeholder="Defina clave temporal" />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rol en la Plataforma</label>
                          <select required value={userRole} onChange={e => setUserRole(e.target.value as UserRole)} className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-[#3fb0ac] transition-all appearance-none cursor-pointer">
                             {Object.values(UserRole).filter(r => isSecretary ? [UserRole.PROFESIONAL, UserRole.SECRETARIA].includes(r) : true).map(role => <option key={role} value={role}>{role}</option>)}
                          </select>
                       </div>
                    </div>

                    {userRole === UserRole.PROFESIONAL && (
                      <div className="bg-[#f8fafc] p-12 rounded-[3.5rem] border border-slate-100 space-y-10 animate-in fade-in duration-700 shadow-inner">
                         <div className="flex items-center space-x-4 text-[#3fb0ac]">
                            <div className="p-3 bg-white rounded-xl shadow-sm"><CalendarDays size={20} /></div>
                            <h4 className="text-xs font-black uppercase tracking-widest">Apertura de Agenda Prestacional</h4>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matrícula (MN/MP)</label>
                               <input value={userMatricula} onChange={e => setUserMatricula(e.target.value)} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold outline-none focus:border-[#3fb0ac]" placeholder="Ej: MP 15234" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nro. de Consultorio</label>
                               <input value={userConsultorio} onChange={e => setUserConsultorio(e.target.value)} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold outline-none focus:border-[#3fb0ac]" placeholder="Ej: 204" />
                            </div>
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Días de Consultorio</label>
                            <div className="flex flex-wrap gap-3">
                               {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => (
                                 <button key={day} type="button" onClick={() => toggleDay(day)} className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${agendaDays.includes(day) ? 'bg-[#3fb0ac] border-[#3fb0ac] text-white shadow-xl scale-105' : 'bg-white border-slate-200 text-slate-400 hover:border-[#3fb0ac]'}`}>{day}</button>
                               ))}
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hora Apertura</label>
                               <input type="time" value={agendaFrom} onChange={e => setAgendaFrom(e.target.value)} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hora Cierre</label>
                               <input type="time" value={agendaTo} onChange={e => setAgendaTo(e.target.value)} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duración (Mins)</label>
                               <select value={agendaSlot} onChange={e => setAgendaSlot(Number(e.target.value))} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none">
                                  <option value={15}>15 Min</option>
                                  <option value={20}>20 Min</option>
                                  <option value={30}>30 Min</option>
                                  <option value={45}>45 Min</option>
                                  <option value={60}>1 Hora</option>
                               </select>
                            </div>
                         </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-6 pt-12 border-t border-slate-50">
                       <button type="button" onClick={() => setShowUserForm(false)} className="px-10 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Descartar Cambios</button>
                       <button type="submit" className="bg-black hover:bg-[#3fb0ac] text-white px-16 py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center">
                          <Save size={20} className="mr-4" /> Finalizar Alta y Habilitar Acceso
                       </button>
                    </div>
                 </form>
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in duration-500">
                 <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center">
                       <Users size={20} className="mr-4 text-[#3fb0ac]" /> Directorio de Staff & Estados
                    </h3>
                    <div className="flex items-center space-x-3 bg-slate-50 px-6 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                       <ShieldCheck size={16} className="text-emerald-500" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo de Datos Activo</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {profiles.map(p => (
                       <div key={p.id} className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:border-[#3fb0ac]/30 transition-all group relative overflow-hidden">
                          <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[5rem] transition-all group-hover:scale-125 opacity-5 flex items-center justify-center ${p.rol === UserRole.ADMIN ? 'bg-amber-500' : 'bg-[#3fb0ac]'}`}>
                             {p.rol === UserRole.PROFESIONAL ? <Stethoscope size={48} /> : <Users size={48} />}
                          </div>
                          
                          <div className="relative z-10 flex flex-col h-full">
                             <div className="flex items-center justify-between mb-8">
                                <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${p.rol === UserRole.ADMIN ? 'bg-amber-50 text-amber-600 border-amber-100' : p.rol === UserRole.SECRETARIA ? 'bg-sky-50 text-sky-600 border-sky-100' : 'bg-slate-900 text-white border-slate-900'}`}>
                                   {p.rol}
                                </span>
                                <div className="flex items-center text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                   <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                                   Online
                                </div>
                             </div>

                             <h4 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter leading-none">{p.nombre} {p.apellido}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">{p.email}</p>
                             
                             {p.rol === UserRole.PROFESIONAL && p.agendaConfig && (
                                <div className="mt-auto bg-slate-50 p-6 rounded-[2rem] space-y-4 border border-slate-100 group-hover:bg-white transition-colors">
                                   <div className="flex items-center text-[11px] font-black text-slate-500 uppercase tracking-widest">
                                      <Clock size={16} className="mr-3 text-[#3fb0ac]" /> {p.agendaConfig.desde} - {p.agendaConfig.hasta}
                                   </div>
                                   <div className="flex items-center text-[11px] font-black text-slate-500 uppercase tracking-widest">
                                      <Calendar size={16} className="mr-3 text-[#3fb0ac]" /> {p.agendaConfig.dias.join(', ')}
                                   </div>
                                </div>
                             )}

                             <div className="mt-10 flex items-center justify-between gap-3">
                                <button className="flex-1 flex items-center justify-center space-x-3 bg-slate-900 text-white py-4 rounded-2xl transition-all hover:bg-[#3fb0ac] text-[10px] font-black uppercase tracking-widest shadow-xl">
                                   <Key size={14} /> <span>Credenciales</span>
                                </button>
                                <button className="p-4 bg-slate-50 text-slate-400 hover:text-[#3fb0ac] rounded-2xl transition-all border border-slate-100"><Edit2 size={18}/></button>
                                <button className="p-4 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100"><Trash2 size={18}/></button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
