import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CatalogoReferencia } from '../models/cultivo.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  private readonly endpoint = `${environment.apiUrl}/catalogos`;

  constructor(private readonly http: HttpClient) {}

  getCategoriasCultivo(): Observable<CatalogoReferencia[]> {
    return this.http.get<CatalogoReferencia[]>(`${this.endpoint}/categorias-cultivo`);
  }

  createCategoriaCultivo(categoria: { nombre: string }): Observable<CatalogoReferencia> {
    return this.http.post<CatalogoReferencia>(`${this.endpoint}/categorias-cultivo`, categoria);
  }

  updateCategoriaCultivo(id: string, categoria: { nombre?: string }): Observable<CatalogoReferencia> {
    return this.http.put<CatalogoReferencia>(`${this.endpoint}/categorias-cultivo/${id}`, categoria);
  }

  deleteCategoriaCultivo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/categorias-cultivo/${id}`);
  }

  getUbicaciones(): Observable<CatalogoReferencia[]> {
    return this.http.get<CatalogoReferencia[]>(`${this.endpoint}/ubicaciones`);
  }

  getTiposTarea(): Observable<CatalogoReferencia[]> {
    return this.http.get<CatalogoReferencia[]>(`${this.endpoint}/tipos-tarea`);
  }

  getTiposInsumo(): Observable<CatalogoReferencia[]> {
    return this.http.get<CatalogoReferencia[]>(`${this.endpoint}/tipos-insumo`);
  }
}
