import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreateTareaDto,
  Tarea,
  UpdateTareaDto,
  UpdateTareaEstadoDto,
} from '../models/tarea.model';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  private readonly endpoint = `${environment.apiUrl}/tareas`;

  constructor(private readonly http: HttpClient) {}

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.endpoint);
  }

  getTareaById(id: string): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.endpoint}/${id}`);
  }

  createTarea(tarea: CreateTareaDto): Observable<Tarea> {
    return this.http.post<Tarea>(this.endpoint, tarea);
  }

  updateTarea(id: string, tarea: UpdateTareaDto): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.endpoint}/${id}`, tarea);
  }

  updateTareaEstado(id: string, estado: UpdateTareaEstadoDto): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${id}/estado`, estado);
  }

  deleteTarea(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
