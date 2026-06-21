export interface Tarea {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  idCultivo: string;
  idTipoTarea: string;
  idAgricultores?: string[];
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
}

export interface UpdateTareaDto {
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
  idCultivo?: string;
  idTipoTarea?: string;
  descripcion?: string;
  idAgricultores?: string[];
}

export interface UpdateTareaEstadoDto {
  estado: string;
}
