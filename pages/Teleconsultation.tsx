
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../App';
import { MOCK_APPOINTMENTS, MOCK_PATIENTS } from '../services/mockData';
import { voiceService } from '../services/voiceService';
import { auditService } from '../services/auditService';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  User, 
  Activity, 
  Clock, 
  Sparkles,
  FileText,
  Save,
  Maximize2,
  Layout
} from 'lucide-react';

const Teleconsultation: React.FC = () => {
  const { user } = useAuth();
  const [activeCall, setActiveCall] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(MOCK_APPOINTMENTS[0]);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  
  // Scribe Integration
  const [scribeStatus, setScribeStatus] = useState<'idle' | 'active'>('idle');
  const [transcription, setTranscription] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const scribeSessionRef = useRef<{ stop: () => void } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const teleAppointments = MOCK_APPOINTMENTS.filter(app => app.channel === 'telemedicina' || app.id === 'app1');

  useEffect(() => {
    if (activeCall && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => alert("Error al acceder a cámara/micrófono."));
    }
  }, [activeCall]);

  const startCall = async () => {
    setActiveCall(true);
    auditService.log(user!.id, user!.nombre, 'START_TELECONSULTATION', 'APPOINTMENT', selectedAppointment.id);
    
    // Auto-start Scribe
    try {
      const session = await voiceService.startScribeSession({
        onStatusChange: (status) => setScribeStatus(status === 'active' ? 'active' : 'idle'),
        onTranscription: (text, isFinal) => {
          if (isFinal) {
            if (currentLine) {
              setTranscription(prev => [...prev, currentLine]);
              setCurrentLine('');
            }
          } else {
            setCurrentLine(prev => prev + ' ' + text);
          }
        }
      });
      scribeSessionRef.current = session;
    } catch (err) {
      console.error("No se pudo iniciar el escriba durante la teleconsulta.");
    }
  };

  const endCall = () => {
    setActiveCall(false);
    if (scribeSessionRef.current) {
      scribeSessionRef.current.stop();
      scribeSessionRef.current = null;
    }
    setScribeStatus('idle');
    auditService.log(user!.id, user!.nombre, 'END_TELECONSULTATION', 'APPOINTMENT', selectedAppointment.id);
    alert("Consulta finalizada. Puede revisar la transcripción generada.");
  };

  if (!activeCall) {
    return (
      <div className="space-y-6">
        <header>
          <h2 className="text-2xl font-bold text-slate-900">Teleconsulta Nexus</h2>
          <p className="text-slate-500">Cabina virtual de atención médica remota</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
             <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Próximas Teleconsultas</h3>
                <div className="space-y-3">
                   {teleAppointments.map(app => (
                     <div key={app.id} className={`p-6 rounded-3xl border transition-all flex items-center justify-between ${selectedAppointment.id === app.id ? 'border-sky-500 bg-sky-50 shadow-md' : 'border-slate-100 hover:bg-slate-50'}`} onClick={() => setSelectedAppointment(app)}>
                        <div className="flex items-center space-x-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sky-600 shadow-sm border border-sky-100 font-bold">
                              {new Date(app.startAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                           </div>
                           <div>
                              <p className="font-bold text-slate-900">{app.patientDisplayName}</p>
                              <p className="text-xs text-slate-500">OS: {MOCK_PATIENTS.find(p => p.id === app.patientId)?.obraSocialNombre} • Sala Virtual Nexus</p>
                           </div>
                        </div>
                        <button onClick={startCall} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase shadow-lg shadow-slate-900/10 hover:bg-sky-600 transition-all">Iniciar Sala</button>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-sky-600 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="text-lg font-bold mb-2">Instrucciones de Sala</h3>
                   <ul className="text-xs text-sky-100 space-y-3 mt-4">
                      <li className="flex items-start space-x-2"><CheckCircle2 size={14} className="mt-0.5 text-sky-200" /> <span>Verifique su conexión a Internet estable.</span></li>
                      <li className="flex items-start space-x-2"><CheckCircle2 size={14} className="mt-0.5 text-sky-200" /> <span>Use auriculares para mejor calidad de audio.</span></li>
                      <li className="flex items-start space-x-2"><CheckCircle2 size={14} className="mt-0.5 text-sky-200" /> <span>La sesión se transcribe automáticamente por el Escriba Nexus.</span></li>
                   </ul>
                </div>
                <Layout className="absolute -right-8 -bottom-8 opacity-10" size={150} />
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col lg:flex-row p-4 lg:p-6 gap-6 overflow-hidden">
      {/* Video Principal */}
      <div className="flex-1 relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
         {/* Cabecera del Video */}
         <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
            <div className="bg-slate-900/60 backdrop-blur-md p-3 rounded-2xl flex items-center space-x-3 border border-white/10 pointer-events-auto">
               <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white"><User size={20} /></div>
               <div>
                  <p className="text-xs font-black text-white uppercase tracking-tight">{selectedAppointment.patientDisplayName}</p>
                  <p className="text-[10px] text-sky-300 font-bold uppercase tracking-widest">En Línea • OSDE 210</p>
               </div>
            </div>
            <div className="bg-red-500/80 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest animate-pulse border border-red-400/50 pointer-events-auto flex items-center">
               <Activity size={12} className="mr-2" /> Live Transcribing
            </div>
         </div>

         {/* Video Feed */}
         <div className="flex-1 relative flex items-center justify-center">
            {cameraEnabled ? (
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
               <div className="flex flex-col items-center justify-center text-slate-500">
                  <VideoOff size={64} className="mb-4 opacity-20" />
                  <p className="font-bold text-sm">Cámara Desactivada</p>
               </div>
            )}
            
            {/* Miniatura Profesional */}
            <div className="absolute bottom-6 right-6 w-48 h-32 bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl z-20">
               <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-500">
                  <User size={32} />
               </div>
               <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 rounded-md text-[8px] font-black text-white uppercase">Usted</div>
            </div>
         </div>

         {/* Controles de Llamada */}
         <div className="p-6 bg-slate-900/95 border-t border-slate-800 flex items-center justify-center space-x-4 z-20">
            <button onClick={() => setMicEnabled(!micEnabled)} className={`p-4 rounded-2xl transition-all ${micEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white'}`}>
               {micEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <button onClick={() => setCameraEnabled(!cameraEnabled)} className={`p-4 rounded-2xl transition-all ${cameraEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white'}`}>
               {cameraEnabled ? <Video size={24} /> : <VideoOff size={24} />}
            </button>
            <button onClick={endCall} className="bg-red-600 hover:bg-red-500 text-white p-4 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-95">
               <PhoneOff size={24} />
            </button>
            <div className="h-8 w-px bg-slate-800 mx-2"></div>
            <button className="p-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all">
               <Maximize2 size={24} />
            </button>
         </div>
      </div>

      {/* Panel de Escriba & Transcripción */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-3">
               <Sparkles size={20} className="text-sky-500" />
               <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Escriba Nexus Live</h3>
            </div>
            <button onClick={() => alert("Capturando nota...")} className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-all"><Save size={20}/></button>
         </div>

         <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {transcription.length === 0 && !currentLine && (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                 <MessageSquare size={48} className="mb-4" />
                 <p className="text-sm font-bold px-8">Escuchando conversación para transcripción médica...</p>
              </div>
            )}
            {transcription.map((line, i) => (
               <div key={i} className="animate-in fade-in slide-in-from-right-2 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{line}</p>
               </div>
            ))}
            {currentLine && (
              <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 italic">
                 <p className="text-sm text-sky-800 font-medium leading-relaxed">{currentLine}...</p>
              </div>
            )}
         </div>

         <div className="p-6 border-t border-slate-100 bg-white">
            <button onClick={() => alert("Generando nota clínica profesional...")} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-all">
               <FileText size={18} />
               <span>Generar Nota HCE</span>
            </button>
         </div>
      </div>
    </div>
  );
};

const CheckCircle2 = ({ size, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default Teleconsultation;
