import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  personOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { UpdateAgricultorDto } from '../../../../core/models/agricultor.model';
import { AgricultoresService } from '../../../../core/service/agricultores.service';

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
  agricultor: AgricultorForm = {
    nombre: '',
    edad: null,
    zona: '',
    experiencia: '',
  };

  cargando = false;
  guardando = false;
  private agricultorId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly agricultoresService: AgricultoresService,
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

  ngOnInit(): void {
    this.agricultorId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.agricultorId) {
      this.router.navigate(['/agricultores']);
      return;
    }

    this.cargarAgricultor();
  }

  cargarAgricultor(): void {
    this.cargando = true;

    this.agricultoresService.getAgricultorById(this.agricultorId)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (agricultor) => {
          this.agricultor = {
            nombre: agricultor.nombre,
            edad: agricultor.edad,
            zona: agricultor.zona,
            experiencia: agricultor.experiencia,
          };
        },
        error: (error) => {
          console.error('Error al cargar agricultor', error);
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

    this.guardando = true;

    this.agricultoresService.updateAgricultor(this.agricultorId, payload)
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.volverAGestion();
        },
        error: (error) => {
          console.error('Error al actualizar agricultor', error);
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
