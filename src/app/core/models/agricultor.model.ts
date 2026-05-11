export interface Agricultor {
  id: string;
  nombre: string;
  edad: number;
  zona: string;
  experiencia: string;
  estado?: string;
}

export interface CreateAgricultorDto {
  nombre: string;
  edad: number;
  zona: string;
  experiencia: string;
  estado: string;
}

export interface UpdateAgricultorDto {
  nombre?: string;
  edad?: number;
  zona?: string;
  experiencia?: string;
}
