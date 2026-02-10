
import React, { useState, createContext, useContext, useEffect } from 'react';
import { UserRole, Profile, Appointment, Report, Patient } from './types';
import { MOCK_PROFILES, MOCK_APPOINTMENTS, MOCK_REPORTS, MOCK_PATIENTS } from './services/mockData';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import HCE from './pages/HCE';
import Admin from './pages/Admin';
import Campaigns from './pages/Campaigns';
import ConfirmationTab from './pages/ConfirmationTab';
import Research from './pages/Research';
import Teleconsultation from './pages/Teleconsultation';
import PublicBooking from './pages/PublicBooking';
import ReportsStaff from './pages/ReportsStaff';
import PatientPortal from './pages/PatientPortal';

interface AuthContextType {
  user: Profile | null;
  patient: Patient | null;
  login: (email: string) => void;
  loginAsPatient: (dni: string) => void;
  logout: () => void;
  changeRole: (role: UserRole) => void;
  appointments: Appointment[];
  reports: Report[];
  patients: Patient[];
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  updateReport: (id: string, data: Partial<Report>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('dashboard');
  const [isPublicView, setIsPublicView] = useState<boolean>(false);
  const [isPatientPortal, setIsPatientPortal] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, ...data } : app));
  };

  const updateReport = (id: string, data: Partial<Report>) => {
    setReports(prev => prev.map(rep => rep.id === id ? { ...rep, ...data, updatedAt: new Date().toISOString() } : rep));
  };

  const login = (email: string) => {
    const profile = MOCK_PROFILES.find(p => p.email === email);
    if (profile) {
      setUser(profile);
      setCurrentPath('dashboard');
      setIsPublicView(false);
      setIsPatientPortal(false);
    }
  };

  const loginAsPatient = (dni: string) => {
    const p = MOCK_PATIENTS.find(p => p.docNro === dni);
    if (p) setPatient(p);
  };

  const logout = () => {
    setUser(null);
    setPatient(null);
  };
  
  const changeRole = (role: UserRole) => {
    if (user) setUser({ ...user, rol: role });
  };

  const renderPage = () => {
    if (isPatientPortal) return <PatientPortal onBack={() => setIsPatientPortal(false)} />;
    if (isPublicView) return <PublicBooking onBack={() => setIsPublicView(false)} />;
    if (!user) return <Login onPublicBooking={() => setIsPublicView(true)} onPatientPortal={() => setIsPatientPortal(true)} />;

    switch (currentPath) {
      case 'dashboard': return <Dashboard />;
      case 'appointments': return <Appointments onOpenHCE={(appId) => { setSelectedAppointmentId(appId); setCurrentPath('hce'); }} />;
      case 'confirmation': return <ConfirmationTab />;
      case 'patients': return <Patients />;
      case 'reports_staff': return <ReportsStaff />;
      case 'hce': return <HCE appointmentId={selectedAppointmentId} onClose={() => setSelectedAppointmentId(null)} />;
      case 'teleconsultation': return <Teleconsultation />;
      case 'admin': return <Admin />;
      case 'campaigns': return <Campaigns />;
      case 'reports': return <Research />;
      default: return <Dashboard />;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, patient, login, loginAsPatient, logout, changeRole, 
      appointments, reports, patients: MOCK_PATIENTS,
      updateAppointment, updateReport 
    }}>
      {user && !isPublicView && !isPatientPortal ? (
        <Layout currentPath={currentPath} onNavigate={setCurrentPath}>
          {renderPage()}
        </Layout>
      ) : (
        renderPage()
      )}
    </AuthContext.Provider>
  );
};

export default App;
