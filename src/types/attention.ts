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
  id: string;
  ingresoId: string;
  patientName: string;
  patientCuil: string;
  informe: string;
  medicoId: string;
  medicoNombre: string;
  fechaAtencion: Date;
}

export interface CreateAttentionData {
  ingresoId: string;
  informe: string;
}

// Backend response for claimed patient (to be adjusted based on actual response)
export interface BackendClaimedPatientResponse {
  id: string;
  paciente: {
    cuil: string;
    nombre: string;
    apellido: string;
  };
  fechaIngreso: string;
  nivelEmergencia: string;
  informe: string;
  signosVitales: {
    temperatura: string;
    frecCardiaca: string;
    frecRespiratoria: string;
    tensionArterial: {
      frecSistolica: string;
      frecDiastolica: string;
    };
  };
}

// Backend response for attention history (to be adjusted based on actual response)
export interface BackendAttentionResponse {
  id: string;
  ingreso: {
    id: string;
    paciente: {
      cuil: string;
      nombre: string;
      apellido: string;
    };
  };
  informe: string;
  medico: {
    cuil: string;
    nombre: string;
    apellido: string;
  };
  fechaAtencion: string;
}

export const mapBackendClaimedPatient = (backend: BackendClaimedPatientResponse): ClaimedPatient => ({
  ingresoId: backend.id,
  patientId: backend.paciente.cuil,
  patientName: `${backend.paciente.nombre} ${backend.paciente.apellido}`,
  cuil: backend.paciente.cuil,
  fechaIngreso: new Date(backend.fechaIngreso),
  nivelEmergencia: backend.nivelEmergencia,
  informeIngreso: backend.informe,
  temperatura: parseFloat(backend.signosVitales.temperatura),
  frecCardiaca: parseFloat(backend.signosVitales.frecCardiaca),
  frecRespiratoria: parseFloat(backend.signosVitales.frecRespiratoria),
  tensionArterial: `${backend.signosVitales.tensionArterial.frecSistolica}/${backend.signosVitales.tensionArterial.frecDiastolica}`,
});

export const mapBackendAttention = (backend: BackendAttentionResponse): Attention => ({
  id: backend.id,
  ingresoId: backend.ingreso.id,
  patientName: `${backend.ingreso.paciente.nombre} ${backend.ingreso.paciente.apellido}`,
  patientCuil: backend.ingreso.paciente.cuil,
  informe: backend.informe,
  medicoId: backend.medico.cuil,
  medicoNombre: `${backend.medico.nombre} ${backend.medico.apellido}`,
  fechaAtencion: new Date(backend.fechaAtencion),
});
