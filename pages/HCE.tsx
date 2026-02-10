
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../App';
import { UserRole, Encounter, Diagnosis, ClinicalTemplate } from '../types';
import { MOCK_PATIENTS, MOCK_ENCOUNTERS, MOCK_DIAGNOSES, MOCK_CLINICAL_TEMPLATES } from '../services/mockData';
import { aiService } from '../services/aiService';
import { auditService } from '../services/auditService';
import { 
  ShieldAlert, 
  Plus, 
  Stethoscope, 
  X, 
  Save, 
  AlertCircle,
  Sparkles,
  ChevronDown,
  Check,
  SearchCode,
  Zap,
  Clock,
  ArrowLeft,
  StickyNote,
  MessageSquareHeart,
  Layout,
  FileText
} from 'lucide-react';

interface HCEProps {
  appointmentId?: string | null;
  onClose?: () => void;
}

const HCE: React.FC<HCEProps> = ({ appointmentId, onClose }) => {
  const { user, appointments, updateAppointment } = useAuth();
  
  const currentApp = appointments.find(a => a.id === appointmentId);
  const patientFromApp = MOCK_PATIENTS.find(p => p.id === currentApp?.patientId);
  
  const [selectedPatient, setSelectedPatient] = useState(patientFromApp || MOCK_PATIENTS[0]);
  const [showNewEncounter, setShowNewEncounter] = useState(!!appointmentId);
  const [encounterNotes, setEncounterNotes] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Plantillas Dinámicas
  const [selectedTemplate, setSelectedTemplate] = useState<ClinicalTemplate | null>(null);
  const [dynamicFormValues, setDynamicFormValues] = useState<Record<string, string>>({});

  // Diagnosis State
  const [diagnosisSearch, setDiagnosisSearch] = useState('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [diagnosisResults, setDiagnosisResults] = useState<Diagnosis[]>([]);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableTemplates = MOCK_CLINICAL_TEMPLATES.filter(t => t.active);

  useEffect(() => {
    if (appointmentId && currentApp && !currentApp.consultationStartAt) {
      const now = new Date().toISOString();
      updateAppointment(appointmentId, { consultationStartAt: now });
      auditService.log(user!.id, user!.nombre, 'START_CONSULTATION', 'APPOINTMENT', appointmentId);
    }
  }, [appointmentId, currentApp]);

  useEffect(() => {
    if (diagnosisSearch.length > 2) {
      const filtered = MOCK_DIAGNOSES.filter(d => 
        d.label.toLowerCase().includes(diagnosisSearch.toLowerCase()) || 
        d.code.toLowerCase().includes(diagnosisSearch.toLowerCase())
      );
      setDiagnosisResults(filtered);
      setShowDropdown(true);
    } else {
      setDiagnosisResults([]);
      setShowDropdown(false);
    }
  }, [diagnosisSearch]);

  const handleAiSuggestDiagnoses = async () => {
    const textToAnalyze = selectedTemplate 
      ? Object.values(dynamicFormValues).join(' ') 
      : encounterNotes;
    
    if (textToAnalyze.length < 10) {
      alert("Por favor, redacte un poco más para que la IA pueda sugerir códigos precisos.");
      return;
    }
    setIsAiSuggesting(true);
    const suggestions = await aiService.suggestICD10Codes(textToAnalyze);
    setDiagnosisResults(suggestions.map((s: any, i: number) => ({ id: `ai-${i}-${Date.now()}`, ...s })));
    setShowDropdown(true);
    setIsAiSuggesting(false);
  };

  const handleSaveEncounter = () => {
    const finalEvolution = selectedTemplate 
      ? JSON.stringify({ template: selectedTemplate.name, data: dynamicFormValues }) 
      : encounterNotes.trim();

    if (!finalEvolution) return alert("La evolución clínica es obligatoria.");
    if (!selectedDiagnosis) return alert("Debe asignar un diagnóstico CIE-10.");
    
    const now = new Date().toISOString();
    
    if (appointmentId) {
      updateAppointment(appointmentId, { 
        status: 'atendido', 
        consultationEndAt: now,
        surveySent: true
      });
    }

    auditService.log(user!.id, user!.nombre, 'CLOSE_ENCOUNTER', 'PATIENT', selectedPatient.id, { 
      diagnosisCode: selectedDiagnosis.code,
      templateUsed: selectedTemplate?.name || 'Standard',
      nexusFlowSurveySent: true
    });
    
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      setShowNewEncounter(false);
      setEncounterNotes('');
      setDynamicFormValues({});
      setSelectedTemplate(null);
      if (onClose) onClose();
    }, 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
      <div className="lg:col-span-1 space-y-6">
        {appointmentId && (
          <button onClick={onClose} className="w-full flex items-center justify-center space-x-2 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm">
            <ArrowLeft size={16} />
            <span>Volver a Lista de Turnos</span>
          </button>
        )}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em] ml-1">Fichas Clínicas</h3>
          <div className="space-y-2">
            {MOCK_PATIENTS.map(p => (
              <button key={p.id} onClick={() => setSelectedPatient(p)} className={`w-full p-4 rounded-2xl text-left border transition-all ${selectedPatient.id === p.id ? 'bg-sky-50 border-sky-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}`}>
                <p className="text-sm font-bold text-slate-900">{p.nombres} {p.apellidos}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">DNI {p.docNro}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedPatient.nombres} {selectedPatient.apellidos}</h2>
            <div className="flex items-center space-x-2 mt-1">
               <div className={`w-2 h-2 rounded-full ${appointmentId ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 {appointmentId ? 'Consulta en curso • Nexus Timer Activo' : 'Visualización de Historia'}
               </span>
            </div>
          </div>
          {!showNewEncounter && (
            <button onClick={() => setShowNewEncounter(true)} className="bg-slate-900 hover:bg-[#3fb0ac] text-white px-8 py-3.5 rounded-[1.5rem] font-black text-sm flex items-center shadow-2xl transition-all">
               <Plus size={20} className="mr-2" /> Registrar Evolución
            </button>
          )}
        </header>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 min-h-[500px]">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Cronología de Atención Nexus</h4>
          <div className="space-y-6">
            {MOCK_ENCOUNTERS.filter(e => e.patientId === selectedPatient.id).length === 0 ? (
               <div className="py-20 text-center opacity-20">
                  <FileText size={48} className="mx-auto mb-4" />
                  <p className="text-sm font-black uppercase tracking-widest">Sin registros previos</p>
               </div>
            ) : (
               MOCK_ENCOUNTERS.filter(e => e.patientId === selectedPatient.id).map(enc => (
                 <div key={enc.id} className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-xs font-black text-slate-400 uppercase">{new Date(enc.fechaHora).toLocaleDateString()}</span>
                    <p className="mt-4 text-slate-700 font-medium">{enc.motivo}</p>
                 </div>
               ))
            )}
          </div>
        </div>
      </div>

      {showNewEncounter && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[95vh] flex flex-col">
              {showSuccessMessage ? (
                <div className="p-20 text-center flex flex-col items-center justify-center h-full">
                   <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce"><Check size={48} /></div>
                   <h3 className="text-3xl font-black text-slate-900">Evolución Inmovilizada</h3>
                   <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-widest">Nexus Protocol V1.0 - Firma Digital Aplicada</p>
                </div>
              ) : (
                <>
                  <div className="p-8 border-b flex items-center justify-between bg-slate-50">
                     <div className="flex items-center space-x-4">
                        <div className="p-3 bg-black text-white rounded-xl"><Stethoscope size={24} /></div>
                        <h3 className="font-black text-xl text-slate-900 uppercase italic">Registro <span className="text-[#3fb0ac]">Profesional</span></h3>
                     </div>
                     <div className="flex items-center space-x-4">
                        <div className="flex bg-white/50 p-1 rounded-xl border border-slate-200">
                           <button onClick={() => setSelectedTemplate(null)} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${!selectedTemplate ? 'bg-black text-white' : 'text-slate-400'}`}>Estándar</button>
                           {availableTemplates.map(t => (
                              <button key={t.id} onClick={() => setSelectedTemplate(t)} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${selectedTemplate?.id === t.id ? 'bg-[#3fb0ac] text-white' : 'text-slate-400'}`}>{t.name}</button>
                           ))}
                        </div>
                        <button onClick={() => setShowNewEncounter(false)} className="p-2 text-slate-400 hover:bg-white rounded-xl shadow-sm"><X size={24}/></button>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 space-y-8">
                     {selectedTemplate ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                           <div className="flex items-center space-x-3 mb-2">
                              <Layout size={18} className="text-[#3fb0ac]" />
                              <h4 className="text-[11px] font-black text-[#3fb0ac] uppercase tracking-widest">Modelo: {selectedTemplate.name}</h4>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {selectedTemplate.fields.map(field => (
                                 <div key={field.id} className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                                    {field.type === 'text' ? (
                                       <textarea 
                                          className="w-full h-32 px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-sm outline-none focus:border-[#3fb0ac] transition-all"
                                          onChange={e => setDynamicFormValues({...dynamicFormValues, [field.id]: e.target.value})}
                                       />
                                    ) : (
                                       <input 
                                          type={field.type}
                                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-[#3fb0ac] transition-all"
                                          onChange={e => setDynamicFormValues({...dynamicFormValues, [field.id]: e.target.value})}
                                       />
                                    )}
                                 </div>
                              ))}
                           </div>
                        </div>
                     ) : (
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evolución Clínica</label>
                           <textarea value={encounterNotes} onChange={(e) => setEncounterNotes(e.target.value)} className="w-full h-64 px-8 py-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-sm font-medium outline-none focus:border-[#3fb0ac] transition-all" placeholder="Escriba aquí la evolución del paciente..." />
                        </div>
                     )}

                     <div className="p-8 bg-sky-50 rounded-[2.5rem] border-2 border-sky-100 space-y-6 relative" ref={dropdownRef}>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-3 text-sky-800">
                              <SearchCode size={20} />
                              <label className="text-xs font-black uppercase tracking-widest">Codificación CIE-10</label>
                           </div>
                           <button onClick={handleAiSuggestDiagnoses} disabled={isAiSuggesting} className="flex items-center space-x-2 text-[10px] font-black uppercase text-sky-600 bg-white px-4 py-2 rounded-full border border-sky-200 hover:bg-sky-600 hover:text-white transition-all">
                              <Sparkles size={14} /> <span>Asistente Nexus AI</span>
                           </button>
                        </div>
                        <div className="relative">
                           <input value={diagnosisSearch} onChange={(e) => setDiagnosisSearch(e.target.value)} className="w-full px-8 py-4 bg-white border border-sky-100 rounded-2xl text-sm font-bold outline-none" placeholder="Buscar diagnóstico..." />
                           {showDropdown && diagnosisResults.length > 0 && (
                              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden">
                                 {diagnosisResults.map(diag => (
                                    <button key={diag.id} onClick={() => { setSelectedDiagnosis(diag); setDiagnosisSearch(`${diag.code} - ${diag.label}`); setShowDropdown(false); }} className="w-full text-left px-6 py-4 hover:bg-sky-50 flex items-center justify-between border-b last:border-0 border-slate-50">
                                       <span className="text-xs font-black text-sky-700">{diag.code} - {diag.label}</span>
                                       <Check size={14} className="text-emerald-500" />
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="p-8 border-t flex justify-end items-center space-x-4 bg-slate-50">
                     <button onClick={() => setShowNewEncounter(false)} className="px-8 py-3 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Cancelar</button>
                     <button onClick={handleSaveEncounter} className="bg-black text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-[#3fb0ac] transition-all flex items-center active:scale-95">
                        <Save size={20} className="mr-3" /> Inmovilizar y Firmar
                     </button>
                  </div>
                </>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default HCE;
