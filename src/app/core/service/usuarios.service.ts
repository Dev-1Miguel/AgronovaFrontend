import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UpdateUsuarioEstadoRequest, UpdateUsuarioRolRequest, Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly http = inject(HttpClient);

  private readonly endpoint = `${environment.apiUrl}/usuarios`;

  getUsuarios(q = ''): Observable<Usuario[]> {
    const params = q.trim() ? new HttpParams().set('q', q.trim()) : undefined;
    return this.http.get<Usuario[]>(this.endpoint, { params });
  }

  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.endpoint}/${id}`);
  }

  updateRol(id: string, payload: UpdateUsuarioRolRequest): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.endpoint}/${id}/rol`, payload);
  }

  updateEstado(id: string, payload: UpdateUsuarioEstadoRequest): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.endpoint}/${id}/estado`, payload);
  }
}
