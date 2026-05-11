import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  briefcaseOutline,
  calendarOutline,
  checkmarkOutline,
  locationOutline,
  personOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { CreateAgricultorDto } from '../../../../core/models/agricultor.model';
import { AgricultoresService } from '../../../../core/service/agricultores.service';

interface AgricultorForm {
  nombre: string;
  edad: number | null;
  zona: string;
  experiencia: string;
  estado: string;
}

@Component({
  selector: 'app-crear-agricultor',
  templateUrl: './crear-agricultor.component.html',
  styleUrls: ['./crear-agricultor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonTitle,
    IonToolbar,
  ],
})
export class CrearAgricultorComponent {
  agricultor: AgricultorForm = {
    nombre: '',
    edad: null,
    zona: '',
    experiencia: '',
    estado: 'Activo',
  };

  guardando = false;

  constructor(
    private readonly agricultoresService: AgricultoresService,
    private readonly location: Location,
  ) {
    addIcons({
      arrowBackOutline,
      briefcaseOutline,
      calendarOutline,
      checkmarkOutline,
      locationOutline,
      personOutline,
    });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    const payload: CreateAgricultorDto = {
      nombre: this.agricultor.nombre.trim(),
      edad: Number(this.agricultor.edad),
      zona: this.agricultor.zona.trim(),
      experiencia: this.agricultor.experiencia.trim(),
      estado: this.agricultor.estado,
    };

    this.guardando = true;

    this.agricultoresService.createAgricultor(payload)
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.volverAGestion();
        },
        error: (error) => {
          console.error('Error al crear agricultor', error);
        },
      });
  }

  formularioValido(): boolean {
    return Boolean(
      this.agricultor.nombre.trim()
        && this.agricultor.edad !== null
        && Number(this.agricultor.edad) > 0
        && this.agricultor.zona.trim()
        && this.agricultor.experiencia.trim()
    );
  }

  volverAGestion(): void {
    this.location.back();
  }
}
