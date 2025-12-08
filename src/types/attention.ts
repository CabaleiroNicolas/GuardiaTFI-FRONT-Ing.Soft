export interface ClaimedPatient {
  ingresoId: string;
  patientId: string;
  patientName: string;
  cuil: string;
  fechaIngreso: Date;
  nivelEmergencia: string;
  informeIngreso: string;
  temperatura: number;
  frecCardiaca: number;
  frecRespiratoria: number;
  tensionArterial: string;
}

export interface Attention {
  id: number;
  informe: string;
  medicoNombre: string;
  enfermeraNombre: string;
  fechaAtencion: Date;
}

export interface CreateAttentionData {
  ingresoId: string;
  informe: string;
}

// Backend response for attention history
export interface BackendAttentionResponse {
  id: number;
  informe: string;
  medico_nombre: string;
  medico_apellido: string;
  enfermera_nombre: string;
  enfermera_apellido: string;
  fecha_atencion: string;
}

export const mapBackendAttention = (backend: BackendAttentionResponse): Attention => ({
  id: backend.id,
  informe: backend.informe,
  medicoNombre: `${backend.medico_nombre} ${backend.medico_apellido}`,
  enfermeraNombre: `${backend.enfermera_nombre} ${backend.enfermera_apellido}`,
  fechaAtencion: new Date(backend.fecha_atencion),
});
