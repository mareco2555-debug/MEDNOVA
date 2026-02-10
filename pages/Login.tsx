
import React, { useState } from 'react';
import { useAuth } from '../App';
import { SLOGAN } from '../constants';
import { 
  ArrowRight, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  Zap, 
  ClipboardList, 
  UserCircle2, 
  ArrowUpRight,
  Stethoscope,
  Briefcase,
  Lock,
  User
} from 'lucide-react';

interface LoginProps {
  onPublicBooking: () => void;
  onPatientPortal: () => void;
}

const Login: React.FC<LoginProps> = ({ onPublicBooking, onPatientPortal }) => {
  const [email, setEmail] = useState('lucia.adm@mednova.com');
  const [password, setPassword] = useState('********');
  const [accessMode, setAccessMode] = useState<'profesional' | 'secretaria'>('profesional');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 lg:p-10 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#f8fafc] via-white to-[#f1f5f9] opacity-80"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#3fb0ac]/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-200/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-7xl flex flex-col items-center relative z-10">
        
        {/* LOGO HEADER - ALINEACIÓN HORIZONTAL PERFECTA */}
        <div className="mb-20 animate-in fade-in zoom-in duration-1000">
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-16">
            
            {/* MEDNOVA */}
            <div className="flex flex-col items-center lg:items-end">
              <div className="flex items-baseline leading-none">
                <span className="text-7xl lg:text-8xl font-black text-[#3fb0ac] tracking-tighter">Med</span>
                <span className="text-7xl lg:text-8xl font-black text-slate-800 tracking-tighter">Nova</span>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <div className="h-px w-6 bg-[#3fb0ac]/40"></div>
                <span className="text-[12px] font-black text-slate-300 uppercase tracking-[0.8em]">Centro Médico</span>
              </div>
            </div>

            {/* SEPARADOR */}
            <div className="hidden lg:block h-24 w-px bg-slate-200"></div>

            {/* KINESIO LP - NEGRO Y UNIFORME */}
            <div className="flex flex-col items-center lg:items-start pt-2">
              <span className="text-[12px] font-extralight text-slate-400 uppercase tracking-[1em] mb-4 leading-none">Rehabilitación Integral</span>
              <div className="flex items-center leading-none">
                <span className="text-6xl lg:text-7xl font-thin text-black uppercase tracking-[0.3em]">KINESIO LP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
          
          {/* PANEL IZQUIERDO: PORTAL PACIENTES */}
          <div className="bg-white p-10 lg:p-16 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3fb0ac]/10 rounded-bl-[5rem] -mr-10 -mt-10 transition-all group-hover:scale-110"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-12 h-12 bg-[#3fb0ac] rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <UserCircle2 size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Portal del Paciente</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Gestión Online 24/7</p>
                </div>
              </div>

              <h2 className="text-4xl font-extralight text-slate-400 leading-tight mb-12">
                Solicitá tu <span className="text-black font-bold tracking-tighter">Turno Online</span> de forma rápida y segura.
              </h2>

              <div className="space-y-4">
                <button 
                  onClick={onPublicBooking}
                  className="w-full bg-[#3fb0ac] hover:bg-black text-white p-8 rounded-[2.5rem] flex items-center justify-between transition-all shadow-2xl shadow-[#3fb0ac]/20 group/btn active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-6">
                    <div className="bg-white/20 p-4 rounded-2xl">
                      <Calendar size={32} />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-black uppercase tracking-widest">Reservar Turno</p>
                      <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1">Médico y Rehabilitación</p>
                    </div>
                  </div>
                  <ArrowUpRight size={32} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>

                <button 
                  onClick={onPatientPortal}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between transition-all border border-slate-100 group/btn2 active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-slate-400 group-hover/btn2:text-[#3fb0ac] transition-colors">
                      <ClipboardList size={32} />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-black uppercase tracking-widest text-slate-700">Mis Estudios</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Descarga de Informes Digitales</p>
                    </div>
                  </div>
                  <ArrowRight size={24} className="text-slate-300 group-hover/btn2:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center space-x-6 opacity-40">
               <div className="flex items-center space-x-2">
                  <ShieldCheck size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Datos Protegidos</span>
               </div>
               <div className="flex items-center space-x-2">
                  <Activity size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Sincronización Nexus</span>
               </div>
            </div>
          </div>

          {/* PANEL DERECHO: ACCESO STAFF DIFERENCIADO */}
          <div className="bg-[#1e293b] p-10 lg:p-16 rounded-[4rem] shadow-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-500">
            {/* Decoración Staff dinámicas */}
            <div className={`absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-tr-[10rem] -ml-20 -mb-20 pointer-events-none transition-all duration-700 ${accessMode === 'profesional' ? 'rotate-12 opacity-10' : 'rotate-0 opacity-5'}`}></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#3fb0ac] border border-white/10">
                       <Zap size={20} fill="currentColor" />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-white tracking-tighter leading-none uppercase italic">Nexus <span className="text-[#3fb0ac]">Platform</span></h2>
                    </div>
                 </div>
                 <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                    <button 
                      onClick={() => { setAccessMode('profesional'); setEmail('roberto.lores@mednova.com'); }}
                      className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${accessMode === 'profesional' ? 'bg-[#3fb0ac] text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                      Profesional
                    </button>
                    <button 
                      onClick={() => { setAccessMode('secretaria'); setEmail('lucia.adm@mednova.com'); }}
                      className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${accessMode === 'secretaria' ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-white'}`}
                    >
                      Secretaría
                    </button>
                 </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center space-x-4">
                   <div className={`p-4 rounded-2xl transition-all duration-500 ${accessMode === 'profesional' ? 'bg-[#3fb0ac]/20 text-[#3fb0ac]' : 'bg-white/10 text-white'}`}>
                      {accessMode === 'profesional' ? <Stethoscope size={32} /> : <Briefcase size={32} />}
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">
                        {accessMode === 'profesional' ? 'Acceso Staff Médico' : 'Gestión Administrativa'}
                      </h3>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">
                        {accessMode === 'profesional' ? 'Módulo HCE & Diagnóstico' : 'Módulo Agendas & Procesos'}
                      </p>
                   </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-6">
                    {accessMode === 'profesional' ? 'Matrícula / Usuario' : 'ID Operador / Email'}
                  </label>
                  <div className="relative">
                     <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
                     <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-16 pr-10 py-6 bg-white/5 border-2 border-white/5 rounded-[2.5rem] focus:bg-white focus:border-[#3fb0ac] focus:text-slate-900 outline-none transition-all font-bold text-white shadow-inner text-lg"
                      placeholder={accessMode === 'profesional' ? "Ej: MN 12345" : "Ej: adm_01"}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-6">Token de Seguridad</label>
                  <div className="relative">
                     <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
                     <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-16 pr-10 py-6 bg-white/5 border-2 border-white/5 rounded-[2.5rem] focus:bg-white focus:border-[#3fb0ac] focus:text-slate-900 outline-none transition-all font-bold text-white shadow-inner text-lg"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className={`w-full py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] shadow-xl transition-all flex items-center justify-center space-x-4 group active:scale-95 mt-10 ${
                    accessMode === 'profesional' 
                    ? 'bg-[#3fb0ac] text-white hover:bg-white hover:text-[#3fb0ac]' 
                    : 'bg-white text-slate-900 hover:bg-[#3fb0ac] hover:text-white'
                  }`}
                >
                  <span>Validar Credenciales</span>
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </form>
            </div>

            <div className="mt-12 text-center">
               <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.6em]">Nexus Bio-Security Protocol Active</span>
            </div>
          </div>

        </div>

        {/* Footer info sutil */}
        <div className="mt-16 flex flex-col items-center space-y-4 opacity-30">
           <div className="h-px w-20 bg-slate-300"></div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] text-center">
             {SLOGAN}
           </p>
        </div>
      </div>

      {/* FOOTER CORPORATIVO */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
         <div className="flex items-center space-x-10 bg-white/50 backdrop-blur-md px-10 py-3 rounded-full border border-slate-100 shadow-sm pointer-events-auto">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">© 2024 MedNova Nexus Group</span>
            <div className="w-1.5 h-1.5 bg-[#3fb0ac] rounded-full"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Terminal V1.0.4.R</span>
         </div>
      </div>
    </div>
  );
};

export default Login;
