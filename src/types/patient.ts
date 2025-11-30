export interface Patient {
  id: string;
  cuil: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  telefono?: string;
  direccion?: string;
  obraSocial?: string;
  numeroAfiliado?: string;
}

export interface CreatePatientData {
  cuil: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  telefono?: string;
  direccion?: string;
  obraSocial?: string;
  numeroAfiliado?: string;
}
