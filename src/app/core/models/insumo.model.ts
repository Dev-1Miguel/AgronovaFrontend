export interface Insumo {
  id: string;
  idTipoInsumo: string;
  descripcion: string;
  cantidad: number;
  unidadMedida: string;
  estado?: string;
}

export interface CreateInsumoDto {
  idTipoInsumo: string;
  descripcion: string;
  cantidad: number;
  unidadMedida: string;
}

export interface UpdateInsumoDto {
  idTipoInsumo?: string;
  descripcion?: string;
  cantidad?: number;
  unidadMedida?: string;
}
