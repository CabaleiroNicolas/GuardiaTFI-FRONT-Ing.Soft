import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { CreatePatientData } from '@/types/patient';

interface PatientRegistrationProps {
  onSuccess: () => void;
}

export const PatientRegistration = ({ onSuccess }: PatientRegistrationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [obrasSociales, setObrasSociales] = useState<string[]>([]);
  const [isLoadingObrasSociales, setIsLoadingObrasSociales] = useState(true);

  useEffect(() => {
    fetchObrasSociales();
  }, []);

  const fetchObrasSociales = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/obras_sociales`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setObrasSociales(data);
      }
    } catch (error) {
      console.error('Error fetching obras sociales:', error);
    } finally {
      setIsLoadingObrasSociales(false);
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  const [patientData, setPatientData] = useState<CreatePatientData>({
    cuil: '',
    apellido: '',
    nombre: '',
    calle: '',
    numero: 0,
    localidad: '',
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

    if (!patientData.cuil || !/^(20|27)\d{8}\d$/.test(patientData.cuil)) {
      toast({
        title: "Error de validación",
        description: "El CUIL es inválido (Debe tener 11 dígitos y comenzar con 20 o 27)",
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pacientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify(patientData),
      });


      if (!response.ok) {
        if (response.status === 400) {
          const responseMessage = (await response.json()).message;

          if (responseMessage.includes('Obra Social')) {
            toast({
              title: "Obra Social invalida",
              description: "El paciente no se encuentra afiliado a la obra social seleccionada",
              variant: "destructive",
            });
            return;
          }
          else if (responseMessage.includes('Número de Afiliado')) {
            toast({
              title: "Número de afiliado invalido",
              description: "El paciente no esta vinculado al numero de afiliado",
              variant: "destructive",
            });
            return;
          }
          else if (responseMessage.includes('Paciente')) {
            toast({
              title: "Paciente ya registrado",
              description: "El CUIL ingresado ya corresponde a un paciente registrado.",
              variant: "destructive",
            });
            return;
          }
        }
      }

      toast({
        title: "Paciente registrado",
        description: `${patientData.nombre} ${patientData.apellido} ha sido registrado exitosamente`,
      });

      // Limpiar formulario
      setPatientData({
        cuil: '',
        apellido: '',
        nombre: '',
        calle: '',
        numero: 0,
        localidad: '',
        obraSocial: '',
        numeroAfiliado: '',
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al registrar el paciente. Intente nuevamente más tarde.",
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

          {/* Apellido y Nombre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label>Dirección *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  id="calle"
                  type="text"
                  placeholder="Calle"
                  value={patientData.calle}
                  onChange={(e) => setPatientData({ ...patientData, calle: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  id="numero"
                  type="number"
                  placeholder="Número"
                  value={patientData.numero || ''}
                  onChange={(e) => setPatientData({ ...patientData, numero: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Localidad */}
          <div className="space-y-2">
            <Label htmlFor="localidad">Localidad *</Label>
            <Input
              id="localidad"
              type="text"
              placeholder="Ciudad"
              value={patientData.localidad}
              onChange={(e) => setPatientData({ ...patientData, localidad: e.target.value })}
              required
            />
          </div>

          {/* Obra Social */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="obraSocial">Obra Social</Label>
              <Select
                value={patientData.obraSocial}
                onValueChange={(value) => setPatientData({ ...patientData, obraSocial: value })}
                disabled={isLoadingObrasSociales}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingObrasSociales ? "Cargando..." : "Seleccionar obra social"} />
                </SelectTrigger>
                <SelectContent>
                  {obrasSociales.map((obra) => (
                    <SelectItem key={obra} value={obra}>
                      {obra}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
