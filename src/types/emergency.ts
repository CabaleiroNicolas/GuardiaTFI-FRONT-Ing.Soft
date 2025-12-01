export type EmergencyLevel = 'CRITICA' | 'EMERGENCIA' | 'URGENCIA' | 'URGENCIA_MENOR' | 'SIN_URGENCIA';

export type AdmissionStatus = 'PENDIENTE' | 'EN_PROCESO' | 'FINALIZADO';

export interface EmergencyLevelInfo {
  name: string;
  color: 'critical' | 'emergency' | 'urgent' | 'minor' | 'routine';
  maxWaitTime: number; // in minutes
}

export const EMERGENCY_LEVELS: Record<EmergencyLevel, EmergencyLevelInfo> = {
  CRITICA: {
    name: 'Crítica',
    color: 'critical',
    maxWaitTime: 5,
  },
  EMERGENCIA: {
    name: 'Emergencia',
    color: 'emergency',
    maxWaitTime: 30,
  },
  URGENCIA: {
    name: 'Urgencia',
    color: 'urgent',
    maxWaitTime: 60,
  },
  URGENCIA_MENOR: {
    name: 'Urgencia Menor',
    color: 'minor',
    maxWaitTime: 120,
  },
  SIN_URGENCIA: {
    name: 'Sin Urgencia',
    color: 'routine',
    maxWaitTime: 240,
  },
};

export interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  fechaIngreso: Date;
  informe: string;
  nivelEmergencia: EmergencyLevel;
  estado: AdmissionStatus;
  temperatura: number;
  frecCardiaca: number;
  frecRespiratoria: number;
  tensionArterial: string;
  enfermeraId: string;
  enfermeraNombre: string;
  isOverdue?: boolean;
}

export interface CreateAdmissionData {
  cuil: string;
  temperatura: number;
  frecCardiaca: number;
  frecRespiratoria: number;
  tensionArterial: string;
  nivelEmergencia: string;
  informe: string;
}

// Backend response interfaces
export interface BackendAdmissionResponse {
  enfermera: {
    email: string;
    password: string;
    role: string;
    cuil: string;
    apellido: string;
    nombre: string;
  };
  estado: string;
  fechaIngreso: string;
  informe: string;
  nivelEmergencia: string;
  paciente: {
    apellido: string;
    cuil: string;
    domicilio: {
      calle: string;
      numero: string;
      localidad: string;
    };
    nombre: string;
    obraSocial: {
      numeroAfiliado: string | null;
      obraSocial: {
        id: number | null;
        nombre: string;
      };
    };
  };
  signosVitales: {
    frecCardiaca: string;
    frecRespiratoria: string;
    temperatura: string;
    tensionArterial: {
      frecDiastolica: string;
      frecSistolica: string;
    };
  };
}

// Helper function to map backend response to frontend Admission type
export const mapBackendAdmissionToAdmission = (backendAdmission: BackendAdmissionResponse): Admission => {
  // Normalize the emergency level string to handle variations
  const normalizeEmergencyLevel = (level: string): EmergencyLevel => {
    const normalized = level.toLowerCase().trim();
    
    if (normalized.includes('critica') || normalized.includes('critico')) {
      return 'CRITICA';
    }
    if (normalized === 'emergencia') {
      return 'EMERGENCIA';
    }
    if (normalized === 'urgencia menor') {
      return 'URGENCIA_MENOR';
    }
    if (normalized === 'urgencia') {
      return 'URGENCIA';
    }
    if (normalized === 'sin urgencia') {
      return 'SIN_URGENCIA';
    }
    
    // Default fallback
    return 'SIN_URGENCIA';
  };

  const nivelEmergencia = normalizeEmergencyLevel(backendAdmission.nivelEmergencia);

  return {
    id: backendAdmission.paciente.cuil, // Using CUIL as ID since backend doesn't provide admission ID
    patientId: backendAdmission.paciente.cuil,
    patientName: `${backendAdmission.paciente.nombre} ${backendAdmission.paciente.apellido}`,
    fechaIngreso: new Date(backendAdmission.fechaIngreso),
    informe: backendAdmission.informe,
    nivelEmergencia,
    estado: backendAdmission.estado as AdmissionStatus,
    temperatura: parseFloat(backendAdmission.signosVitales.temperatura),
    frecCardiaca: parseFloat(backendAdmission.signosVitales.frecCardiaca),
    frecRespiratoria: parseFloat(backendAdmission.signosVitales.frecRespiratoria),
    tensionArterial: `${backendAdmission.signosVitales.tensionArterial.frecSistolica}/${backendAdmission.signosVitales.tensionArterial.frecDiastolica}`,
    enfermeraId: backendAdmission.enfermera.cuil,
    enfermeraNombre: `${backendAdmission.enfermera.nombre} ${backendAdmission.enfermera.apellido}`,
  };
};
