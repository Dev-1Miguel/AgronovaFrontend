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

  createUbicacion(ubicacion: { nombre: string }): Observable<CatalogoReferencia> {
    return this.http.post<CatalogoReferencia>(`${this.endpoint}/ubicaciones`, ubicacion);
  }

  updateUbicacion(id: string, ubicacion: { nombre?: string }): Observable<CatalogoReferencia> {
    return this.http.put<CatalogoReferencia>(`${this.endpoint}/ubicaciones/${id}`, ubicacion);
  }

  deleteUbicacion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/ubicaciones/${id}`);
  }

  getTiposTarea(): Observable<CatalogoReferencia[]> {
    return this.http.get<CatalogoReferencia[]>(`${this.endpoint}/tipos-tarea`);
  }

  createTipoTarea(tipoTarea: { nombre: string }): Observable<CatalogoReferencia> {
    return this.http.post<CatalogoReferencia>(`${this.endpoint}/tipos-tarea`, tipoTarea);
  }

  updateTipoTarea(id: string, tipoTarea: { nombre?: string }): Observable<CatalogoReferencia> {
    return this.http.put<CatalogoReferencia>(`${this.endpoint}/tipos-tarea/${id}`, tipoTarea);
  }

  deleteTipoTarea(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/tipos-tarea/${id}`);
  }

  getTiposInsumo(): Observable<CatalogoReferencia[]> {
    return this.http.get<CatalogoReferencia[]>(`${this.endpoint}/tipos-insumo`);
  }

  createTipoInsumo(tipoInsumo: { nombre: string }): Observable<CatalogoReferencia> {
    return this.http.post<CatalogoReferencia>(`${this.endpoint}/tipos-insumo`, tipoInsumo);
  }

  updateTipoInsumo(id: string, tipoInsumo: { nombre?: string }): Observable<CatalogoReferencia> {
    return this.http.put<CatalogoReferencia>(`${this.endpoint}/tipos-insumo/${id}`, tipoInsumo);
  }

  deleteTipoInsumo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/tipos-insumo/${id}`);
  }
}