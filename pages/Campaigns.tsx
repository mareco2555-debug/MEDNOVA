
import React, { useState } from 'react';
import { useAuth } from '../App';
import { 
  Send, 
  MessageCircle, 
  Mail, 
  Users, 
  Plus, 
  Search,
  CheckCircle2,
  Clock,
  ClipboardList,
  Zap,
  Star,
  Settings2,
  MessageSquareHeart,
  ChevronRight,
  BarChart
} from 'lucide-react';

const Campaigns: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'flows'>('campaigns');
  const [isSurveyFlowActive, setIsSurveyFlowActive] = useState(true);

  const campaigns = [
    { id: 'c1', name: 'Confirmación Vacuna Gripe', channel: 'whatsapp', status: 'enviando', progress: 65, total: 120, date: '23/10/2023' },
    { id: 'c2', name: 'Newsletter Octubre', channel: 'email', status: 'finalizado', progress: 100, total: 450, date: '01/10/2023' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Comunicación Nexus</h2>
          <p className="text-slate-500 font-medium">Campañas masivas y flujos de fidelización automatizados</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
           <button 
             onClick={() => setActiveTab('campaigns')}
             className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'campaigns' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
           >
             Campañas
           </button>
           <button 
             onClick={() => setActiveTab('flows')}
             className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'flows' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
           >
             Flujos Automáticos
           </button>
        </div>
      </header>

      {activeTab === 'campaigns' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-[#3fb0ac] transition-all">
               <div className="flex items-center space-x-4 mb-6">
                 <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner"><MessageCircle size={24} /></div>
                 <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Opt-in WhatsApp</h3>
               </div>
               <p className="text-4xl font-black text-slate-900">1,240</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Pacientes Suscriptos</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-[#3fb0ac] transition-all">
               <div className="flex items-center space-x-4 mb-6">
                 <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl shadow-inner"><Mail size={24} /></div>
                 <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Opt-in Email</h3>
               </div>
               <p className="text-4xl font-black text-slate-900">3,850</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Pacientes Suscriptos</p>
            </div>
            <div className="bg-[#3fb0ac] p-8 rounded-[2.5rem] shadow-xl text-white flex flex-col justify-center items-center text-center cursor-pointer hover:scale-[1.02] transition-transform">
               <Plus size={32} className="mb-2" />
               <p className="font-black text-sm uppercase tracking-widest">Crear Nueva Campaña</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Historial de Envíos</h3>
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Filtrar campañas..." className="pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3fb0ac]/20" />
               </div>
            </div>
            <div className="divide-y divide-slate-50">
               {campaigns.map((camp) => (
                 <div key={camp.id} className="p-8 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                       <div className="flex items-center space-x-6">
                          <div className={`p-4 rounded-2xl ${camp.channel === 'whatsapp' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                             {camp.channel === 'whatsapp' ? <MessageCircle size={28} /> : <Mail size={28} />}
                          </div>
                          <div>
                             <h4 className="font-black text-slate-900 text-lg leading-tight">{camp.name}</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                               Enviado: {camp.date} • {camp.total} Destinatarios
                             </p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end min-w-[200px]">
                          <div className="flex items-center space-x-3 mb-2">
                             <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                               camp.status === 'finalizado' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700 animate-pulse'
                             }`}>
                               {camp.status}
                             </span>
                             <span className="text-xs font-black text-slate-900">{camp.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                             <div className={`h-full transition-all duration-1000 ${
                               camp.status === 'finalizado' ? 'bg-emerald-500' : 'bg-sky-500'
                             }`} style={{ width: `${camp.progress}%` }}></div>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
           {/* Configuración del Flujo de Encuestas */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Zap size={120} />
                 </div>
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                       <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl shadow-inner"><MessageSquareHeart size={28} /></div>
                       <div>
                          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nexus Satisfaction Flow</h3>
                          <p className="text-xs text-slate-500 font-medium">Encuesta de Calidad Post-Atención Automática</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setIsSurveyFlowActive(!isSurveyFlowActive)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isSurveyFlowActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isSurveyFlowActive ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                       <div className="flex items-center space-x-2 mb-4">
                          <Settings2 size={16} className="text-slate-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plantilla del Mensaje</span>
                       </div>
                       <textarea 
                         className="w-full h-32 bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#3fb0ac]/20"
                         defaultValue="Hola {{nombre_paciente}}. Gracias por elegir MEDNOVA. Nos importa mucho tu opinión para seguir innovando. ¿Podrías responder esta breve encuesta sobre tu consulta con el/la Dr/a. {{profesional}}? Link: https://nexus.mednova/survey/{{id_turno}}"
                       />
                       <div className="mt-4 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-400 uppercase">#paciente</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-400 uppercase">#profesional</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-400 uppercase">#fecha</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-6 border-2 border-slate-100 rounded-[1.5rem] hover:border-[#3fb0ac]/30 transition-all">
                          <div className="flex items-center space-x-3 mb-2">
                             <Clock size={18} className="text-sky-500" />
                             <span className="text-xs font-black text-slate-900 uppercase">Timing de Envío</span>
                          </div>
                          <select className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold py-2 outline-none">
                             <option>Inmediato (al cerrar HCE)</option>
                             <option>2 horas después</option>
                             <option>Al final del día</option>
                          </select>
                       </div>
                       <div className="p-6 border-2 border-slate-100 rounded-[1.5rem] hover:border-[#3fb0ac]/30 transition-all">
                          <div className="flex items-center space-x-3 mb-2">
                             <Zap size={18} className="text-emerald-500" />
                             <span className="text-xs font-black text-slate-900 uppercase">Canal Preferente</span>
                          </div>
                          <select className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold py-2 outline-none">
                             <option>WhatsApp (Recomendado)</option>
                             <option>Email Institucional</option>
                             <option>Ambos Canales</option>
                          </select>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-8 border-t border-slate-50 flex justify-end">
                    <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                       Guardar Configuración de Flujo
                    </button>
                 </div>
              </div>
           </div>

           {/* Estadísticas de Feedback */}
           <div className="space-y-6">
              <div className="bg-[#4a4a4a] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
                 <h3 className="text-xs font-black uppercase tracking-widest text-[#3fb0ac] mb-6 flex items-center">
                   <BarChart size={16} className="mr-2" /> Rendimiento de Encuestas
                 </h3>
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasa de Respuesta</span>
                          <span className="text-xs font-black">74%</span>
                       </div>
                       <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '74%' }}></div>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                       <div className="text-center">
                          <p className="text-2xl font-black text-white">4.9/5</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase mt-1">NPS Promedio</p>
                       </div>
                       <div className="text-center">
                          <p className="text-2xl font-black text-white">842</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Respondidas</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center">
                   <Star size={16} className="mr-2 text-amber-500" /> Feedback Reciente
                 </h3>
                 <div className="space-y-4">
                    {[1, 2].map(i => (
                       <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-[#3fb0ac]/30 transition-all">
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex space-x-1">
                                {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-amber-400 text-amber-400" />)}
                             </div>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">HACE 2H</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-600 leading-tight">"Excelente atención del Dr. Pérez, muy claro en sus explicaciones."</p>
                       </div>
                    ))}
                 </div>
                 <button className="w-full py-3 text-[10px] font-black uppercase text-[#3fb0ac] hover:bg-teal-50 rounded-xl transition-all">Ver todos los comentarios</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
