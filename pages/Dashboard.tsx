
import React from 'react';
import { useAuth } from '../App';
import { 
  Sparkles,
  Heart,
  Star,
  Activity,
  TrendingUp,
  TrendingDown,
  CalendarCheck
} from 'lucide-react';
import { UserRole } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const isProfessional = user?.rol === UserRole.PROFESIONAL;

  const stats = [
    { 
      label: isProfessional ? 'Atenciones este Mes' : 'Total Atenciones Centro', 
      value: isProfessional ? '124' : '542', 
      trend: '+18.2%', 
      isPositive: true,
      icon: Activity, 
      color: 'text-black', 
      bg: 'bg-slate-50' 
    },
    { 
      label: 'NPS - Satisfacción Paciente', 
      value: '4.9', 
      trend: '+0.1', 
      isPositive: true,
      icon: Star, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50' 
    },
  ];

  const trendData = [
    { month: 'May', count: 85 },
    { month: 'Jun', count: 92 },
    { month: 'Jul', count: 110 },
    { month: 'Ago', count: 125 },
    { month: 'Sep', count: 138 },
    { month: 'Oct', count: 154 },
  ];

  const maxCount = Math.max(...trendData.map(d => d.count));

  const qualityMetrics = [
    { label: 'Evolución Pacientes', value: 94, icon: TrendingUp, color: 'text-[#3fb0ac]' },
    { label: 'Adherencia Tratamiento', value: 88, icon: Heart, color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Dual Brand Alineado y Premium */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-slate-100">
        <div className="flex items-center space-x-10">
            {/* LOGO DUAL INTEGRADO DASHBOARD */}
            <div className="flex items-center space-x-12 bg-white px-12 py-8 rounded-[3.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-slate-50 transition-all hover:shadow-xl">
               <div className="flex items-baseline leading-none">
                  <span className="text-3xl font-black text-[#3fb0ac]">Med</span>
                  <span className="text-3xl font-black text-slate-900">Nova</span>
               </div>
               <div className="w-px h-10 bg-slate-200"></div>
               <div className="flex flex-col items-start pt-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-1">Rehabilitación</span>
                  <span className="text-2xl font-thin text-black uppercase tracking-[0.2em] leading-none">KINESIO LP</span>
               </div>
            </div>
            
            <div className="h-16 w-px bg-slate-200 hidden md:block"></div>
            
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Nexus Hub</h2>
               <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.6em] mt-2">Plataforma de Alta Disponibilidad</p>
            </div>
        </div>
        
        <div className="flex items-center space-x-5 bg-white px-8 py-4 rounded-[2rem] border border-slate-50 shadow-sm">
           <div className="w-3 h-3 rounded-full bg-[#3fb0ac] animate-pulse"></div>
           <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Nodo Central Sincronizado</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-50 flex items-center justify-between group hover:shadow-2xl transition-all">
            <div className="space-y-4">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</p>
              <div className="flex items-end space-x-6">
                <p className="text-7xl font-black text-slate-900 leading-none tracking-tighter">{stat.value}</p>
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-[11px] font-black ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                   {stat.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                   <span>{stat.trend}</span>
                </div>
              </div>
            </div>
            <div className={`p-10 rounded-[3rem] ${stat.bg} ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
              <stat.icon size={52} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
