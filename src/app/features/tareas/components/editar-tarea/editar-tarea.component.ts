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
import { finalize, forkJoin } from 'rxjs';

import { Agricultor } from '../../../../core/models/agricultor.model';
import { CatalogoReferencia, Cultivo } from '../../../../core/models/cultivo.model';
import { Tarea, UpdateTareaDto } from '../../../../core/models/tarea.model';
import { AgricultoresService } from '../../../../core/service/agricultores.service';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { CultivosService } from '../../../../core/service/cultivos.service';
import { TareasService } from '../../../../core/service/tareas.service';

interface TareaForm {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  idCultivo: string;
  idTipoTarea: string;
  descripcion: string;
  idAgricultores: string[];
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
  ],
})
export class EditarTareaComponent implements OnInit {
  tarea: TareaForm = {
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    idCultivo: '',
    idTipoTarea: '',
    descripcion: '',
    idAgricultores: [],
  };

  tiposTarea: CatalogoReferencia[] = [];
  cultivos: Cultivo[] = [];
  agricultores: Agricultor[] = [];
  cargando = false;
  guardando = false;
  private tareaId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly catalogosService: CatalogosService,
    private readonly cultivosService: CultivosService,
    private readonly agricultoresService: AgricultoresService,
    private readonly tareasService: TareasService,
  ) {
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
      this.router.navigate(['/tareas']);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    forkJoin({
      tarea: this.tareasService.getTareaById(this.tareaId),
      tiposTarea: this.catalogosService.getTiposTarea(),
      cultivos: this.cultivosService.getCultivos(),
      agricultores: this.agricultoresService.getAgricultores(),
    })
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: ({ tarea, tiposTarea, cultivos, agricultores }) => {
          this.tiposTarea = tiposTarea;
          this.cultivos = cultivos;
          this.agricultores = agricultores;
          this.tarea = this.mapearFormulario(tarea);
        },
        error: (error) => {
          console.error('Error al cargar tarea', error);
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
    };

    this.guardando = true;

    this.tareasService.updateTarea(this.tareaId, payload)
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.volverAGestion();
        },
        error: (error) => {
          console.error('Error al actualizar tarea', error);
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
    );
  }

  volverAGestion(): void {
    this.location.back();
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
    };
  }
}
