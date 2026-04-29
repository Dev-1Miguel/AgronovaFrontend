import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreateCultivoDto,
  Cultivo,
  UpdateCultivoDto,
  UpdateCultivoEstadoDto,
} from '../models/cultivo.model';

@Injectable({
  providedIn: 'root',
})
export class CultivosService {
  private readonly endpoint = `${environment.apiUrl}/cultivos`;

  constructor(private readonly http: HttpClient) {}

  getCultivos(): Observable<Cultivo[]> {
    return this.http.get<Cultivo[]>(this.endpoint);
  }

  getCultivoById(id: string): Observable<Cultivo> {
    return this.http.get<Cultivo>(`${this.endpoint}/${id}`);
  }

  createCultivo(cultivo: CreateCultivoDto): Observable<Cultivo> {
    return this.http.post<Cultivo>(this.endpoint, cultivo);
  }

  updateCultivo(id: string, cultivo: UpdateCultivoDto): Observable<Cultivo> {
    return this.http.put<Cultivo>(`${this.endpoint}/${id}`, cultivo);
  }

  updateCultivoEstado(id: string, estado: UpdateCultivoEstadoDto): Observable<Cultivo> {
    return this.http.put<Cultivo>(`${this.endpoint}/${id}/estado`, estado);
  }

  deleteCultivo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
