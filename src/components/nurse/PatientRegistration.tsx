import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { CreatePatientData } from '@/types/patient';

interface PatientRegistrationProps {
  onSuccess: () => void;
}

export const PatientRegistration = ({ onSuccess }: PatientRegistrationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [patientData, setPatientData] = useState<CreatePatientData>({
    cuil: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: new Date(),
    telefono: '',
    direccion: '',
    obraSocial: '',
    numeroAfiliado: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!patientData.cuil || patientData.cuil.length !== 11) {
      toast({
        title: "Error de validación",
        description: "El CUIL debe tener 11 dígitos",
        variant: "destructive",
      });
      return;
    }

    if (!patientData.nombre || !patientData.apellido) {
      toast({
        title: "Error de validación",
        description: "Nombre y apellido son obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Reemplazar con tu URL del backend
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/patients`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${user?.token}`,
      //   },
      //   body: JSON.stringify(patientData),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Error al registrar el paciente');
      // }
      //
      // const data = await response.json();

      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Paciente registrado",
        description: `${patientData.nombre} ${patientData.apellido} ha sido registrado exitosamente`,
      });

      // Limpiar formulario
      setPatientData({
        cuil: '',
        nombre: '',
        apellido: '',
        fechaNacimiento: new Date(),
        telefono: '',
        direccion: '',
        obraSocial: '',
        numeroAfiliado: '',
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el paciente. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Registrar Paciente
        </CardTitle>
        <CardDescription>
          Completa los datos del nuevo paciente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CUIL */}
          <div className="space-y-2">
            <Label htmlFor="cuil">CUIL *</Label>
            <Input
              id="cuil"
              type="text"
              maxLength={11}
              placeholder="20123456789"
              value={patientData.cuil}
              onChange={(e) => setPatientData({ ...patientData, cuil: e.target.value.replace(/\D/g, '') })}
              required
            />
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Juan"
                value={patientData.nombre}
                onChange={(e) => setPatientData({ ...patientData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                type="text"
                placeholder="Pérez"
                value={patientData.apellido}
                onChange={(e) => setPatientData({ ...patientData, apellido: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Fecha de Nacimiento */}
          <div className="space-y-2">
            <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
            <Input
              id="fechaNacimiento"
              type="date"
              value={patientData.fechaNacimiento.toISOString().split('T')[0]}
              onChange={(e) => setPatientData({ ...patientData, fechaNacimiento: new Date(e.target.value) })}
              required
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="1234567890"
              value={patientData.telefono}
              onChange={(e) => setPatientData({ ...patientData, telefono: e.target.value })}
            />
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              type="text"
              placeholder="Calle 123, Ciudad"
              value={patientData.direccion}
              onChange={(e) => setPatientData({ ...patientData, direccion: e.target.value })}
            />
          </div>

          {/* Obra Social */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="obraSocial">Obra Social</Label>
              <Input
                id="obraSocial"
                type="text"
                placeholder="OSDE"
                value={patientData.obraSocial}
                onChange={(e) => setPatientData({ ...patientData, obraSocial: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroAfiliado">Número de Afiliado</Label>
              <Input
                id="numeroAfiliado"
                type="text"
                placeholder="123456"
                value={patientData.numeroAfiliado}
                onChange={(e) => setPatientData({ ...patientData, numeroAfiliado: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar Paciente'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
