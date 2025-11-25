import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CreateAdmissionData, EmergencyLevel, EMERGENCY_LEVELS } from '@/types/emergency';
import { useAuth } from '@/contexts/AuthContext';

interface AdmissionFormProps {
  onSuccess: () => void;
}

export const AdmissionForm = ({ onSuccess }: AdmissionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateAdmissionData>({
    patientId: '',
    informe: '',
    nivelEmergencia: 'URGENCIA' as EmergencyLevel,
    temperatura: undefined,
    frecuenciaCardiaca: 0,
    frecuenciaRespiratoria: 0,
    tensionArterial: {
      sistolica: 0,
      diastolica: 0,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.patientId || !formData.informe) {
      toast({
        title: 'Error de validación',
        description: 'Complete todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    if (formData.frecuenciaCardiaca < 0) {
      toast({
        title: 'Error de validación',
        description: 'La frecuencia cardíaca no puede ser negativa',
        variant: 'destructive',
      });
      return;
    }

    if (formData.frecuenciaRespiratoria < 0) {
      toast({
        title: 'Error de validación',
        description: 'La frecuencia respiratoria no puede ser negativa',
        variant: 'destructive',
      });
      return;
    }

    if (formData.tensionArterial.sistolica < 0 || formData.tensionArterial.diastolica < 0) {
      toast({
        title: 'Error de validación',
        description: 'Los valores de tensión arterial no pueden ser negativos',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/admissions`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${user?.token}`,
      //   },
      //   body: JSON.stringify(formData),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Error al crear el ingreso');
      // }

      toast({
        title: 'Éxito',
        description: 'Ingreso registrado correctamente',
      });

      // Reset form
      setFormData({
        patientId: '',
        informe: '',
        nivelEmergencia: 'URGENCIA' as EmergencyLevel,
        temperatura: undefined,
        frecuenciaCardiaca: 0,
        frecuenciaRespiratoria: 0,
        tensionArterial: {
          sistolica: 0,
          diastolica: 0,
        },
      });

      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo registrar el ingreso',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Ingreso de Paciente</CardTitle>
        <CardDescription>
          Complete los datos del paciente para su admisión en urgencias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">ID del Paciente *</Label>
              <Input
                id="patientId"
                placeholder="Buscar o crear paciente"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nivelEmergencia">Nivel de Emergencia *</Label>
              <Select
                value={formData.nivelEmergencia}
                onValueChange={(value) => setFormData({ ...formData, nivelEmergencia: value as EmergencyLevel })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EMERGENCY_LEVELS).map(([key, level]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-${level.color}`} />
                        {level.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frecuenciaCardiaca">Frecuencia Cardíaca (lpm) *</Label>
              <Input
                id="frecuenciaCardiaca"
                type="number"
                min="0"
                step="0.1"
                placeholder="70"
                value={formData.frecuenciaCardiaca || ''}
                onChange={(e) => setFormData({ ...formData, frecuenciaCardiaca: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frecuenciaRespiratoria">Frecuencia Respiratoria (rpm) *</Label>
              <Input
                id="frecuenciaRespiratoria"
                type="number"
                min="0"
                step="0.1"
                placeholder="16"
                value={formData.frecuenciaRespiratoria || ''}
                onChange={(e) => setFormData({ ...formData, frecuenciaRespiratoria: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperatura">Temperatura (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                placeholder="36.5"
                value={formData.temperatura || ''}
                onChange={(e) => setFormData({ ...formData, temperatura: parseFloat(e.target.value) || undefined })}
              />
            </div>

            <div className="space-y-2">
              <Label>Tensión Arterial (mmHg) *</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Sistólica"
                  value={formData.tensionArterial.sistolica || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    tensionArterial: { ...formData.tensionArterial, sistolica: parseFloat(e.target.value) || 0 }
                  })}
                  required
                />
                <span className="text-muted-foreground">/</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="Diastólica"
                  value={formData.tensionArterial.diastolica || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    tensionArterial: { ...formData.tensionArterial, diastolica: parseFloat(e.target.value) || 0 }
                  })}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Ejemplo: 120/80
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="informe">Informe *</Label>
            <Textarea
              id="informe"
              placeholder="Describa el motivo de consulta y síntomas del paciente"
              value={formData.informe}
              onChange={(e) => setFormData({ ...formData, informe: e.target.value })}
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar Ingreso'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
