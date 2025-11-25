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

export interface BloodPressure {
  sistolica: number; // mmHg
  diastolica: number; // mmHg
}

export interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  fechaIngreso: Date;
  informe: string;
  nivelEmergencia: EmergencyLevel;
  estado: AdmissionStatus;
  temperatura?: number; // Celsius
  frecuenciaCardiaca: number; // lpm (latidos por minuto)
  frecuenciaRespiratoria: number; // rpm (respiraciones por minuto)
  tensionArterial: BloodPressure;
  enfermeraId: string;
  enfermeraNombre: string;
}

export interface CreateAdmissionData {
  patientId: string;
  informe: string;
  nivelEmergencia: EmergencyLevel;
  temperatura?: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  tensionArterial: BloodPressure;
}
