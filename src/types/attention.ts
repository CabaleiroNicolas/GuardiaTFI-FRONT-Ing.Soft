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
  pacienteNombre: string;
  pacienteCuil: string;
  fechaAtencion: string; // Keep as ISO string for timezone formatting
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
  paciente_nombre: string;
  paciente_apellido: string;
  paciente_cuil: string;
  fecha_atencion: string;
}

export const mapBackendAttention = (backend: BackendAttentionResponse): Attention => ({
  id: backend.id,
  informe: backend.informe,
  medicoNombre: `${backend.medico_nombre} ${backend.medico_apellido}`,
  enfermeraNombre: `${backend.enfermera_nombre} ${backend.enfermera_apellido}`,
  pacienteNombre: `${backend.paciente_nombre} ${backend.paciente_apellido}`,
  pacienteCuil: backend.paciente_cuil,
  fechaAtencion: backend.fecha_atencion, // Keep as ISO string
});
