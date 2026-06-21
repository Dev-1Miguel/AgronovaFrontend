import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { CreateTareaDto } from '../../../../core/models/tarea.model';
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
  ],
})
export class CrearTareaComponent implements OnInit {
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
  cargandoDatos = false;
  guardando = false;

  constructor(
    private readonly catalogosService: CatalogosService,
    private readonly cultivosService: CultivosService,
    private readonly agricultoresService: AgricultoresService,
    private readonly tareasService: TareasService,
    private readonly location: Location,
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
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargandoDatos = true;

    forkJoin({
      tiposTarea: this.catalogosService.getTiposTarea(),
      cultivos: this.cultivosService.getCultivos(),
      agricultores: this.agricultoresService.getAgricultores(),
    })
      .pipe(finalize(() => this.cargandoDatos = false))
      .subscribe({
        next: ({ tiposTarea, cultivos, agricultores }) => {
          this.tiposTarea = tiposTarea;
          this.cultivos = cultivos;
          this.agricultores = agricultores;
        },
        error: (error) => {
          console.error('Error al cargar datos de tareas', error);
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
    };

    this.guardando = true;

    this.tareasService.createTarea(payload)
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.volverAGestion();
        },
        error: (error) => {
          console.error('Error al crear tarea', error);
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
}
