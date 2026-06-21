import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateInsumoDto, Insumo, UpdateInsumoDto } from '../models/insumo.model';

@Injectable({
  providedIn: 'root',
})
export class InsumosService {
  private readonly endpoint = `${environment.apiUrl}/insumos`;

  constructor(private readonly http: HttpClient) {}

  getInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.endpoint);
  }

  getInsumoById(id: string): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.endpoint}/${id}`);
  }

  createInsumo(insumo: CreateInsumoDto): Observable<Insumo> {
    return this.http.post<Insumo>(this.endpoint, insumo);
  }

  updateInsumo(id: string, insumo: UpdateInsumoDto): Observable<Insumo> {
    return this.http.put<Insumo>(`${this.endpoint}/${id}`, insumo);
  }

  deleteInsumo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
