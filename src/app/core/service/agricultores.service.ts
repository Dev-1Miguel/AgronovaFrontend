import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Agricultor, CreateAgricultorDto, UpdateAgricultorDto } from '../models/agricultor.model';

@Injectable({
  providedIn: 'root',
})
export class AgricultoresService {
  private readonly endpoint = `${environment.apiUrl}/agricultores`;

  constructor(private readonly http: HttpClient) {}

  getAgricultores(): Observable<Agricultor[]> {
    return this.http.get<Agricultor[]>(this.endpoint);
  }

  getAgricultorById(id: string): Observable<Agricultor> {
    return this.http.get<Agricultor>(`${this.endpoint}/${id}`);
  }

  createAgricultor(agricultor: CreateAgricultorDto): Observable<Agricultor> {
    return this.http.post<Agricultor>(this.endpoint, agricultor);
  }

  updateAgricultor(id: string, agricultor: UpdateAgricultorDto): Observable<Agricultor> {
    return this.http.put<Agricultor>(`${this.endpoint}/${id}`, agricultor);
  }

  deleteAgricultor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
