
import React, { useState } from 'react';
import { 
  User, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Activity,
  Heart,
  Zap,
  Building2,
  Undo2,
  Stethoscope as StethIcon,
  Move,
  Footprints,
  Accessibility,
  MessageCircle,
  Clock
} from 'lucide-react';
import { MOCK_PROFILES, MOCK_SPECIALTIES, ExtendedSpecialty } from '../services/mockData';
import { auditService } from '../services/auditService';
import { Profile } from '../types';

// Ícono Vitruviano en Diamante para Kinesiología (Imagen solicitada)
const KinesioVitruvianIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Rombo / Diamante Exterior */}
    <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    
    {/* Círculo de Puntos Interior */}
    <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
    
    {/* Silueta Humana Vitruviana */}
    <g fill="currentColor">
      {/* Cabeza */}
      <circle cx="50" cy="28" r="4.5" />
      {/* Cuerpo y Tronco */}
      <path d="M47 34 C47 34, 50 33, 53 34 L52 58 C52 58, 50 59, 48 58 Z" />
      {/* Brazos Extendidos (Pose 1) */}
      <path d="M50 36 L25 32 L26 28 L50 33 Z" />
      <path d="M50 36 L75 32 L74 28 L50 33 Z" />
      {/* Brazos Extendidos (Pose 2 - Sombra opaca) */}
      <path d="M50 36 L20 45 L22 48 L50 38 Z" opacity="0.2" />
      <path d="M50 36 L80 45 L78 48 L50 38 Z" opacity="0.2" />
      {/* Piernas (Pose 1) */}
      <path d="M48 58 L42 82 L46 82 L50 58 Z" />
      <path d="M52 58 L58 82 L54 82 L50 58 Z" />
      {/* Piernas (Pose 2 - Sombra opaca) */}
      <path d="M48 58 L32 75 L35 78 L50 58 Z" opacity="0.2" />
      <path d="M52 58 L68 75 L65 78 L50 58 Z" opacity="0.2" />
    </g>
  </svg>
);

// Ícono personalizado avanzado para Rehabilitación (Kinesio LP) - Complementario
const KinesioRehabIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    className={className}
  >
    {/* Brazo Flexionado (Músculo) */}
    <path 
      d="M35 45 C25 45, 20 35, 30 25 C35 20, 45 15, 55 25 C60 30, 65 40, 55 55 L40 55" 
      stroke="currentColor" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    <path 
      d="M35 38 C32 38, 30 42, 35 45" 
      stroke="currentColor" 
      strokeWidth="2.5" 
    />

    {/* Rodilla (Perfil) */}
    <path 
      d="M70 25 L85 35 C90 40, 90 50, 85 55 L75 80" 
      stroke="currentColor" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    <path 
      d="M68 45 L80 50" 
      stroke="currentColor" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />

    {/* Articulación Ósea (Huesos) */}
    <g transform="translate(45, 65) scale(0.8)">
      <path 
        d="M5 25 L20 10 C25 5, 35 5, 40 10 C45 15, 45 25, 40 30 L35 35" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
      <path 
        d="M5 5 L20 20 C25 25, 35 25, 40 20 C45 15, 45 5, 40 0 L35 -5" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        transform="rotate(180, 22.5, 12.5) translate(0, -30)"
      />
      <path d="M10 5 L5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 20 L5 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M35 5 L40 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M35 20 L40 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

// Ícono detallado de Columna Vertebral (RPG)
const RPGSpineIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M50 10 C65 10 75 25 80 45 C85 65 82 80 75 90" strokeOpacity="0.3" />
    <path d="M50 10 C35 10 25 25 20 45 C15 65 18 80 25 90" strokeOpacity="0.3" />
    <g fill="currentColor" stroke="none">
      <rect x="44" y="20" width="12" height="5" rx="1.5" />
      <rect x="42" y="28" width="16" height="6" rx="2" />
      <rect x="42" y="37" width="16" height="6" rx="2" />
      <rect x="42" y="46" width="16" height="6" rx="2" />
      <rect x="42" y="55" width="16" height="6" rx="2" />
      <rect x="42" y="64" width="16" height="6" rx="2" />
      <rect x="42" y="73" width="16" height="6" rx="2" />
      <rect x="44" y="82" width="12" height="5" rx="1.5" />
    </g>
    <path d="M50 20 L50 87" strokeWidth="2" strokeDasharray="2 4" />
    <path d="M40 31 L35 28" strokeOpacity="0.5" />
    <path d="M60 31 L65 28" strokeOpacity="0.5" />
    <path d="M40 58 L35 55" strokeOpacity="0.5" />
    <path d="M60 58 L65 55" strokeOpacity="0.5" />
  </svg>
);

// Ícono de Pelvis (Suelo Pélvico)
const PelvisIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M50 35 C40 35 30 20 20 30 C10 45 10 70 30 85 C40 90 60 90 70 85 C90 70 90 45 80 30 C70 20 60 35 50 35 Z" />
    <path d="M35 55 A8 8 0 1 0 45 55 A8 8 0 1 0 35 55" fill="currentColor" fillOpacity="0.1" />
    <path d="M55 55 A8 8 0 1 0 65 55 A8 8 0 1 0 55 55" fill="currentColor" fillOpacity="0.1" />
    <path d="M50 35 L50 45" />
  </svg>
);

interface PublicBookingProps {
  onBack: () => void;
}

const PublicBooking: React.FC<PublicBookingProps> = ({ onBack }) => {
  const [step, setStep] = useState(0); 
  const [selectedBrand, setSelectedBrand] = useState<'MEDNOVA' | 'KINESIOLP' | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<ExtendedSpecialty | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Profile | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [formData, setFormData] = useState({ nombre: '', apellido: '', dni: '', telefono: '' });

  const dates = ['Lunes, 30 Oct', 'Martes, 31 Oct', 'Miércoles, 01 Nov', 'Jueves, 02 Nov'];
  const slots = ['08:00', '08:45', '09:30', '10:15', '11:00', '11:45'];

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    auditService.log('PUBLIC_USER', 'PACIENTE', 'BOOK_TURN_FINAL', 'APPOINTMENT', 'new', { 
      brand: selectedBrand,
      spec: selectedSpec?.name,
      doc: selectedDoc?.apellido
    });
    setStep(5);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => {
    if (step === 1) setSelectedBrand(null);
    setStep(prev => Math.max(0, prev - 1));
  };

  const filteredSpecs = MOCK_SPECIALTIES.filter(s => s.brand === selectedBrand);
  const filteredDocs = MOCK_PROFILES.filter(p => 
    p.rol === 'Profesional' && 
    (selectedSpec ? p.especsIds?.includes(selectedSpec.id) : true)
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center font-sans">
      <div className="w-full max-w-5xl px-4 py-8 lg:py-16 relative z-10">
        
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 animate-in fade-in duration-700 gap-6">
           <button 
            onClick={step === 0 ? onBack : prevStep} 
            className="flex items-center text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-[#3fb0ac] transition-all group"
           >
              <div className="p-3 bg-white rounded-2xl shadow-sm mr-4 group-hover:bg-[#3fb0ac] group-hover:text-white transition-all">
                <ChevronLeft size={20} />
              </div>
              {step === 0 ? 'Volver al Inicio' : 'Regresar'}
           </button>
           
           <div className="flex flex-col items-center">
              <div className="flex items-baseline leading-none space-x-1">
                 <span className="text-2xl font-black text-[#3fb0ac]">MED</span>
                 <span className="text-2xl font-black text-slate-900">NOVA</span>
                 <span className="text-slate-300 mx-2">|</span>
                 <span className="text-xl font-thin text-black uppercase tracking-widest">KINESIO LP</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Portal Único de Reservas</span>
           </div>

           <div className="hidden md:block w-24"></div>
        </header>

        {step > 0 && step < 5 && (
          <div className="flex items-center justify-center space-x-4 mb-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-16 bg-[#3fb0ac]' : 'w-8 bg-slate-200'}`}></div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.04)] border border-white overflow-hidden animate-in zoom-in-95 duration-500">
          
          {step === 0 && (
            <div className="p-12 lg:p-20 space-y-16">
               <div className="text-center space-y-4">
                 <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Bienvenido</h2>
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">¿En qué área desea solicitar su turno?</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <button 
                    onClick={() => { setSelectedBrand('MEDNOVA'); nextStep(); }} 
                    className="group relative p-12 bg-slate-50 border-2 border-transparent rounded-[4rem] hover:border-[#3fb0ac] hover:bg-white hover:shadow-2xl transition-all text-left overflow-hidden"
                  >
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#3fb0ac]/5 rounded-full group-hover:scale-150 transition-transform"></div>
                     <div className="relative z-10 flex flex-col h-full justify-between space-y-12">
                        <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center shadow-md text-[#3fb0ac] group-hover:bg-[#3fb0ac] group-hover:text-white transition-all">
                           <StethIcon size={40} />
                        </div>
                        <div>
                           <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Consulta Médica</h3>
                           <p className="text-2xl font-black text-[#3fb0ac] uppercase tracking-tighter">MEDNOVA</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Especialidades Médicas, Nutrición y Clínica</p>
                        </div>
                     </div>
                  </button>

                  <button 
                    onClick={() => { setSelectedBrand('KINESIOLP'); nextStep(); }} 
                    className="group relative p-12 bg-slate-50 border-2 border-transparent rounded-[4rem] hover:border-black hover:bg-white hover:shadow-2xl transition-all text-left overflow-hidden"
                  >
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-200/20 rounded-full group-hover:scale-150 transition-transform"></div>
                     <div className="relative z-10 flex flex-col h-full justify-between space-y-12">
                        <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center shadow-md text-slate-900 group-hover:bg-black group-hover:text-white transition-all">
                           <KinesioVitruvianIcon size={52} />
                        </div>
                        <div>
                           <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Rehabilitación</h3>
                           <p className="text-2xl font-thin text-black uppercase tracking-[0.2em]">KINESIO LP</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Kinesiología, RPG, Plantillas y Suelo Pélvico</p>
                        </div>
                     </div>
                  </button>
               </div>
            </div>
          )}

          {step === 1 && (
            <div className="p-12 lg:p-20 space-y-12">
               <div className="text-center space-y-4">
                 <div className="inline-flex p-4 bg-sky-50 text-[#3fb0ac] rounded-3xl mb-2">
                    {selectedBrand === 'MEDNOVA' ? <StethIcon size={32} /> : <KinesioVitruvianIcon size={32} className="text-slate-900" />}
                 </div>
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                   {selectedBrand === 'MEDNOVA' ? 'Seleccione Especialidad' : '¿Qué tipo de atención requiere?'}
                 </h2>
                 <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">Personalizando su experiencia en {selectedBrand}</p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredSpecs.map(spec => (
                    <button 
                      key={spec.id} 
                      onClick={() => { setSelectedSpec(spec); nextStep(); }} 
                      className="p-10 text-left bg-slate-50 border-2 border-transparent rounded-[3rem] hover:border-[#3fb0ac] hover:bg-white hover:shadow-xl transition-all flex items-center justify-between group"
                    >
                       <div className="flex items-center space-x-6">
                         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-[#3fb0ac]">
                           {spec.name.includes('Suelo Pélvico') ? <PelvisIcon size={32} className="text-slate-900" /> : 
                            spec.name.includes('RPG') ? <RPGSpineIcon size={38} className="text-slate-900" /> : 
                            spec.name.includes('Plantillas') ? <Footprints size={24} /> : 
                            spec.name.includes('Kinesiología General') ? <KinesioVitruvianIcon size={32} className="text-slate-900" /> :
                            selectedBrand === 'MEDNOVA' ? <StethIcon size={24} /> : <KinesioRehabIcon size={28} className="text-slate-900" />}
                         </div>
                         <span className="font-black text-xl text-slate-800 tracking-tight">{spec.name}</span>
                       </div>
                       <ChevronRight size={24} className="text-slate-200 group-hover:text-[#3fb0ac] transition-all" />
                    </button>
                  ))}
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-12 lg:p-20 space-y-12">
               <div className="text-center space-y-2">
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{selectedSpec?.name}</h2>
                 <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">Profesionales disponibles para su servicio</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredDocs.map(doc => (
                    <button 
                      key={doc.id} 
                      onClick={() => { setSelectedDoc(doc); nextStep(); }} 
                      className="p-10 bg-slate-50 border-2 border-transparent rounded-[3.5rem] hover:border-[#3fb0ac] hover:bg-white hover:shadow-2xl transition-all flex flex-col items-center text-center group"
                    >
                       <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm mb-8 border-4 border-white group-hover:border-[#3fb0ac] transition-all overflow-hidden relative">
                          <User size={64} />
                       </div>
                       <h4 className="font-black text-2xl text-slate-900 tracking-tight">{doc.nombre} {doc.apellido}</h4>
                       <p className="text-[10px] font-black text-[#3fb0ac] uppercase tracking-widest mt-4 bg-white px-6 py-2 rounded-full border border-teal-50 shadow-sm">
                          {doc.matricula ? `MATRÍCULA ${doc.matricula}` : 'PROFESIONAL STAFF'}
                       </p>
                    </button>
                  ))}
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-12 lg:p-20 space-y-12">
               <div className="text-center">
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Agenda Disponible</h2>
                 <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">{selectedDoc?.apellido} • {selectedSpec?.name}</p>
               </div>
               <div className="space-y-10">
                 <div className="flex items-center space-x-4 overflow-x-auto pb-6 no-scrollbar">
                    {dates.map(date => (
                      <button key={date} onClick={() => setSelectedDate(date)} className={`flex-shrink-0 px-10 py-6 rounded-[2.5rem] border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${selectedDate === date ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-[#3fb0ac]'}`}>
                        {date}
                      </button>
                    ))}
                 </div>
                 {selectedDate && (
                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-8">
                      {slots.map(slot => (
                        <button key={slot} onClick={() => { setSelectedSlot(slot); nextStep(); }} className="py-6 rounded-3xl text-sm font-black bg-slate-50 text-slate-600 hover:bg-[#3fb0ac] hover:text-white transition-all shadow-sm border border-transparent hover:scale-105">
                          {slot} hs
                        </button>
                      ))}
                   </div>
                 )}
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-12 lg:p-20 space-y-12">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-1 bg-slate-900 text-white p-10 rounded-[3rem] space-y-8 shadow-2xl">
                     <h3 className="text-xl font-black uppercase tracking-tight">Resumen de Turno</h3>
                     <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                           <div className="p-3 bg-white/10 rounded-xl">
                              {selectedBrand === 'MEDNOVA' ? <StethIcon size={20} className="text-[#3fb0ac]" /> : <KinesioVitruvianIcon size={20} className="text-[#3fb0ac]" />}
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entidad</p>
                              <p className="text-sm font-black">{selectedBrand === 'MEDNOVA' ? 'MedNova Clínica' : 'Kinesio LP'}</p>
                           </div>
                        </div>
                        <div className="flex items-center space-x-4">
                           <div className="p-3 bg-white/10 rounded-xl">
                              {selectedSpec?.name.includes('RPG') ? <RPGSpineIcon size={20} className="text-[#3fb0ac]" /> : 
                               selectedSpec?.name.includes('Suelo Pélvico') ? <PelvisIcon size={20} className="text-[#3fb0ac]" /> :
                               selectedSpec?.name.includes('Plantillas') ? <Footprints size={20} className="text-[#3fb0ac]" /> :
                               selectedSpec?.name.includes('Kinesiología General') ? <KinesioVitruvianIcon size={20} className="text-[#3fb0ac]" /> :
                               <StethIcon size={20} className="text-[#3fb0ac]" />}
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Especialidad</p>
                              <p className="text-sm font-black">{selectedSpec?.name}</p>
                           </div>
                        </div>
                        <div className="flex items-center space-x-4">
                           <div className="p-3 bg-white/10 rounded-xl"><User size={20} className="text-[#3fb0ac]" /></div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profesional</p>
                              <p className="text-sm font-black">{selectedDoc?.nombre} {selectedDoc?.apellido}</p>
                           </div>
                        </div>
                        <div className="flex items-center space-x-4">
                           <div className="p-3 bg-white/10 rounded-xl"><Calendar size={20} className="text-[#3fb0ac]" /></div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cita</p>
                              <p className="text-sm font-black">{selectedDate} - {selectedSlot} hs</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <form onSubmit={handleFinalize} className="lg:col-span-2 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                           <input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-[#3fb0ac] transition-all" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellido</label>
                           <input required value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-[#3fb0ac] transition-all" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DNI / Documento</label>
                           <input required value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-[#3fb0ac] transition-all" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono de Contacto</label>
                           <input required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-[#3fb0ac] transition-all" />
                        </div>
                     </div>
                     <button type="submit" className="w-full bg-[#3fb0ac] text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-[#3fb0ac]/30 hover:bg-black transition-all active:scale-[0.98]">Confirmar Reserva de Turno</button>
                  </form>
               </div>
            </div>
          )}

          {step === 5 && (
            <div className="p-16 lg:p-24 text-center space-y-12 animate-in zoom-in-95 duration-700">
               <div className="w-32 h-32 lg:w-40 lg:h-40 bg-emerald-50 text-emerald-500 rounded-full lg:rounded-[4rem] flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <CheckCircle2 size={80} />
               </div>
               
               <div className="space-y-6">
                  <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter">¡Turno Confirmado!</h2>
                  <p className="text-lg lg:text-xl text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
                    Hemos registrado su reserva en <strong className="text-slate-900">{selectedBrand === 'KINESIOLP' ? 'Kinesio LP' : 'MedNova Clínica'}</strong> para el día {selectedDate} a las {selectedSlot} hs.
                  </p>
               </div>

               {selectedBrand === 'KINESIOLP' && (
                 <div className="max-w-2xl mx-auto bg-[#c7a4ff]/5 border-2 border-[#c7a4ff]/20 p-8 lg:p-12 rounded-[3rem] text-left space-y-6 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <div className="flex items-center space-x-4">
                       <div className="p-3 bg-white text-[#c7a4ff] rounded-2xl shadow-sm border border-[#c7a4ff]/10">
                          <Clock size={24} />
                       </div>
                       <div>
                          <h4 className="text-[10px] font-black text-[#c7a4ff] uppercase tracking-[0.3em]">Protocolo de Frecuencia Semanal</h4>
                          <p className="text-lg font-black text-slate-900">Coordinación de Tratamiento</p>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <p className="text-slate-600 font-medium leading-relaxed">
                         Al ser una práctica de rehabilitación, nuestro equipo administrativo <span className="text-[#c7a4ff] font-bold">lo contactará a la brevedad para coordinar la frecuencia semanal</span> de sus encuentros de kinesiología.
                       </p>
                       <p className="text-sm font-bold text-slate-400 bg-white px-6 py-4 rounded-2xl border border-slate-100 flex items-center">
                         <MessageCircle size={18} className="mr-3 text-[#c7a4ff]" />
                         Recuerde que también existe la posibilidad de coordinarlo telefónicamente o de forma presencial durante su primera visita.
                       </p>
                    </div>
                 </div>
               )}

               <div className="pt-8 space-y-6">
                  <button onClick={onBack} className="bg-slate-900 text-white px-16 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-[#3fb0ac] transition-all active:scale-95">
                    Finalizar y Salir
                  </button>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em]">Nexus Protocol Security v1.0.4</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicBooking;
