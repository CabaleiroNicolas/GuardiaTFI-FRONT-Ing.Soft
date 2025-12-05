import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Admission, BackendAdmissionResponse, mapBackendAdmissionToAdmission, EMERGENCY_LEVELS } from '@/types/emergency';
import { UserCheck, Activity, Thermometer, FileText, CheckCircle, AlertCircle, Clock, User, Loader2 } from 'lucide-react';
import { differenceInMinutes } from 'date-fns';

interface AttendPatientProps {
  onAttentionComplete: () => void;
  onPatientClaimed: () => void;
  queueCount: number;
}

export const AttendPatient = ({ onAttentionComplete, onPatientClaimed, queueCount }: AttendPatientProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [claimedPatient, setClaimedPatient] = useState<Admission | null>(null);
  const [isClaimingPatient, setIsClaimingPatient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingClaimed, setIsLoadingClaimed] = useState(true);
  const [informe, setInforme] = useState('');

  // Verificar si hay un paciente previamente reclamado al cargar
  useEffect(() => {
    const fetchClaimedPatient = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/urgencias/reclamado`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al verificar paciente reclamado');
        }

        const data = await response.json();

        console.log(response)
        if (data) {
          const mappedPatient = mapBackendAdmissionToAdmission(data as BackendAdmissionResponse);
          setClaimedPatient(mappedPatient);
          toast({
            title: 'Paciente en proceso',
            description: `Tiene un paciente pendiente de atención: ${mappedPatient.patientName}`,
          });
        }

      } catch (error) {
        console.error('Error al verificar paciente reclamado:', error);
      } finally {
        setIsLoadingClaimed(false);
      }
    };

    fetchClaimedPatient();
  }, [user?.token]);

  const formatWaitingTime = (fechaIngreso: Date): string => {
    const now = new Date();
    const minutes = differenceInMinutes(now, fechaIngreso);

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}min`;
  };

  const getWaitingTimeColor = (fechaIngreso: Date, nivelEmergencia: string): string => {
    const now = new Date();
    const minutes = differenceInMinutes(now, fechaIngreso);
    const levelInfo = EMERGENCY_LEVELS[nivelEmergencia as keyof typeof EMERGENCY_LEVELS];

    if (!levelInfo) return 'text-muted-foreground';

    const maxWait = levelInfo.maxWaitTime;
    const percentageUsed = (minutes / maxWait) * 100;

    if (percentageUsed >= 100) {
      return 'text-destructive font-semibold';
    }
    if (percentageUsed >= 75) {
      return 'text-warning font-medium';
    }
    return 'text-muted-foreground';
  };

  const getLevelBadgeColor = (level: string) => {
    const levelInfo = EMERGENCY_LEVELS[level as keyof typeof EMERGENCY_LEVELS];
    if (!levelInfo) return 'bg-routine text-routine-foreground';

    const colorMap = {
      critical: 'bg-critical text-critical-foreground',
      emergency: 'bg-emergency text-emergency-foreground',
      urgent: 'bg-urgent text-urgent-foreground',
      minor: 'bg-minor text-minor-foreground',
      routine: 'bg-routine text-routine-foreground',
    };

    return colorMap[levelInfo.color];
  };

  const handleClaimNextPatient = async () => {
    setIsClaimingPatient(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/urgencias/reclamar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('NO_PATIENTS');
        }
        throw new Error('Error al reclamar paciente');
      }

      const backendData: BackendAdmissionResponse = await response.json();
      const mappedPatient = mapBackendAdmissionToAdmission(backendData);
      setClaimedPatient(mappedPatient);

      // Refrescar la cola de espera para quitar al paciente reclamado
      onPatientClaimed();

      toast({
        title: 'Paciente reclamado',
        description: `Ahora está atendiendo a ${mappedPatient.patientName}`,
      });
    } catch (error: any) {
      if (error.message === 'NO_PATIENTS') {
        toast({
          title: 'Sin pacientes',
          description: 'No hay pacientes en la lista de espera',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo reclamar el próximo paciente',
          variant: 'destructive',
        });
      }
    } finally {
      setIsClaimingPatient(false);
    }
  };

  const handleMarkAsAttended = async () => {
    if (!informe.trim()) {
      toast({
        title: 'Error de validación',
        description: 'El informe de atención es obligatorio',
        variant: 'destructive',
      });
      return;
    }

    if (!claimedPatient) return;

    setIsSubmitting(true);
    try {
      // TODO: Reemplazar con endpoint real
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/atenciones`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${user?.token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ingresoId: claimedPatient.id,
      //     informe: informe.trim(),
      //   }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error al registrar atención');
      // }

      // Simular éxito
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: 'Atención registrada',
        description: `La atención de ${claimedPatient.patientName} ha sido registrada exitosamente`,
      });

      // Limpiar estado y notificar al padre
      setClaimedPatient(null);
      setInforme('');
      onAttentionComplete();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo registrar la atención',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAttention = () => {
    setClaimedPatient(null);
    setInforme('');
  };

  const hasPatients = queueCount > 0;

  // Mostrar loader mientras se verifica si hay paciente reclamado
  if (isLoadingClaimed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Atender Paciente
          </CardTitle>
          <CardDescription>
            Verificando pacientes en proceso...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </CardContent>
      </Card>
    );
  }

  if (!claimedPatient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Atender Paciente
          </CardTitle>
          <CardDescription>
            {hasPatients
              ? 'Reclame el próximo paciente en la lista de espera para comenzar la atención'
              : 'No hay pacientes en la cola de espera'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          {hasPatients ? (
            <>
              <div className="text-center text-muted-foreground mb-4">
                <p>No hay paciente en atención actualmente.</p>
                <p className="text-sm">Hay {queueCount} paciente(s) esperando. Presione el botón para reclamar el próximo.</p>
              </div>
              <Button
                size="lg"
                onClick={handleClaimNextPatient}
                disabled={isClaimingPatient}
              >
                {isClaimingPatient ? 'Reclamando...' : 'Atender Próximo Paciente'}
              </Button>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-medium">No hay pacientes en espera</p>
              <p className="text-sm">La cola de espera está vacía. Los nuevos ingresos aparecerán automáticamente.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const levelInfo = EMERGENCY_LEVELS[claimedPatient.nivelEmergencia];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Atención en Curso
        </CardTitle>
        <CardDescription>
          Complete el informe de atención para finalizar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información del paciente - mismo estilo que WaitingQueue */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{claimedPatient.patientName}</h3>
                <p className="text-sm text-muted-foreground">CUIL: {claimedPatient.patientId}</p>
              </div>
            </div>
            <Badge className={getLevelBadgeColor(claimedPatient.nivelEmergencia)}>
              {levelInfo?.name || claimedPatient.nivelEmergencia}
            </Badge>
          </div>

          {/* Tiempo de espera */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tiempo en espera:</span>
            <span className={`text-sm ${getWaitingTimeColor(claimedPatient.fechaIngreso, claimedPatient.nivelEmergencia)}`}>
              {formatWaitingTime(claimedPatient.fechaIngreso)}
            </span>
            {levelInfo && (
              <span className="text-xs text-muted-foreground">
                (máx. {levelInfo.maxWaitTime} min)
              </span>
            )}
          </div>

          {/* Signos vitales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted/50 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Temperatura</p>
                <p className="font-medium">{claimedPatient.temperatura}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Frec. Cardíaca</p>
                <p className="font-medium">{claimedPatient.frecCardiaca} lpm</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Frec. Respiratoria</p>
                <p className="font-medium">{claimedPatient.frecRespiratoria} rpm</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Tensión Arterial</p>
                <p className="font-medium">{claimedPatient.tensionArterial}</p>
              </div>
            </div>
          </div>

          {/* Informe de ingreso */}
          <div className="space-y-1">
            <p className="text-sm font-medium flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Informe de ingreso:
            </p>
            <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
              {claimedPatient.informe}
            </p>
          </div>

          {/* Enfermera que registró */}
          <p className="text-xs text-muted-foreground">
            Registrado por: {claimedPatient.enfermeraNombre}
          </p>
        </div>

        {/* Formulario de atención */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="informe" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Informe Final de Atención *
            </Label>
            <Textarea
              id="informe"
              placeholder="Describa el diagnóstico, tratamiento y observaciones..."
              value={informe}
              onChange={(e) => setInforme(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          {!informe.trim() && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                El informe de atención es obligatorio para marcar como atendido.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancelAttention}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1"
            onClick={handleMarkAsAttended}
            disabled={isSubmitting || !informe.trim()}
          >
            {isSubmitting ? (
              'Registrando...'
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar como Atendido
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
