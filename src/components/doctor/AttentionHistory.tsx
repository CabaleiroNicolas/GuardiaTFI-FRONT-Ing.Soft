import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Attention, BackendAttentionResponse, mapBackendAttention } from '@/types/attention';
import { History, FileText, Calendar, User, Stethoscope, Search, UserRound } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';

export const AttentionHistory = () => {
  const { user } = useAuth();
  const [attentions, setAttentions] = useState<Attention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCuil, setSearchCuil] = useState('');

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

  const filteredAttentions = useMemo(() => {
    if (!searchCuil.trim()) {
      return attentions;
    }
    return attentions.filter(attention => 
      attention.pacienteCuil.includes(searchCuil.trim())
    );
  }, [attentions, searchCuil]);

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
          {filteredAttentions.length} de {attentions.length} atención(es)
        </CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por CUIL del paciente..."
            value={searchCuil}
            onChange={(e) => setSearchCuil(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredAttentions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {searchCuil ? 'No se encontraron atenciones para ese CUIL' : 'No hay atenciones registradas'}
          </p>
        ) : (
          filteredAttentions.map((attention) => (
            <div key={attention.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <UserRound className="w-4 h-4 text-primary" />
                  <span className="font-medium">{attention.pacienteNombre}</span>
                  <span className="text-xs text-muted-foreground">({attention.pacienteCuil})</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatInTimeZone(new Date(attention.fechaAtencion), 'America/Argentina/Buenos_Aires', "dd/MM/yyyy HH:mm", { locale: es })}
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
