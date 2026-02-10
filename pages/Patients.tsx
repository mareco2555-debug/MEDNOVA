
import React, { useState } from 'react';
import { useAuth } from '../App';
import { auditService } from '../services/auditService';
import { 
  Plus, Search, User, Mail, Phone, MessageSquare, MoreVertical, ShieldCheck, Ban, AlertTriangle, X, ShieldAlert
} from 'lucide-react';
import { UserRole, Patient } from '../types';

const Patients: React.FC = () => {
  const { user, patients, activeOrg } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [localPatients, setLocalPatients] = useState<Patient[]>(patients);
  const [showDncModal, setShowDncModal] = useState<string | null>(null);
  const [dncReason, setDncReason] = useState('');

  const filteredPatients = localPatients.filter(p => 
    `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.docNro.includes(searchTerm)
  );

  const handleViewPatient = (patientId: string) => {
    if (user?.rol === UserRole.SECRETARIA) {
      alert("Acceso Clínico Restringido: Su rol solo permite ver datos administrativos.");
      return;
    }
    auditService.log(user!.id, user!.nombre, 'VIEW_PATIENT_FULL', 'PATIENT', patientId, { orgId: activeOrg?.id });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Registro de Pacientes</h2>
          <p className="text-slate-500 font-medium">Módulo {user?.rol === UserRole.SECRETARIA ? 'Administrativo' : 'Clínico'} - {activeOrg?.name}</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl text-sm font-black flex items-center transition-all shadow-xl">
          <Plus size={18} className="mr-2" /> Nuevo Paciente
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o DNI en este centro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-slate-200 outline-none transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className={`bg-white rounded-[2.5rem] shadow-sm border transition-all overflow-hidden hover:shadow-xl ${patient.doNotContact ? 'border-red-200 bg-red-50/10' : 'border-slate-100'}`}>
            <div className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border transition-colors ${patient.doNotContact ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 leading-tight">
                      {patient.nombres} {patient.apellidos}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{patient.docTipo}: {patient.docNro}</p>
                  </div>
                </div>
                {patient.doNotContact && <Ban className="text-red-500" size={20} />}
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center text-xs font-bold text-slate-600">
                  <Mail size={16} className="mr-3 text-slate-300" /> {patient.email}
                </div>
                <div className="flex items-center text-xs font-bold text-slate-600">
                  <Phone size={16} className="mr-3 text-slate-300" /> {patient.celular}
                </div>
                <div className="flex items-center text-xs font-bold text-slate-600">
                  <ShieldCheck size={16} className={`mr-3 ${activeOrg?.id === 'org_mednova' ? 'text-[#3fb0ac]' : 'text-blue-600'}`} /> {patient.obraSocialNombre}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex space-x-2">
                   <div className={`p-2 rounded-xl border ${patient.whatsappOptIn ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                      <MessageSquare size={16} />
                   </div>
                </div>
                <div className="flex items-center space-x-2">
                   <button 
                    onClick={() => handleViewPatient(patient.id)}
                    className="text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 px-6 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                   >
                    {user?.rol === UserRole.SECRETARIA ? 'Ver Admin' : 'Ver Historia'}
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patients;
