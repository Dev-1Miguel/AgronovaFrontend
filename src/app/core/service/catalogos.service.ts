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

  getUbicaciones(): Observable<CatalogoReferencia[]> {
    return this.http.get<CatalogoReferencia[]>(`${this.endpoint}/ubicaciones`);
  }

  getTiposTarea(): Observable<CatalogoReferencia[]> {
    return this.http.get<CatalogoReferencia[]>(`${this.endpoint}/tipos-tarea`);
  }
}
