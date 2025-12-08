import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Attention, BackendAttentionResponse, mapBackendAttention } from '@/types/attention';
import { History, FileText, Calendar, User, Stethoscope } from 'lucide-react';
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/urgencias/atencion`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar historial de atenciones');
      }

      const backendData: BackendAttentionResponse[] = await response.json();
      const mappedAttentions = backendData.map(mapBackendAttention);
      setAttentions(mappedAttentions);
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

              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  <span>Médico: {attention.medicoNombre}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>Enfermera: {attention.enfermeraNombre}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
