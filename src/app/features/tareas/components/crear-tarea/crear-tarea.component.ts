import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  calendarOutline,
  checkmarkOutline,
  leafOutline,
  peopleOutline,
  readerOutline,
  reorderThreeOutline,
} from 'ionicons/icons';
import { forkJoin } from 'rxjs';

import { Agricultor } from '../../../../core/models/agricultor.model';
import { CatalogoReferencia, Cultivo } from '../../../../core/models/cultivo.model';
import { CreateTareaDto, InsumoAsignado } from '../../../../core/models/tarea.model';
import { AgricultoresService } from '../../../../core/service/agricultores.service';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { CultivosService } from '../../../../core/service/cultivos.service';
import { TareasService } from '../../../../core/service/tareas.service';
import { runFormRequest } from '../../../../core/utils/run-form-request.util';
import { TareaInsumosAsignadosComponent } from '../tarea-insumos-asignados/tarea-insumos-asignados.component';

interface TareaForm {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  idCultivo: string;
  idTipoTarea: string;
  descripcion: string;
  idAgricultores: string[];
  insumosAsignados: InsumoAsignado[];
}

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  styleUrls: ['./crear-tarea.component.scss'],
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
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonTitle,
    IonToolbar,
    TareaInsumosAsignadosComponent,
  ],
})
export class CrearTareaComponent implements OnInit {
  private readonly catalogosService = inject(CatalogosService);
  private readonly cultivosService = inject(CultivosService);
  private readonly agricultoresService = inject(AgricultoresService);
  private readonly tareasService = inject(TareasService);
  private readonly router = inject(Router);

  tarea: TareaForm = {
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    idCultivo: '',
    idTipoTarea: '',
    descripcion: '',
    idAgricultores: [],
    insumosAsignados: [],
  };

  tiposTarea: CatalogoReferencia[] = [];
  cultivos: Cultivo[] = [];
  agricultores: Agricultor[] = [];
  cargandoDatos = false;
  guardando = false;
  errorMessage = '';

  constructor() {
    addIcons({
      arrowBackOutline,
      calendarOutline,
      checkmarkOutline,
      leafOutline,
      peopleOutline,
      readerOutline,
      reorderThreeOutline,
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    runFormRequest({
      request$: forkJoin({
        tiposTarea: this.catalogosService.obtenerPorTipo('tipos-tarea'),
        cultivos: this.cultivosService.getCultivos(),
        agricultores: this.agricultoresService.getAgricultores(),
      }),
      setLoading: (loading) => {
        this.cargandoDatos = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudieron cargar los datos de la tarea en este momento.',
      logMessage: 'Error al cargar datos de tareas',
      onSuccess: ({ tiposTarea, cultivos, agricultores }) => {
        this.tiposTarea = tiposTarea;
        this.cultivos = cultivos;
        this.agricultores = agricultores;
      },
    });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    const payload: CreateTareaDto = {
      nombre: this.tarea.nombre.trim(),
      fechaInicio: this.tarea.fechaInicio,
      fechaFin: this.tarea.fechaFin,
      idCultivo: this.tarea.idCultivo,
      idTipoTarea: this.tarea.idTipoTarea,
      descripcion: this.tarea.descripcion.trim(),
      ...(this.tarea.idAgricultores.length ? { idAgricultores: this.tarea.idAgricultores } : {}),
      insumosAsignados: this.tarea.insumosAsignados.map((item) => ({ ...item })),
    };

    runFormRequest({
      request$: this.tareasService.createTarea(payload),
      setLoading: (loading) => {
        this.guardando = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudo registrar la tarea en este momento.',
      logMessage: 'Error al crear tarea',
      onSuccess: () => {
        this.volverAGestion();
      },
    });
  }

  formularioValido(): boolean {
    return Boolean(
      this.tarea.nombre.trim()
        && this.tarea.fechaInicio
        && this.tarea.fechaFin
        && this.tarea.idCultivo
        && this.tarea.idTipoTarea
        && this.tarea.descripcion.trim()
        && !this.fechasInvalidas(),
    );
  }

  fechasInvalidas(): boolean {
    return Boolean(
      this.tarea.fechaInicio
        && this.tarea.fechaFin
        && this.tarea.fechaInicio > this.tarea.fechaFin,
    );
  }

  volverAGestion(): void {
    void this.router.navigate(['/tareas']);
  }
}


