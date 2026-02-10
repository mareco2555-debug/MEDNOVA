
import React, { useState } from 'react';
import { useAuth } from '../App';
import Sidebar from './Sidebar';
import { APP_NAME, SLOGAN } from '../constants';
import { LogOut, User, Bell, Phone, Mail, MapPin, Clock, X, MessageCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPath, onNavigate }) => {
  const { user, logout } = useAuth();
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Header */}
        <header className="relative z-10 flex flex-shrink-0 h-16 bg-white border-b border-slate-200">
          <div className="flex justify-between flex-1 px-4 lg:px-8">
            <div className="flex flex-1 items-center">
               <h1 className="text-xl font-bold text-slate-800 tracking-tight lg:hidden">
                 {APP_NAME}
               </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-1 text-slate-400 rounded-full hover:bg-slate-100 transition-colors">
                <Bell size={20} />
              </button>
              
              <div className="flex items-center space-x-3 border-l pl-4 ml-4">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-semibold text-slate-900">{user?.nombre} {user?.apellido}</span>
                  <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase font-medium">
                    {user?.rol}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold border border-sky-200">
                  {user?.nombre.charAt(0)}
                </div>
                <button 
                  onClick={logout}
                  className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>

        {/* Footer info */}
        <footer className="px-8 py-2 text-[10px] font-bold text-slate-400 border-t bg-white flex items-center justify-between uppercase tracking-widest">
           <div className="flex items-center space-x-6">
              <span>{SLOGAN}</span>
              <button 
                onClick={() => setShowContactModal(true)}
                className="text-[#3fb0ac] hover:text-[#359b97] transition-colors flex items-center"
              >
                <MessageCircle size={12} className="mr-1.5" /> Contacto
              </button>
           </div>
           <span>v1.0.4 - Trazabilidad Total Activada</span>
        </footer>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Atención al Staff</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Soporte e Información Institucional</p>
              </div>
              <button onClick={() => setShowContactModal(false)} className="p-2 text-slate-400 hover:bg-white rounded-xl shadow-sm transition-all"><X size={20} /></button>
            </div>
            
            <div className="p-8 space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white text-[#3fb0ac] rounded-xl shadow-sm"><Phone size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Línea Interna</p>
                    <p className="text-sm font-bold text-slate-900">+54 11 4444-5555</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white text-sky-500 rounded-xl shadow-sm"><Mail size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soporte Técnico Nexus</p>
                    <p className="text-sm font-bold text-slate-900">soporte@mednova.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white text-emerald-500 rounded-xl shadow-sm"><MapPin size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sede Central</p>
                    <p className="text-sm font-bold text-slate-900">Av. Libertador 4500, CABA</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="w-full bg-slate-900 hover:bg-[#3fb0ac] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all"
                >
                  Cerrar
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
