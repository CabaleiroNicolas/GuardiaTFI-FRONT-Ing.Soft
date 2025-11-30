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
