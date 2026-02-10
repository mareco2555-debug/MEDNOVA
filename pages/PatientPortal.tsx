
import React, { useState } from 'react';
import { useAuth } from '../App';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  ChevronRight, 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  Building,
  HelpCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { MOCK_PATIENTS } from '../services/mockData';
import { auditService } from '../services/auditService';

interface PatientPortalProps {
  onBack: () => void;
}

const PatientPortal: React.FC<PatientPortalProps> = ({ onBack }) => {
  const { patient, loginAsPatient, reports, updateReport } = useAuth();
  const [dni, setDni] = useState('');
  const [step, setStep] = useState<'login' | 'otp' | 'main'>('login');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const patientReports = reports.filter(r => r.patientId === patient?.id && r.status === 'published');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (dni.length > 6) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = () => {
    loginAsPatient(dni);
    setStep('main');
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    if (!report.viewedByPatientAt) {
      updateReport(report.id, { viewedByPatientAt: new Date().toISOString() });
      auditService.log('PATIENT_PORTAL', patient?.nombres || 'Paciente', 'VIEW_REPORT', 'REPORT', report.id);
    }
  };

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md">
           <div className="text-center mb-12">
              <div className="relative w-24 h-24 mb-6 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#3fb0ac" strokeWidth="8" />
                  <path d="M28 30 L52 50 L28 70 Z" fill="#3fb0ac" />
                  <path d="M72 30 L48 50 L72 70 Z" fill="#4a4a4a" />
                </svg>
              </div>
              <h1 className="text-3xl font-black text-[#4a4a4a] tracking-tight leading-none mb-2">Portal <span className="text-[#3fb0ac]">Pacientes</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acceso Seguro a Estudios Médicos</p>
           </div>

           <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-300 border border-slate-100 relative overflow-hidden">
              <form onSubmit={handleLogin} className="space-y-8">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Número de DNI</label>
                   <div className="relative group">
                     <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3fb0ac] transition-colors" size={20} />
                     <input 
                       type="text" 
                       required
                       value={dni}
                       onChange={(e) => setDni(e.target.value)}
                       className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:ring-0 focus:border-[#3fb0ac] outline-none transition-all font-bold text-slate-700"
                       placeholder="Sin puntos ni espacios"
                     />
                   </div>
                 </div>

                 <button 
                   type="submit" 
                   className="w-full bg-[#3fb0ac] hover:bg-[#359b97] text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center space-x-3 group active:scale-95"
                 >
                   <span>Ver Mis Estudios</span>
                   <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                 </button>
              </form>
              
              <button onClick={onBack} className="w-full mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Volver al Inicio</button>
           </div>
           
           <div className="mt-12 flex items-center justify-center space-x-2 opacity-40">
              <ShieldCheck size={14} className="text-[#3fb0ac]" />
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.25em]">Acceso Protegido por MedNova Nexus</p>
           </div>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center space-y-8">
           <div className="w-20 h-20 bg-teal-50 text-[#3fb0ac] rounded-full flex items-center justify-center mx-auto shadow-inner"><Lock size={32} /></div>
           <div>
              <h2 className="text-2xl font-black text-slate-900">Valide su Identidad</h2>
              <p className="text-sm text-slate-500 mt-2">Hemos enviado un código de 6 dígitos a su Celular / Email registrado.</p>
           </div>
           <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-10 h-14 bg-slate-50 border-2 border-slate-100 rounded-xl flex items-center justify-center text-xl font-black text-slate-400">0</div>)}
           </div>
           <button onClick={handleVerifyOtp} className="w-full bg-[#4a4a4a] hover:bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95">Verificar y Acceder</button>
           <button onClick={() => setStep('login')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reintentar con otro DNI</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 lg:p-12">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-between mb-12">
           <button onClick={onBack} className="flex items-center text-slate-500 font-black text-sm hover:text-[#3fb0ac] transition-colors">
              <ArrowLeft size={20} className="mr-2" /> Cerrar Sesión Segura
           </button>
           
           <div className="flex items-center text-right">
              <div className="mr-3 flex flex-col justify-center">
                <div className="flex items-baseline leading-none">
                  <span className="text-xl font-black text-[#3fb0ac]">Med</span>
                  <span className="text-xl font-black text-[#4a4a4a]">Nova</span>
                </div>
                <span className="text-[5.5px] font-bold text-[#4a4a4a] tracking-[0.05em] uppercase">Historia Clínica Nexus</span>
              </div>
              <div className="relative w-10 h-10 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#3fb0ac" strokeWidth="8" />
                  <path d="M28 30 L52 50 L28 70 Z" fill="#3fb0ac" />
                  <path d="M72 30 L48 50 L72 70 Z" fill="#4a4a4a" />
                </svg>
              </div>
           </div>
        </header>

        <div className="space-y-8">
           <div className="bg-[#4a4a4a] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-teal-300 uppercase tracking-[0.3em] mb-2">Bienvenido/a al Portal</p>
                 <h2 className="text-4xl font-black">{patient?.nombres} {patient?.apellidos}</h2>
                 <div className="flex items-center space-x-6 mt-6">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                       <ShieldCheck size={16} className="text-teal-400" />
                       <span>Sus datos están cifrados de extremo a extremo</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                       <Lock size={16} className="text-teal-400" />
                       <span>Acceso Auditado Nexus</span>
                    </div>
                 </div>
              </div>
           </div>

           <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center mb-6 uppercase tracking-tight px-4">
                 <FileText className="mr-3 text-[#3fb0ac]" size={24} />
                 Mis Estudios e Informes Disponibles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {patientReports.length === 0 ? (
                    <div className="col-span-full bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center space-y-4">
                       <HelpCircle size={48} className="mx-auto text-slate-200" />
                       <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No hay informes disponibles para visualización inmediata.</p>
                       <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Si realizó un estudio recientemente, aguarde a la notificación de disponibilidad vía WhatsApp.</p>
                    </div>
                 ) : (
                    patientReports.map(report => (
                       <div key={report.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#3fb0ac]/30 transition-all group flex flex-col justify-between">
                          <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                <span className="bg-teal-50 text-[#3fb0ac] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                   {report.studyType}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                                   <Clock size={12} className="mr-1.5" /> {new Date(report.studyDate).toLocaleDateString()}
                                </span>
                             </div>
                             <h4 className="text-lg font-black text-slate-900 group-hover:text-[#3fb0ac] transition-colors">{report.title}</h4>
                             <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
                                <Building size={12} />
                                <span>Realizado en: <span className="text-slate-900">{report.site}</span></span>
                             </div>
                          </div>
                          
                          <div className="mt-8 flex items-center space-x-2">
                             <button 
                                onClick={() => handleViewReport(report)}
                                className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-[#3fb0ac] transition-all shadow-lg active:scale-95"
                             >
                                <Eye size={16} className="mr-2" /> Visualizar
                             </button>
                             <button className="p-3.5 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl transition-all border border-slate-100">
                                <Download size={18} />
                             </button>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

           <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 flex items-start space-x-6 shadow-sm">
              <div className="p-4 bg-white text-amber-500 rounded-2xl shadow-sm"><AlertCircle size={24} /></div>
              <div>
                 <p className="text-sm text-amber-900 font-black uppercase tracking-tight mb-2">Aviso de Privacidad y Confidencialidad</p>
                 <p className="text-xs text-amber-800 leading-relaxed">
                    Usted está accediendo a información clínica confidencial protegida por la Ley 25.326 de Protección de Datos Personales. El acceso desde este portal queda registrado en el log de trazabilidad de MEDNOVA Nexus. No comparta sus credenciales de acceso con terceros.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Viewer Modal (Simulado) */}
      {selectedReport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#4a4a4a]/95 backdrop-blur-md">
           <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col">
              <div className="p-8 border-b flex items-center justify-between bg-slate-50">
                 <div>
                    <h3 className="text-xl font-black text-slate-900">{selectedReport.title}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Visor Seguro de Informes MedNova</p>
                 </div>
                 <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-[#3fb0ac] transition-all">
                       <Download size={14} />
                       <span>Descargar PDF</span>
                    </button>
                    <button onClick={() => setSelectedReport(null)} className="p-2 text-slate-400 hover:bg-white rounded-xl shadow-sm"><X size={24}/></button>
                 </div>
              </div>
              <div className="flex-1 bg-slate-100 p-8 overflow-y-auto">
                 {/* Simulación del PDF */}
                 <div className="w-full max-w-3xl mx-auto bg-white shadow-2xl min-h-[1000px] p-16 space-y-12 border border-slate-200">
                    <div className="flex justify-between items-start border-b-2 border-slate-100 pb-10">
                       <div className="flex items-center">
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <circle cx="50" cy="50" r="46" fill="none" stroke="#3fb0ac" strokeWidth="8" />
                              <path d="M28 30 L52 50 L28 70 Z" fill="#3fb0ac" />
                              <path d="M72 30 L48 50 L72 70 Z" fill="#4a4a4a" />
                            </svg>
                          </div>
                          <div className="ml-3">
                             <p className="text-xl font-black text-[#3fb0ac] leading-none">Med<span className="text-[#4a4a4a]">Nova</span></p>
                             <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Servicio de Diagnóstico Digital</p>
                          </div>
                       </div>
                       <div className="text-right space-y-1">
                          <p className="text-[10px] font-black uppercase text-slate-400">Nro. de Informe: <span className="text-slate-900">REP-{selectedReport.id.toUpperCase()}</span></p>
                          <p className="text-[10px] font-black uppercase text-slate-400">Fecha: <span className="text-slate-900">{new Date(selectedReport.studyDate).toLocaleDateString()}</span></p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 text-[11px] bg-slate-50 p-6 rounded-2xl">
                       <div className="space-y-2">
                          <p className="font-black uppercase text-slate-400 tracking-widest">Paciente</p>
                          <p className="font-bold text-slate-900">{patient?.apellidos}, {patient?.nombres}</p>
                          <p className="text-slate-500">DNI: {patient?.docNro}</p>
                       </div>
                       <div className="space-y-2 text-right">
                          <p className="font-black uppercase text-slate-400 tracking-widest">Estudio</p>
                          <p className="font-bold text-slate-900">{selectedReport.title}</p>
                          <p className="text-slate-500">Especialidad: {selectedReport.studyType}</p>
                       </div>
                    </div>

                    <div className="space-y-6 pt-10">
                       <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b pb-2">Informe Técnico de Diagnóstico</h5>
                       <p className="text-sm text-slate-800 leading-relaxed font-medium">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec feugiat urna. Nam in tellus nec felis pretium aliquam. 
                          Sed auctor, sem non porta iaculis, tellus purus placerat tellus, at facilisis urna lorem non leo. 
                          Aenean molestie nisi sed orci scelerisque, nec semper sem aliquet.
                       </p>
                       <p className="text-sm text-slate-800 leading-relaxed font-medium">
                          <strong>Conclusión:</strong> El presente estudio no muestra anomalías significativas en relación a los parámetros estándar de referencia para su grupo etario y condición clínica previa reportada. Se recomienda control periódico según criterio de su profesional médico tratante.
                       </p>
                    </div>

                    <div className="pt-20 flex flex-col items-center">
                       <div className="w-48 h-px bg-slate-300 mb-4"></div>
                       <p className="text-[10px] font-black text-slate-900 uppercase">{selectedReport.reportingProfessional || 'Staff Profesional MedNova'}</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Especialista en Diagnóstico Nexus</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PatientPortal;
