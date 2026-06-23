export interface InsumoAsignado {
  idInsumo: string;
  cantidad: number;
}

export interface Tarea {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  idCultivo: string;
  idTipoTarea: string;
  idAgricultores?: string[];
  insumosAsignados?: InsumoAsignado[];
  descripcion: string;
  estado?: string;
}

export interface CreateTareaDto {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  idCultivo: string;
  idTipoTarea: string;
  descripcion: string;
  idAgricultores?: string[];
  insumosAsignados?: InsumoAsignado[];
}

export interface UpdateTareaDto {
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
  idCultivo?: string;
  idTipoTarea?: string;
  descripcion?: string;
  idAgricultores?: string[];
  insumosAsignados?: InsumoAsignado[];
}

export interface UpdateTareaEstadoDto {
  estado: string;
}
