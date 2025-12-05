import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Admission, EMERGENCY_LEVELS, BackendAdmissionResponse, mapBackendAdmissionToAdmission } from '@/types/emergency';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, AlertTriangle, Activity, Thermometer } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface WaitingQueueProps {
  refreshTrigger: number;
  onQueueCountChange?: (count: number) => void;
}

export const WaitingQueue = ({ refreshTrigger, onQueueCountChange }: WaitingQueueProps) => {
  const { user } = useAuth();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdmissions();
  }, [refreshTrigger]);

  const fetchAdmissions = async () => {
    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/urgencias`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar la cola de espera');
      }

      const backendData: BackendAdmissionResponse[] = await response.json();
      const mappedAdmissions = backendData.map(mapBackendAdmissionToAdmission);
      setAdmissions(mappedAdmissions);
      onQueueCountChange?.(mappedAdmissions.length);
      
    } catch (error) {
      console.error('Error fetching admissions:', error);
      onQueueCountChange?.(0);
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

  const formatWaitingTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const isOverdue = (admission: Admission) => {
    const waitingTime = getWaitingTime(admission);
    const maxWaitTime = EMERGENCY_LEVELS[admission.nivelEmergencia].maxWaitTime;
    return waitingTime > maxWaitTime;
  };

  const getWaitingTimeColor = (admission: Admission) => {
    const waitingTime = getWaitingTime(admission);
    const maxWaitTime = EMERGENCY_LEVELS[admission.nivelEmergencia].maxWaitTime;
    const percentage = (waitingTime / maxWaitTime) * 100;

    if (percentage >= 100) return 'text-destructive font-bold';
    if (percentage >= 80) return 'text-warning font-semibold';
    if (percentage >= 60) return 'text-muted-foreground font-medium';
    return 'text-muted-foreground';
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

              {/* <div className="flex items-center gap-2 text-sm pt-2 border-t">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Ingresó {formatDistanceToNow(new Date(admission.fechaIngreso), { addSuffix: true, locale: es })}
                </span>
                <span className={`ml-auto ${getWaitingTimeColor(admission)}`}>
                  ⏱️ {formatWaitingTime(getWaitingTime(admission))}
                </span>
              </div> */}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
