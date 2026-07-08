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
import { InsumoAsignado, Tarea, UpdateTareaDto } from '../../../../core/models/tarea.model';
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
  selector: 'app-editar-tarea',
  templateUrl: './editar-tarea.component.html',
  styleUrls: ['./editar-tarea.component.scss'],
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
export class EditarTareaComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogosService = inject(CatalogosService);
  private readonly cultivosService = inject(CultivosService);
  private readonly agricultoresService = inject(AgricultoresService);
  private readonly tareasService = inject(TareasService);

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
  cargando = false;
  guardando = false;
  errorMessage = '';
  private tareaId = '';

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
    this.tareaId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.tareaId) {
      void this.router.navigate(['/tareas']);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    runFormRequest({
      request$: forkJoin({
        tarea: this.tareasService.getTareaById(this.tareaId),
        tiposTarea: this.catalogosService.obtenerPorTipo('tipos-tarea'),
        cultivos: this.cultivosService.getCultivos(),
        agricultores: this.agricultoresService.getAgricultores(),
      }),
      setLoading: (loading) => {
        this.cargando = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudo cargar la tarea en este momento.',
      logMessage: 'Error al cargar tarea',
      onSuccess: ({ tarea, tiposTarea, cultivos, agricultores }) => {
        this.tiposTarea = tiposTarea;
        this.cultivos = cultivos;
        this.agricultores = agricultores;
        this.tarea = this.mapearFormulario(tarea);
      },
    });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    const payload: UpdateTareaDto = {
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
      request$: this.tareasService.updateTarea(this.tareaId, payload),
      setLoading: (loading) => {
        this.guardando = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudo actualizar la tarea en este momento.',
      logMessage: 'Error al actualizar tarea',
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

  private mapearFormulario(tarea: Tarea): TareaForm {
    return {
      nombre: tarea.nombre,
      fechaInicio: tarea.fechaInicio,
      fechaFin: tarea.fechaFin,
      idCultivo: tarea.idCultivo,
      idTipoTarea: tarea.idTipoTarea,
      descripcion: tarea.descripcion,
      idAgricultores: tarea.idAgricultores ? [...tarea.idAgricultores] : [],
      insumosAsignados: Array.isArray(tarea.insumosAsignados)
        ? tarea.insumosAsignados.map((item) => ({ ...item }))
        : [],
    };
  }
}


