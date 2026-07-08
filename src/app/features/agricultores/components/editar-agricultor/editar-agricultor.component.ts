import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  peopleOutline,
  personOutline,
} from 'ionicons/icons';
import { UpdateAgricultorDto } from '../../../../core/models/agricultor.model';
import { AgricultoresService } from '../../../../core/service/agricultores.service';
import { runFormRequest } from '../../../../core/utils/run-form-request.util';

interface AgricultorForm {
  nombre: string;
  edad: number | null;
  zona: string;
  experiencia: string;
}

@Component({
  selector: 'app-editar-agricultor',
  templateUrl: './editar-agricultor.component.html',
  styleUrls: ['./editar-agricultor.component.scss'],
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
export class EditarAgricultorComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly agricultoresService = inject(AgricultoresService);

  agricultor: AgricultorForm = {
    nombre: '',
    edad: null,
    zona: '',
    experiencia: '',
  };

  cargando = false;
  guardando = false;
  errorMessage = '';
  private agricultorId = '';

  constructor() {
    addIcons({
      arrowBackOutline,
      briefcaseOutline,
      calendarOutline,
      checkmarkOutline,
      locationOutline,
      peopleOutline,
      personOutline,
    });
  }

  ngOnInit(): void {
    this.agricultorId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.agricultorId) {
      void this.router.navigate(['/agricultores']);
      return;
    }

    this.cargarAgricultor();
  }

  cargarAgricultor(): void {
    runFormRequest({
      request$: this.agricultoresService.getAgricultorById(this.agricultorId),
      setLoading: (loading) => {
        this.cargando = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudo cargar el agricultor en este momento.',
      logMessage: 'Error al cargar agricultor',
      onSuccess: (agricultor) => {
        this.agricultor = {
          nombre: agricultor.nombre,
          edad: agricultor.edad,
          zona: agricultor.zona,
          experiencia: agricultor.experiencia,
        };
      },
    });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    const payload: UpdateAgricultorDto = {
      nombre: this.agricultor.nombre.trim(),
      edad: Number(this.agricultor.edad),
      zona: this.agricultor.zona.trim(),
      experiencia: this.agricultor.experiencia.trim(),
    };

    runFormRequest({
      request$: this.agricultoresService.updateAgricultor(this.agricultorId, payload),
      setLoading: (loading) => {
        this.guardando = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudo actualizar el agricultor en este momento.',
      logMessage: 'Error al actualizar agricultor',
      onSuccess: () => {
        this.volverAGestion();
      },
    });
  }

  formularioValido(): boolean {
    return Boolean(
      this.agricultor.nombre.trim()
        && this.agricultor.edad !== null
        && Number(this.agricultor.edad) > 0
        && this.agricultor.zona.trim()
        && this.agricultor.experiencia.trim(),
    );
  }

  volverAGestion(): void {
    void this.router.navigate(['/agricultores']);
  }
}


