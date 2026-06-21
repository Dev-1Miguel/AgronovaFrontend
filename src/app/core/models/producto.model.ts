export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  cantidadStock: number;
  precioCaja: number;
  idCultivo: string;
  estado?: string;
}

export interface CreateProductoDto {
  nombre: string;
  descripcion?: string;
  cantidadStock: number;
  precioCaja: number;
  idCultivo: string;
}

export interface UpdateProductoDto {
  nombre: string;
  descripcion?: string;
  cantidadStock: number;
  precioCaja: number;
  idCultivo: string;
}
