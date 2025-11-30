export interface Patient {
  id: string;
  cuil: string;
  nombre: string;
  apellido: string;
  calle: string;
  numero: number;
  localidad: string;
  obraSocial: string;
  numeroAfiliado: string;
}

export interface CreatePatientData {
  cuil: string;
  apellido: string;
  nombre: string;
  calle: string;
  numero: number;
  localidad: string;
  obraSocial: string;
  numeroAfiliado: string;
}
