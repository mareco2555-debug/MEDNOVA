
import React, { useState } from 'react';
import { useAuth } from '../App';
import { 
  BarChart3, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  FileSpreadsheet, 
  CheckCircle2, 
  Table, 
  Dna,
  Layers,
  Info,
  ChevronRight,
  Eye,
  FileJson,
  Zap,
  Activity,
  Sparkles
} from 'lucide-react';
import { auditService } from '../services/auditService';
import { MOCK_CLINICAL_TEMPLATES } from '../services/mockData';

const Research: React.FC = () => {
  const { user } = useAuth();
  const [isPseudonymized, setIsPseudonymized] = useState(true);
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['age', 'gender', 'dx_code', 'encounter_type']);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'specialized'>('all');

  const availableVariables = [
    { id: 'age', label: 'Edad del Paciente', category: 'Demográfico' },
    { id: 'gender', label: 'Identidad de Género', category: 'Demográfico' },
    { id: 'dx_code', label: 'CIE-10 (Código)', category: 'Clínico' },
    { id: 'dx_label', label: 'Diagnóstico Texto', category: 'Clínico' },
    { id: 'encounter_type', label: 'Modalidad de Atención', category: 'Administrativo' },
    { id: 'med_prescribed', label: 'Fármacos / Tratamientos', category: 'Clínico' },
    { id: 'prof_id', label: 'ID Profesional', category: 'Metadatos' },
    { id: 'visit_date', label: 'Temporalidad (Fecha)', category: 'Administrativo' },
  ];

  const specializedVariables = MOCK_CLINICAL_TEMPLATES.flatMap(t => 
    t.fields.map(f => ({
      id: `${t.id}_${f.id}`,
      label: `${f.label}`,
      category: t.specialty
    }))
  );

  const mockPreviewData = [
    { study_id: 'NX-8821', age: 45, gender: 'F', dx_code: 'I10', encounter_type: 'Presencial', visit_date: '2023-10-15' },
    { study_id: 'NX-1240', age: 32, gender: 'M', dx_code: 'E11.9', encounter_type: 'Telemedicina', visit_date: '2023-10-16' },
    { study_id: 'NX-4402', age: 28, gender: 'F', dx_code: 'J45', encounter_type: 'Rehabilitación', visit_date: '2023-10-16' },
  ];

  const toggleVariable = (id: string) => {
    setSelectedVariables(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const currentVars = activeCategory === 'all' ? availableVariables : specializedVariables;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Premium */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-slate-100">
        <div className="flex items-center space-x-8">
            <div className="p-5 bg-black text-white rounded-[2rem] shadow-2xl">
              <Dna size={32} />
            </div>
            <div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Investigación <span className="text-[#3fb0ac]">Nexus</span></h2>
               <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.6em] mt-2">Módulo de Extracción Masiva de Datos</p>
            </div>
        </div>
        
        <div className="flex items-center space-x-4">
           <button 
             onClick={() => setIsPreviewing(!isPreviewing)} 
             className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center transition-all border ${isPreviewing ? 'bg-black text-white border-black' : 'bg-white border-slate-200 text-slate-600 hover:border-black'}`}
           >
              <Eye size={16} className="mr-3" /> {isPreviewing ? 'Ocultar Vista Previa' : 'Previsualizar Dataset'}
           </button>
           <div className="flex bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
              <button onClick={() => alert('Exportando...')} className="flex items-center space-x-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 rounded-xl transition-all"><FileSpreadsheet size={16} className="text-[#3fb0ac]" /><span>CSV</span></button>
              <div className="w-px h-6 bg-slate-100 mx-1 self-center"></div>
              <button onClick={() => alert('Exportando...')} className="flex items-center space-x-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 rounded-xl transition-all"><FileJson size={16} className="text-sky-500" /><span>JSON</span></button>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Lado Izquierdo: Filtros y Seguridad */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 mb-8">
              <Filter size={18} className="text-[#3fb0ac]" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Protocolo de Filtrado</h3>
            </div>
            
            <div className="space-y-8">
              <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                 <button 
                   onClick={() => setActiveCategory('all')} 
                   className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeCategory === 'all' ? 'bg-white shadow-md text-[#3fb0ac]' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   Core Data
                 </button>
                 <button 
                   onClick={() => setActiveCategory('specialized')} 
                   className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeCategory === 'specialized' ? 'bg-white shadow-md text-[#3fb0ac]' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   Clinical Fields
                 </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Periodo de Análisis</label>
                  <div className="flex items-center space-x-2">
                    <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none" defaultValue="2023-01-01" />
                    <span className="text-slate-300">-</span>
                    <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none" defaultValue="2023-12-31" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Centro / Sede</label>
                  <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none appearance-none cursor-pointer">
                    <option>MEDNOVA & KINESIO LP (Unificado)</option>
                    <option>Sede Central</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#1e293b] rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                <ShieldCheck size={100} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#3fb0ac]">Privacidad & Ética</h3>
                  <ShieldCheck size={24} className="text-[#3fb0ac]" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-8">
                  La exportación de datos en este entorno está sujeta a normativas internacionales de investigación médica. Los identificadores directos se eliminan automáticamente.
                </p>
                <button 
                  onClick={() => setIsPseudonymized(!isPseudonymized)} 
                  className={`w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-3 transition-all border-2 ${isPseudonymized ? 'bg-[#3fb0ac]/10 border-[#3fb0ac]/40 text-[#3fb0ac]' : 'bg-red-500/10 border-red-500/40 text-red-500'}`}
                >
                  <Zap size={16} />
                  <span>{isPseudonymized ? 'Seudonimización Activa' : 'Sin Seudonimización'}</span>
                </button>
             </div>
          </section>
        </div>

        {/* Lado Derecho: Selector de Variables y Preview */}
        <div className="lg:col-span-8 space-y-10">
           <section className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Mapeo de Variables</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Seleccione los puntos de datos para el dataset</p>
                </div>
                <span className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {selectedVariables.length} Activas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {currentVars.map((v) => (
                   <button 
                     key={v.id} 
                     onClick={() => toggleVariable(v.id)} 
                     className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all group ${selectedVariables.includes(v.id) ? 'bg-[#3fb0ac]/5 border-[#3fb0ac]/30 ring-4 ring-[#3fb0ac]/5' : 'bg-white border-slate-100 hover:border-[#3fb0ac]/30'}`}
                   >
                     <div className="flex flex-col items-start">
                        <span className={`text-sm font-black transition-colors ${selectedVariables.includes(v.id) ? 'text-[#3fb0ac]' : 'text-slate-900'}`}>{v.label}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1">{v.category}</span>
                     </div>
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedVariables.includes(v.id) ? 'bg-[#3fb0ac] border-[#3fb0ac] scale-110' : 'border-slate-200 group-hover:border-[#3fb0ac]/50'}`}>
                        {selectedVariables.includes(v.id) && <CheckCircle2 size={14} className="text-white" />}
                     </div>
                   </button>
                 ))}
              </div>
           </section>

           {isPreviewing && (
             <section className="bg-white rounded-[4rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-10 duration-500">
                <div className="p-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                   <h3 className="text-[10px] font-black text-white flex items-center uppercase tracking-[0.4em]"><Table size={16} className="mr-3 text-[#3fb0ac]" /> Snapshot de Datos Estructurados</h3>
                   <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dataset Generado</span>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-[11px] font-bold">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                           <th className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Nexus_ID</th>
                           {selectedVariables.map(v => (
                             <th key={v} className="px-8 py-5 font-black text-slate-900 uppercase tracking-widest">
                               {availableVariables.find(av => av.id === v)?.label || specializedVariables.find(sv => sv.id === v)?.label || v}
                             </th>
                           ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {mockPreviewData.map((row, idx) => (
                           <tr key={idx} className="hover:bg-[#3fb0ac]/5 transition-colors">
                              <td className="px-8 py-6 font-black text-[#3fb0ac] border-r border-slate-100">{row.study_id}</td>
                              {selectedVariables.map(v => (
                                <td key={v} className="px-8 py-6 text-slate-600">
                                  {(row as any)[v.replace('_','')] || (row as any)[v] || '-'}
                                </td>
                              ))}
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                      <Sparkles size={14} className="mr-3 text-sky-500" /> Motor de inteligencia Nexus procesando 12,482 registros totales
                   </p>
                </div>
             </section>
           )}
        </div>
      </div>
    </div>
  );
};

export default Research;
