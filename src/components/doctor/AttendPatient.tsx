import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ClaimedPatient, mapBackendClaimedPatient } from '@/types/attention';
import { EMERGENCY_LEVELS, EmergencyLevel } from '@/types/emergency';
import { UserCheck, Activity, Thermometer, FileText, Send, AlertCircle } from 'lucide-react';

interface AttendPatientProps {
  onAttentionComplete: () => void;
}

export const AttendPatient = ({ onAttentionComplete }: AttendPatientProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [claimedPatient, setClaimedPatient] = useState<ClaimedPatient | null>(null);
  const [isClaimingPatient, setIsClaimingPatient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [informe, setInforme] = useState('');

  const getLevelBadgeColor = (level: string) => {
    const normalizedLevel = level.toLowerCase().trim();
    if (normalizedLevel.includes('critica') || normalizedLevel.includes('critico')) {
      return 'bg-critical text-critical-foreground';
    }
    if (normalizedLevel === 'emergencia') {
      return 'bg-emergency text-emergency-foreground';
    }
    if (normalizedLevel === 'urgencia menor') {
      return 'bg-minor text-minor-foreground';
    }
    if (normalizedLevel === 'urgencia') {
      return 'bg-urgent text-urgent-foreground';
    }
    return 'bg-routine text-routine-foreground';
  };

  const handleClaimNextPatient = async () => {
    setIsClaimingPatient(true);
    try {
      // TODO: Reemplazar con endpoint real
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/urgencias/reclamar`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${user?.token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // 
      // if (!response.ok) {
      //   if (response.status === 404) {
      //     throw new Error('NO_PATIENTS');
      //   }
      //   throw new Error('Error al reclamar paciente');
      // }
      // 
      // const backendData = await response.json();
      // const mappedPatient = mapBackendClaimedPatient(backendData);
      // setClaimedPatient(mappedPatient);

      // Datos hardcodeados para pruebas
      const mockClaimedPatient: ClaimedPatient = {
        ingresoId: 'ing-001',
        patientId: '20123456781',
        patientName: 'Juan Pérez',
        cuil: '20123456781',
        fechaIngreso: new Date(),
        nivelEmergencia: 'Urgencia',
        informeIngreso: 'Paciente con dolor abdominal intenso',
        temperatura: 37.5,
        frecCardiaca: 85,
        frecRespiratoria: 18,
        tensionArterial: '120/80',
      };
      
      setClaimedPatient(mockClaimedPatient);
      toast({
        title: 'Paciente reclamado',
        description: `Ahora está atendiendo a ${mockClaimedPatient.patientName}`,
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

  const handleSubmitAttention = async () => {
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
      //     ingresoId: claimedPatient.ingresoId,
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

  if (!claimedPatient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Atender Paciente
          </CardTitle>
          <CardDescription>
            Reclame el próximo paciente en la lista de espera para comenzar la atención
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-center text-muted-foreground mb-4">
            <p>No hay paciente en atención actualmente.</p>
            <p className="text-sm">Presione el botón para reclamar el próximo paciente.</p>
          </div>
          <Button 
            size="lg" 
            onClick={handleClaimNextPatient}
            disabled={isClaimingPatient}
          >
            {isClaimingPatient ? 'Reclamando...' : 'Atender Próximo Paciente'}
          </Button>
        </CardContent>
      </Card>
    );
  }

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
        {/* Información del paciente */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{claimedPatient.patientName}</h3>
              <p className="text-sm text-muted-foreground">CUIL: {claimedPatient.cuil}</p>
            </div>
            <Badge className={getLevelBadgeColor(claimedPatient.nivelEmergencia)}>
              {claimedPatient.nivelEmergencia}
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Informe de ingreso:</span> {claimedPatient.informeIngreso}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">FC:</span> {claimedPatient.frecCardiaca} lpm
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">FR:</span> {claimedPatient.frecRespiratoria} rpm
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">TA:</span> {claimedPatient.tensionArterial}
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Temp:</span> {claimedPatient.temperatura}°C
            </div>
          </div>
        </div>

        {/* Formulario de atención */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="informe" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Informe de Atención *
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
                El informe de atención es obligatorio para finalizar la atención.
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
            onClick={handleSubmitAttention}
            disabled={isSubmitting || !informe.trim()}
          >
            {isSubmitting ? (
              'Registrando...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Confirmar Atención
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
