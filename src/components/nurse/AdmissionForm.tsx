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
  const [patientCuil, setPatientCuil] = useState('');
  
  const [formData, setFormData] = useState<CreateAdmissionData>({
    cuil: '',
    informe: '',
    nivelEmergencia: 'URGENCIA',
    temperatura: 0,
    frecCardiaca: 0,
    frecRespiratoria: 0,
    tensionArterial: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!patientCuil || patientCuil.length !== 11) {
      toast({
        title: 'Error de validación',
        description: 'El CUIL del paciente debe tener 11 dígitos',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.informe || !formData.tensionArterial) {
      toast({
        title: 'Error de validación',
        description: 'Complete todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    if (formData.frecCardiaca < 0 || formData.frecRespiratoria < 0 || formData.temperatura < 0) {
      toast({
        title: 'Error de validación',
        description: 'Los valores no pueden ser negativos',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const admissionData = {
        ...formData,
        cuil: patientCuil,
      };

      // TODO: Descomentar cuando conectes el backend
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/urgencias`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${user?.token}`,
      //   },
      //   body: JSON.stringify(admissionData),
      // });
      //
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   if (response.status === 400 && errorData.message?.includes('paciente')) {
      //     toast({
      //       title: "Paciente no registrado",
      //       description: "El CUIL ingresado no corresponde a un paciente registrado. Registra al paciente primero en la pestaña 'Registrar Paciente'.",
      //       variant: "destructive",
      //     });
      //     setIsLoading(false);
      //     return;
      //   }
      //   throw new Error('Error al registrar el ingreso');
      // }

      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Éxito',
        description: 'Ingreso registrado correctamente',
      });

      // Reset form
      setPatientCuil('');
      setFormData({
        cuil: '',
        informe: '',
        nivelEmergencia: 'URGENCIA',
        temperatura: 0,
        frecCardiaca: 0,
        frecRespiratoria: 0,
        tensionArterial: '',
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
          {/* CUIL del Paciente */}
          <div className="space-y-2">
            <Label htmlFor="patientCuil">CUIL del Paciente *</Label>
            <Input
              id="patientCuil"
              type="text"
              maxLength={11}
              placeholder="20123456789"
              value={patientCuil}
              onChange={(e) => setPatientCuil(e.target.value.replace(/\D/g, ''))}
              required
            />
            <p className="text-xs text-muted-foreground">
              El paciente debe estar registrado previamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="nivelEmergencia">Nivel de Emergencia *</Label>
              <Select
                value={formData.nivelEmergencia}
                onValueChange={(value) => setFormData({ ...formData, nivelEmergencia: value })}
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
              <Label htmlFor="frecCardiaca">Frecuencia Cardíaca (lpm) *</Label>
              <Input
                id="frecCardiaca"
                type="number"
                min="0"
                step="0.1"
                placeholder="70"
                value={formData.frecCardiaca || ''}
                onChange={(e) => setFormData({ ...formData, frecCardiaca: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frecRespiratoria">Frecuencia Respiratoria (rpm) *</Label>
              <Input
                id="frecRespiratoria"
                type="number"
                min="0"
                step="0.1"
                placeholder="16"
                value={formData.frecRespiratoria || ''}
                onChange={(e) => setFormData({ ...formData, frecRespiratoria: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperatura">Temperatura (°C) *</Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                placeholder="36.5"
                value={formData.temperatura || ''}
                onChange={(e) => setFormData({ ...formData, temperatura: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tensionArterial">Tensión Arterial (mmHg) *</Label>
              <Input
                id="tensionArterial"
                type="text"
                placeholder="120/80"
                value={formData.tensionArterial}
                onChange={(e) => setFormData({ ...formData, tensionArterial: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Formato: sistólica/diastólica (ejemplo: 120/80)
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
