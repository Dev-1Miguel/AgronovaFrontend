import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CatalogoReferencia } from '../models/cultivo.model';

export type CatalogoTipo = 'categorias-cultivo' | 'tipos-insumo' | 'tipos-tarea' | 'ubicaciones';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  private readonly http = inject(HttpClient);

  private readonly endpoint = `${environment.apiUrl}/catalogos`;

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
}
