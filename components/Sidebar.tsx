
import React from 'react';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { 
  LayoutDashboard, Calendar, Users, FileText, Settings, BarChart3, Send, CheckCircle2, Video, ClipboardList, Dna
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { user } = useAuth();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.PROFESIONAL, UserRole.SECRETARIA, UserRole.AUDITOR] },
    { id: 'appointments', label: 'Agenda de Turnos', icon: Calendar, roles: [UserRole.ADMIN, UserRole.SECRETARIA, UserRole.PROFESIONAL] },
    { id: 'reports_staff', label: 'Estudios e Informes', icon: ClipboardList, roles: [UserRole.ADMIN, UserRole.SECRETARIA, UserRole.PROFESIONAL] },
    { id: 'teleconsultation', label: 'Telemedicina Nexus', icon: Video, roles: [UserRole.PROFESIONAL, UserRole.ADMIN] },
    { id: 'confirmation', label: 'Confirmaciones', icon: CheckCircle2, roles: [UserRole.SECRETARIA, UserRole.ADMIN] },
    { id: 'patients', label: 'Pacientes', icon: Users, roles: [UserRole.ADMIN, UserRole.SECRETARIA, UserRole.PROFESIONAL] },
    { id: 'hce', label: 'Historia Clínica', icon: FileText, roles: [UserRole.PROFESIONAL, UserRole.ADMIN] },
    { id: 'reports', label: 'Investigación Nexus', icon: Dna, roles: [UserRole.ADMIN, UserRole.INVESTIGADOR, UserRole.SUPERADMIN] },
    { id: 'campaigns', label: 'Comunicación', icon: Send, roles: [UserRole.ADMIN, UserRole.SECRETARIA] },
    { id: 'admin', label: user?.rol === UserRole.SECRETARIA ? 'Gestión de Staff' : 'Configuración', icon: Settings, roles: [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.SECRETARIA] },
  ];

  const visibleItems = navItems.filter(item => {
    if (!user) return false;
    // Restricciones específicas adicionales
    if (user.rol === UserRole.SECRETARIA && ['hce', 'teleconsultation', 'reports'].includes(item.id)) return false;
    return item.roles.includes(user.rol);
  });

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-72 bg-[#1e293b]">
        <div className="flex flex-col h-0 flex-1">
          {/* Logo Sidebar Premium */}
          <div className="flex flex-col items-center justify-center h-48 flex-shrink-0 px-8 bg-white border-b border-slate-100">
            <div className="flex flex-col items-center space-y-2 mb-1">
              <div className="flex items-baseline leading-none">
                <span className="text-sm font-black text-[#3fb0ac]">MED</span>
                <span className="text-sm font-black text-slate-800">NOVA</span>
              </div>
              <div className="w-12 h-px bg-slate-200"></div>
              <span className="text-[11px] font-thin text-black tracking-[0.3em] uppercase">KINESIO LP</span>
            </div>
            <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.6em] text-center mt-3">
              Nexus Protocol
            </div>
          </div>
          
          <nav className="flex-1 mt-10 px-6 space-y-2.5 overflow-y-auto custom-scrollbar">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group flex items-center px-6 py-4.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all w-full ${
                  currentPath === item.id 
                  ? 'bg-black text-white shadow-2xl shadow-black/10' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`mr-4 h-5 w-5 ${currentPath === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="p-8">
             <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#3fb0ac] mr-3 animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocolo de Datos Activo</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
