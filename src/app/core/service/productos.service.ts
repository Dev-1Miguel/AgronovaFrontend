import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateProductoDto, Producto, UpdateProductoDto } from '../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private readonly endpoint = `${environment.apiUrl}/productos`;

  constructor(private readonly http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.endpoint);
  }

  getProductoById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.endpoint}/${id}`);
  }

  createProducto(producto: CreateProductoDto): Observable<Producto> {
    return this.http.post<Producto>(this.endpoint, producto);
  }

  updateProducto(id: string, producto: UpdateProductoDto): Observable<Producto> {
    return this.http.put<Producto>(`${this.endpoint}/${id}`, producto);
  }

  deleteProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
