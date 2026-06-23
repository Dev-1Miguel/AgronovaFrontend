import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  checkmarkDoneOutline,
  createOutline,
  peopleOutline,
  readerOutline,
  trashOutline,
} from 'ionicons/icons';
import { finalize, forkJoin } from 'rxjs';

import { Agricultor } from '../../../../core/models/agricultor.model';
import { CatalogoReferencia, Cultivo } from '../../../../core/models/cultivo.model';
import { Insumo } from '../../../../core/models/insumo.model';
import { Tarea } from '../../../../core/models/tarea.model';
import { AgricultoresService } from '../../../../core/service/agricultores.service';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { CultivosService } from '../../../../core/service/cultivos.service';
import { InsumosService } from '../../../../core/service/insumos.service';
import { TareasService } from '../../../../core/service/tareas.service';
import { TareasGanttComponent } from '../tareas-gantt/tareas-gantt.component';

@Component({
  selector: 'app-gestion-tareas',
  templateUrl: './gestion-tareas.component.html',
  styleUrls: ['./gestion-tareas.component.scss'],
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
    IonSearchbar,
    IonTitle,
    IonToolbar,
    TareasGanttComponent,
  ],
})
export class GestionTareasComponent {
  busqueda = '';
  vistaActual: 'lista' | 'gantt' = 'lista';
  tareas: Tarea[] = [];
  cargandoTareas = false;
  private tiposTareaPorId = new Map<string, string>();
  private cultivosPorId = new Map<string, string>();
  private agricultoresPorId = new Map<string, string>();
  private insumosPorId = new Map<string, string>();

  constructor(
    private readonly tareasService: TareasService,
    private readonly catalogosService: CatalogosService,
    private readonly cultivosService: CultivosService,
    private readonly insumosService: InsumosService,
    private readonly agricultoresService: AgricultoresService,
    private readonly router: Router,
  ) {
    addIcons({
      addOutline,
      checkmarkDoneOutline,
      createOutline,
      peopleOutline,
      readerOutline,
      trashOutline,
    });
  }

  ionViewWillEnter(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.cargandoTareas = true;

    forkJoin({
      tareas: this.tareasService.getTareas(),
      tiposTarea: this.catalogosService.getTiposTarea(),
      cultivos: this.cultivosService.getCultivos(),
      insumos: this.insumosService.getInsumos(),
      agricultores: this.agricultoresService.getAgricultores(),
    })
      .pipe(finalize(() => this.cargandoTareas = false))
      .subscribe({
        next: ({ tareas, tiposTarea, cultivos, insumos, agricultores }) => {
          this.tiposTareaPorId = this.crearMapaCatalogo(tiposTarea);
          this.cultivosPorId = this.crearMapaEntidades(cultivos);
          this.insumosPorId = this.crearMapaInsumos(insumos);
          this.agricultoresPorId = this.crearMapaEntidades(agricultores);
          this.tareas = tareas;
        },
        error: (error) => {
          console.error('Error al cargar tareas', error);
        },
      });
  }

  abrirFormulario(): void {
    this.router.navigate(['/tareas/crear']);
  }

  editarTarea(tarea: Tarea): void {
    this.router.navigate(['/tareas/editar', tarea.id]);
  }

  completarTarea(tarea: Tarea): void {
    this.tareasService.updateTareaEstado(tarea.id, { estado: 'Completada' }).subscribe({
      next: () => {
        this.tareas = this.tareas.map((item) =>
          item.id === tarea.id ? { ...item, estado: 'Completada' } : item
        );
      },
      error: (error) => {
        console.error('Error al completar tarea', error);
      },
    });
  }

  eliminarTarea(tarea: Tarea): void {
    this.tareasService.deleteTarea(tarea.id).subscribe({
      next: () => {
        this.tareas = this.tareas.filter((item) => item.id !== tarea.id);
      },
      error: (error) => {
        console.error('Error al eliminar tarea', error);
      },
    });
  }

  cambiarVista(vista: 'lista' | 'gantt'): void {
    this.vistaActual = vista;
  }

  tareasFiltradas(): Tarea[] {
    const termino = this.busqueda.trim().toLowerCase();

    if (!termino) {
      return this.tareas;
    }

    return this.tareas.filter((tarea) =>
      tarea.nombre.toLowerCase().includes(termino)
        || this.obtenerTipoTarea(tarea).toLowerCase().includes(termino)
        || this.obtenerCultivo(tarea).toLowerCase().includes(termino)
    );
  }

  obtenerTipoTarea(tarea: Tarea): string {
    return this.tiposTareaPorId.get(tarea.idTipoTarea) ?? 'Tipo no asignado';
  }

  obtenerCultivo(tarea: Tarea): string {
    return this.cultivosPorId.get(tarea.idCultivo) ?? 'Cultivo no asignado';
  }

  obtenerAgricultores(tarea: Tarea): string {
    if (!tarea.idAgricultores?.length) {
      return 'Sin agricultores asignados';
    }

    const nombres = tarea.idAgricultores
      .map((id) => this.agricultoresPorId.get(id))
      .filter((nombre): nombre is string => Boolean(nombre));

    return nombres.length ? nombres.join(', ') : 'Sin agricultores asignados';
  }

  obtenerResumenInsumos(tarea: Tarea): string {
    const insumosAsignados = tarea.insumosAsignados ?? [];

    if (!insumosAsignados.length) {
      return 'Sin insumos asignados';
    }

    const resumen = insumosAsignados
      .slice(0, 2)
      .map((item) => {
        const nombre = this.insumosPorId.get(item.idInsumo) ?? 'Insumo no encontrado';
        return `${nombre} x ${item.cantidad}`;
      });

    const restante = insumosAsignados.length - resumen.length;

    return restante > 0
      ? `${resumen.join(', ')} +${restante} mas`
      : resumen.join(', ');
  }

  puedeCompletar(tarea: Tarea): boolean {
    return tarea.estado !== 'Completada';
  }

  private crearMapaCatalogo(catalogos: CatalogoReferencia[]): Map<string, string> {
    return new Map(
      catalogos
        .filter((catalogo): catalogo is Required<Pick<CatalogoReferencia, 'id' | 'nombre'>> & CatalogoReferencia =>
          Boolean(catalogo.id && catalogo.nombre)
        )
        .map((catalogo) => [catalogo.id, catalogo.nombre])
    );
  }

  private crearMapaEntidades<T extends { id: string; nombre: string }>(items: T[]): Map<string, string> {
    return new Map(items.map((item) => [item.id, item.nombre]));
  }

  private crearMapaInsumos(items: Insumo[]): Map<string, string> {
    return new Map(items.map((item) => [item.id, item.descripcion]));
  }
}
