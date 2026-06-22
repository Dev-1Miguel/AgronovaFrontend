import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateVentaDto, Venta } from '../models/venta.model';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private readonly endpoint = `${environment.apiUrl}/ventas`;

  constructor(private readonly http: HttpClient) {}

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.endpoint);
  }

  getVentaById(id: string): Observable<Venta> {
    return this.http.get<Venta>(`${this.endpoint}/${id}`);
  }

  createVenta(venta: CreateVentaDto): Observable<Venta> {
    return this.http.post<Venta>(this.endpoint, venta);
  }

  anularVenta(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}

