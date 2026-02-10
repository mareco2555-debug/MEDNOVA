
import React, { useState } from 'react';
import { useAuth } from '../App';
import { MOCK_PATIENTS } from '../services/mockData';
import { auditService } from '../services/auditService';
import { REPORT_STATUS_LABELS, STUDY_TYPES } from '../constants';
import { 
  FileUp, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MoreVertical,
  Calendar,
  Building,
  User,
  ExternalLink,
  ChevronRight,
  Send,
  Trash2
} from 'lucide-react';
import { ReportStatus, Report } from '../types';

const ReportsStaff: React.FC = () => {
  const { user, reports, updateReport } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    studyType: 'Laboratorio',
    studyDate: new Date().toISOString().split('T')[0],
    site: 'Sede Central',
    reportingProfessional: ''
  });

  const filteredReports = reports.filter(r => 
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (id: string, newStatus: ReportStatus) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;

    let action = '';
    let metadata = {};

    if (newStatus === 'published') {
      action = 'PUBLISH_REPORT';
      metadata = { publishedAt: new Date().toISOString() };
      // Simulación de notificación automática
      console.log(`[NOTIFICACIÓN]: Enviando mednova_informe_disponible a ${report.patientName}`);
      alert(`Informe publicado. Se ha enviado una notificación automática por WhatsApp y Email a ${report.patientName}.`);
    } else if (newStatus === 'withdrawn') {
      action = 'WITHDRAW_REPORT';
      const reason = prompt("Motivo del retiro del informe:");
      if (!reason) return;
      metadata = { withdrawnAt: new Date().toISOString(), withdrawnReason: reason };
    }

    updateReport(id, { status: newStatus, ...metadata });
    auditService.log(user!.id, user!.nombre, action, 'REPORT', id, metadata);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return alert("Seleccione un paciente.");
    
    const patient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);
    
    // En una app real esto insertaría en la DB
    alert(`Informe "${uploadForm.title}" cargado correctamente para ${patient?.nombres}. Estado inicial: Borrador.`);
    
    auditService.log(user!.id, user!.nombre, 'UPLOAD_REPORT', 'PATIENT', selectedPatientId, uploadForm);
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#4a4a4a] tracking-tight">Gestión de Informes</h2>
          <p className="text-slate-500 font-medium">Carga, validación y entrega de estudios a pacientes</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-[#3fb0ac] hover:bg-[#359b97] text-white px-8 py-3.5 rounded-2xl text-sm font-black flex items-center transition-all shadow-xl active:scale-95"
        >
          <FileUp size={20} className="mr-2" /> Cargar Nuevo Estudio
        </button>
      </header>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por paciente o título de estudio..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm font-medium" 
          />
        </div>
        <div className="flex items-center space-x-2">
           <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all border border-slate-100"><Filter size={20} /></button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/30 text-left border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudio / Paciente</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadatos</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Nexus</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trazabilidad</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                       <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl group-hover:bg-[#3fb0ac]/10 group-hover:text-[#3fb0ac] transition-all">
                          <ClipboardIcon type={report.studyType} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 group-hover:text-[#3fb0ac] transition-colors">{report.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{report.patientName}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="space-y-1">
                        <div className="flex items-center text-[10px] font-bold text-slate-500">
                           <Calendar size={12} className="mr-1.5" /> {new Date(report.studyDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-slate-500">
                           <Building size={12} className="mr-1.5" /> {report.site}
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                       report.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                       report.status === 'validation' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                       report.status === 'withdrawn' ? 'bg-red-50 text-red-700 border-red-100' :
                       'bg-slate-100 text-slate-500 border-slate-200'
                     }`}>
                       {REPORT_STATUS_LABELS[report.status]}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                     {report.status === 'published' ? (
                        <div className="flex flex-col items-center">
                           <div className={`flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-tighter ${report.viewedByPatientAt ? 'text-emerald-600' : 'text-slate-300'}`}>
                              <Eye size={12} />
                              <span>{report.viewedByPatientAt ? 'Visto por Paciente' : 'Pendiente Visualización'}</span>
                           </div>
                           {report.viewedByPatientAt && <p className="text-[9px] text-slate-400 mt-1">{new Date(report.viewedByPatientAt).toLocaleString()}</p>}
                        </div>
                     ) : (
                        <span className="text-[10px] text-slate-300 italic">N/A</span>
                     )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       {report.status !== 'published' && report.status !== 'withdrawn' && (
                          <button 
                            onClick={() => handleStatusChange(report.id, 'published')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                            title="Publicar al Paciente"
                          >
                             <Send size={16} />
                          </button>
                       )}
                       {report.status === 'published' && (
                          <button 
                            onClick={() => handleStatusChange(report.id, 'withdrawn')}
                            className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
                            title="Retirar Informe"
                          >
                             <XCircle size={16} />
                          </button>
                       )}
                       <button className="p-2.5 text-slate-400 hover:bg-white rounded-xl border border-slate-100 transition-all shadow-sm"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Carga */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#4a4a4a]/80 backdrop-blur-sm">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b flex items-center justify-between bg-slate-50">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900">Cargar Informe Médico</h3>
                    <p className="text-sm text-slate-500">Módulo de Entrega Digital MedNova</p>
                 </div>
                 <button onClick={() => setShowUploadModal(false)} className="p-2 text-slate-400 hover:bg-white rounded-xl shadow-sm"><XCircle size={24}/></button>
              </div>
              <form onSubmit={handleUpload} className="p-10 space-y-8">
                 <div className="space-y-4">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Paciente Asociado</label>
                       <select 
                        required 
                        value={selectedPatientId} 
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                        className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-[#3fb0ac] transition-all font-bold text-slate-700"
                       >
                          <option value="">Buscar Paciente...</option>
                          {MOCK_PATIENTS.map(p => <option key={p.id} value={p.id}>{p.nombres} {p.apellidos} (DNI: {p.docNro})</option>)}
                       </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título del Estudio</label>
                          <input required value={uploadForm.title} onChange={e => setUploadForm({...uploadForm, title: e.target.value})} className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-[#3fb0ac] transition-all font-bold text-slate-700" placeholder="Ej: Laboratorio Pre-quirúrgico" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Tipo de Estudio</label>
                          <select required value={uploadForm.studyType} onChange={e => setUploadForm({...uploadForm, studyType: e.target.value as any})} className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-[#3fb0ac] transition-all font-bold text-slate-700">
                             {STUDY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Fecha de Realización</label>
                          <input type="date" required value={uploadForm.studyDate} onChange={e => setUploadForm({...uploadForm, studyDate: e.target.value})} className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-[#3fb0ac] transition-all font-bold text-slate-700" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Sede / Centro</label>
                          <input required value={uploadForm.site} onChange={e => setUploadForm({...uploadForm, site: e.target.value})} className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-[#3fb0ac] transition-all font-bold text-slate-700" />
                       </div>
                    </div>
                 </div>

                 <div className="p-10 border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 hover:border-[#3fb0ac]/30 transition-all bg-slate-50/50 group cursor-pointer">
                    <div className="p-5 bg-white rounded-full text-slate-400 shadow-xl group-hover:scale-110 transition-transform">
                       <FileUp size={40} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-700 uppercase">Seleccione el Archivo PDF</p>
                       <p className="text-xs text-slate-400 mt-1 font-medium">Tamaño máximo 10MB • Solo formato PDF o Imágenes HD</p>
                    </div>
                 </div>

                 <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={() => setShowUploadModal(false)} className="px-8 py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Cancelar</button>
                    <button type="submit" className="bg-[#4a4a4a] hover:bg-slate-900 text-white px-12 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95">Guardar en Nexus</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const ClipboardIcon = ({ type }: { type: string }) => {
   switch(type) {
      case 'Laboratorio': return <AlertCircle size={24} />;
      case 'Rayos X': return <Building size={24} />;
      case 'Ecografía': return <User size={24} />;
      default: return <FileUp size={24} />;
   }
};

export default ReportsStaff;
