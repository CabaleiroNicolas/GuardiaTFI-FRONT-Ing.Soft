import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Attention, mapBackendAttention } from '@/types/attention';
import { History, User, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const AttentionHistory = () => {
  const { user } = useAuth();
  const [attentions, setAttentions] = useState<Attention[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAttentions();
  }, []);

  const fetchAttentions = async () => {
    try {
      // TODO: Reemplazar con endpoint real
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/atenciones`, {
      //   headers: {
      //     'Authorization': `Bearer ${user?.token}`,
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error al cargar historial de atenciones');
      // }
      // 
      // const backendData = await response.json();
      // const mappedAttentions = backendData.map(mapBackendAttention);
      // setAttentions(mappedAttentions);

      // Datos hardcodeados para pruebas
      const mockAttentions: Attention[] = [
        {
          id: 'att-001',
          ingresoId: 'ing-001',
          patientName: 'María García',
          patientCuil: '27234567892',
          informe: 'Paciente con cuadro gripal. Se indica reposo y medicación sintomática.',
          medicoId: '20111111111',
          medicoNombre: 'Dr. Carlos López',
          fechaAtencion: new Date('2025-12-03T10:30:00'),
        },
        {
          id: 'att-002',
          ingresoId: 'ing-002',
          patientName: 'Roberto Sánchez',
          patientCuil: '20345678903',
          informe: 'Traumatismo leve en tobillo derecho. Se indica radiografía y reposo.',
          medicoId: '20111111111',
          medicoNombre: 'Dr. Carlos López',
          fechaAtencion: new Date('2025-12-03T09:15:00'),
        },
        {
          id: 'att-003',
          ingresoId: 'ing-003',
          patientName: 'Ana Martínez',
          patientCuil: '27456789014',
          informe: 'Cefalea tensional. Se indica analgésicos y control en 48hs si persiste.',
          medicoId: '20111111111',
          medicoNombre: 'Dr. Carlos López',
          fechaAtencion: new Date('2025-12-02T16:45:00'),
        },
      ];

      setAttentions(mockAttentions);
    } catch (error) {
      console.error('Error fetching attentions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Cargando historial de atenciones...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Historial de Atenciones
        </CardTitle>
        <CardDescription>
          {attentions.length} atención(es) registrada(s)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {attentions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay atenciones registradas
          </p>
        ) : (
          attentions.map((attention) => (
            <div key={attention.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold">{attention.patientName}</h3>
                    <Badge variant="outline" className="text-xs">
                      {attention.patientCuil}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {format(attention.fechaAtencion, "dd/MM/yyyy HH:mm", { locale: es })}
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm">{attention.informe}</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Atendido por: {attention.medicoNombre}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
