export interface VentaDetalle {
  idProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  nombreProducto?: string;
}

export interface Venta {
  id?: string;
  fecha: string;
  cliente: string;
  total: number;
  detalles: VentaDetalle[];
  estado?: string;
}

export interface CreateVentaDto {
  fecha: string;
  cliente: string;
  total: number;
  detalles: VentaDetalle[];
}

