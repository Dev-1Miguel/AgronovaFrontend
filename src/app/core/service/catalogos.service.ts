import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CatalogoReferencia } from '../models/cultivo.model';

export type CatalogoTipo = 'categorias-cultivo' | 'tipos-insumo' | 'tipos-tarea' | 'ubicaciones';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  private readonly endpoint = `${environment.apiUrl}/catalogos`;

  constructor(private readonly http: HttpClient) {}

  obtenerPorTipo(tipo: CatalogoTipo): Observable<CatalogoReferencia[]> {
    return this.http.get<CatalogoReferencia[]>(`${this.endpoint}/${tipo}`);
  }

  crearCatalogo(tipo: CatalogoTipo, payload: { nombre: string; estado?: boolean }): Observable<CatalogoReferencia> {
    return this.http.post<CatalogoReferencia>(`${this.endpoint}/${tipo}`, payload);
  }

  actualizarCatalogo(tipo: CatalogoTipo, id: string, payload: { nombre?: string; estado?: boolean }): Observable<CatalogoReferencia> {
    return this.http.put<CatalogoReferencia>(`${this.endpoint}/${tipo}/${id}`, payload);
  }

  eliminarCatalogo(tipo: CatalogoTipo, id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${tipo}/${id}`);
  }

  getCategoriasCultivo(): Observable<CatalogoReferencia[]> {
    return this.obtenerPorTipo('categorias-cultivo');
  }

  createCategoriaCultivo(categoria: { nombre: string; estado?: boolean }): Observable<CatalogoReferencia> {
    return this.crearCatalogo('categorias-cultivo', categoria);
  }

  updateCategoriaCultivo(id: string, categoria: { nombre?: string; estado?: boolean }): Observable<CatalogoReferencia> {
    return this.actualizarCatalogo('categorias-cultivo', id, categoria);
  }

  deleteCategoriaCultivo(id: string): Observable<void> {
    return this.eliminarCatalogo('categorias-cultivo', id);
  }

  getUbicaciones(): Observable<CatalogoReferencia[]> {
    return this.obtenerPorTipo('ubicaciones');
  }

  createUbicacion(ubicacion: { nombre: string; estado?: boolean }): Observable<CatalogoReferencia> {
    return this.crearCatalogo('ubicaciones', ubicacion);
  }

  updateUbicacion(id: string, ubicacion: { nombre?: string; estado?: boolean }): Observable<CatalogoReferencia> {
    return this.actualizarCatalogo('ubicaciones', id, ubicacion);
  }

  deleteUbicacion(id: string): Observable<void> {
    return this.eliminarCatalogo('ubicaciones', id);
  }

  getTiposTarea(): Observable<CatalogoReferencia[]> {
    return this.obtenerPorTipo('tipos-tarea');
  }

  createTipoTarea(tipoTarea: { nombre: string; estado?: boolean }): Observable<CatalogoReferencia> {
    return this.crearCatalogo('tipos-tarea', tipoTarea);
  }

  updateTipoTarea(id: string, tipoTarea: { nombre?: string; estado?: boolean }): Observable<CatalogoReferencia> {
    return this.actualizarCatalogo('tipos-tarea', id, tipoTarea);
  }

  deleteTipoTarea(id: string): Observable<void> {
    return this.eliminarCatalogo('tipos-tarea', id);
  }

  getTiposInsumo(): Observable<CatalogoReferencia[]> {
    return this.obtenerPorTipo('tipos-insumo');
  }

  createTipoInsumo(tipoInsumo: { nombre: string; estado?: boolean }): Observable<CatalogoReferencia> {
    return this.crearCatalogo('tipos-insumo', tipoInsumo);
  }

  updateTipoInsumo(id: string, tipoInsumo: { nombre?: string; estado?: boolean }): Observable<CatalogoReferencia> {
    return this.actualizarCatalogo('tipos-insumo', id, tipoInsumo);
  }

  deleteTipoInsumo(id: string): Observable<void> {
    return this.eliminarCatalogo('tipos-insumo', id);
  }
}
