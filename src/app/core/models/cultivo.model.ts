export interface Cultivo {
  id: string;
  nombre: string;
  idCategoria?: string | null;
  idUbicacion?: string | null;
  categoria?: CatalogoReferencia | string | null;
  ubicacion?: CatalogoReferencia | string | null;
  estado?: string;
}

export interface CatalogoReferencia {
  id?: string;
  nombre?: string;
  estado?: string;
}

export interface CreateCultivoDto {
  nombre: string;
  idCategoria: string;
  idUbicacion: string;
  estado: string;
}

export interface UpdateCultivoDto {
  nombre?: string;
  idCategoria?: string;
  idUbicacion?: string;
}

export interface UpdateCultivoEstadoDto {
  estado: string;
}
