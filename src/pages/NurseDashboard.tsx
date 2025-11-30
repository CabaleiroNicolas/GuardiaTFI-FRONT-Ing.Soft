import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientRegistration } from '@/components/nurse/PatientRegistration';
import { AdmissionForm } from '@/components/nurse/AdmissionForm';
import { WaitingQueue } from '@/components/nurse/WaitingQueue';
import { LogOut, Activity, UserPlus, ClipboardList } from 'lucide-react';

const NurseDashboard = () => {
  const { user, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePatientRegistered = () => {
    // Podrías mostrar un mensaje o actualizar algún contador
  };

  const handleAdmissionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Sistema de Urgencias</h1>
                <p className="text-sm text-muted-foreground">Panel de Enfermería</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="register-patient" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="register-patient" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Registrar Paciente
            </TabsTrigger>
            <TabsTrigger value="register-admission" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Registrar Ingreso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register-patient">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <PatientRegistration onSuccess={handlePatientRegistered} />
              </div>
              <div>
                <WaitingQueue refreshTrigger={refreshTrigger} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="register-admission">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <AdmissionForm onSuccess={handleAdmissionSuccess} />
              </div>
              <div>
                <WaitingQueue refreshTrigger={refreshTrigger} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default NurseDashboard;
