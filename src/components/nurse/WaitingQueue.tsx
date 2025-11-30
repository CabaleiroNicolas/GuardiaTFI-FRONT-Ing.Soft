import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Admission, EMERGENCY_LEVELS } from '@/types/emergency';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, AlertTriangle, Activity, Thermometer } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface WaitingQueueProps {
  refreshTrigger: number;
}

export const WaitingQueue = ({ refreshTrigger }: WaitingQueueProps) => {
  const { user } = useAuth();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdmissions();
  }, [refreshTrigger]);

  const fetchAdmissions = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/admissions/waiting`, {
      //   headers: {
      //     'Authorization': `Bearer ${user?.token}`,
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error al cargar la cola de espera');
      // }
      // 
      // const data = await response.json();
      // setAdmissions(data);

      // Mock data for development
      const mockAdmissions: Admission[] = [
        {
          id: '1',
          patientId: 'P001',
          patientName: 'Juan Pérez',
          fechaIngreso: new Date(Date.now() - 30 * 60000), // 30 min ago
          informe: 'Dolor torácico intenso',
          nivelEmergencia: 'EMERGENCIA',
          estado: 'PENDIENTE',
          temperatura: 37.2,
          frecCardiaca: 110,
          frecRespiratoria: 22,
          tensionArterial: '150/95',
          enfermeraId: 'E001',
          enfermeraNombre: 'María García',
        },
        {
          id: '2',
          patientId: 'P002',
          patientName: 'Ana Martínez',
          fechaIngreso: new Date(Date.now() - 70 * 60000), // 70 min ago
          informe: 'Fractura en brazo derecho',
          nivelEmergencia: 'URGENCIA',
          estado: 'PENDIENTE',
          temperatura: 36.8,
          frecCardiaca: 85,
          frecRespiratoria: 18,
          tensionArterial: '120/80',
          enfermeraId: 'E001',
          enfermeraNombre: 'María García',
        },
        {
          id: '3',
          patientId: 'P003',
          patientName: 'Carlos López',
          fechaIngreso: new Date(Date.now() - 10 * 60000), // 10 min ago
          informe: 'Fiebre alta y malestar general',
          nivelEmergencia: 'URGENCIA_MENOR',
          estado: 'PENDIENTE',
          temperatura: 38.5,
          frecCardiaca: 92,
          frecRespiratoria: 20,
          tensionArterial: '115/75',
          enfermeraId: 'E002',
          enfermeraNombre: 'Laura Rodríguez',
        },
      ];

      setAdmissions(mockAdmissions);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWaitingTime = (admission: Admission) => {
    const now = new Date();
    const admissionTime = new Date(admission.fechaIngreso);
    const diffInMinutes = Math.floor((now.getTime() - admissionTime.getTime()) / 60000);
    return diffInMinutes;
  };

  const isOverdue = (admission: Admission) => {
    const waitingTime = getWaitingTime(admission);
    const maxWaitTime = EMERGENCY_LEVELS[admission.nivelEmergencia].maxWaitTime;
    return waitingTime > maxWaitTime;
  };

  const getLevelBadgeColor = (level: Admission['nivelEmergencia']) => {
    const colorMap = {
      CRITICA: 'bg-critical text-critical-foreground',
      EMERGENCIA: 'bg-emergency text-emergency-foreground',
      URGENCIA: 'bg-urgent text-urgent-foreground',
      URGENCIA_MENOR: 'bg-minor text-minor-foreground',
      SIN_URGENCIA: 'bg-routine text-routine-foreground',
    };
    return colorMap[level];
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Cargando cola de espera...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Cola de Espera de Urgencias
        </CardTitle>
        <CardDescription>
          {admissions.length} paciente(s) en espera de atención
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {admissions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay pacientes en espera
          </p>
        ) : (
          admissions.map((admission) => (
            <div key={admission.id} className="border rounded-lg p-4 space-y-3">
              {isOverdue(admission) && (
                <Alert variant="destructive" className="mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Este paciente ha superado el tiempo máximo de espera (
                    {EMERGENCY_LEVELS[admission.nivelEmergencia].maxWaitTime} min)
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{admission.patientName}</h3>
                    <Badge variant="outline" className="text-xs">
                      {admission.patientId}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enfermera: {admission.enfermeraNombre}
                  </p>
                </div>
                <Badge className={getLevelBadgeColor(admission.nivelEmergencia)}>
                  {EMERGENCY_LEVELS[admission.nivelEmergencia].name}
                </Badge>
              </div>

              <div className="bg-muted/50 p-3 rounded-md space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Informe:</span> {admission.informe}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">FC:</span> {admission.frecCardiaca} lpm
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">FR:</span> {admission.frecRespiratoria} rpm
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">TA:</span> {admission.tensionArterial}
                </div>
                {admission.temperatura && (
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Temp:</span> {admission.temperatura}°C
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                <Clock className="w-4 h-4" />
                <span>
                  Ingresó {formatDistanceToNow(new Date(admission.fechaIngreso), { addSuffix: true, locale: es })}
                </span>
                <span className="ml-auto font-medium">
                  Esperando: {getWaitingTime(admission)} min
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
