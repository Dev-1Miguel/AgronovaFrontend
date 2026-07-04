import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonModal,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowBackOutline,
  businessOutline,
  closeOutline,
  createOutline,
  cubeOutline,
  leafOutline,
  locationOutline,
  readerOutline,
  saveOutline,
  trashOutline,
} from 'ionicons/icons';
import { finalize, Observable } from 'rxjs';

import { CatalogoReferencia } from '../../../../core/models/cultivo.model';
import { CatalogosService } from '../../../../core/service/catalogos.service';

type CatalogoKey = 'categorias-cultivo' | 'tipos-insumo' | 'tipos-tarea' | 'ubicaciones';

interface CatalogoConfig {
  key: CatalogoKey;
  tabLabel: string;
  title: string;
  heading: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  inputPlaceholder: string;
  searchPlaceholder: string;
  icon: string;
  list: () => Observable<CatalogoReferencia[]>;
  create: (payload: { nombre: string }) => Observable<CatalogoReferencia>;
  update: (id: string, payload: { nombre?: string }) => Observable<CatalogoReferencia>;
  remove: (id: string) => Observable<void>;
}

@Component({
  selector: 'app-parametros',
  standalone: true,
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonAlert,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonModal,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar,
  ],
})
export class ParametrosComponent {
  readonly catalogos: CatalogoConfig[];
  readonly alertaButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.registroPendienteDesactivar = null;
      },
    },
    {
      text: 'Desactivar',
      role: 'destructive',
      handler: () => {
        this.confirmarDesactivacion();
      },
    },
  ];

  catalogoActivo: CatalogoKey = 'categorias-cultivo';
  registros: CatalogoReferencia[] = [];
  busqueda = '';
  cargando = false;
  guardando = false;
  eliminandoId: string | null = null;
  modalAbierto = false;
  alertaAbierta = false;
  nombreFormulario = '';
  registroEnEdicion: CatalogoReferencia | null = null;
  registroPendienteDesactivar: CatalogoReferencia | null = null;

  constructor(
    private readonly catalogosService: CatalogosService,
    private readonly router: Router,
  ) {
    addIcons({
      addOutline,
      arrowBackOutline,
      businessOutline,
      closeOutline,
      createOutline,
      cubeOutline,
      leafOutline,
      locationOutline,
      readerOutline,
      saveOutline,
      trashOutline,
    });

    this.catalogos = [
      {
        key: 'categorias-cultivo',
        tabLabel: 'Categorias',
        title: 'Categorias de cultivo',
        heading: 'Categorias de cultivo',
        description: 'Administra las categorias usadas por los formularios y listados de cultivos.',
        emptyTitle: 'No hay categorias registradas',
        emptyDescription: 'Cuando agregues una categoria, aparecera aqui para usarla desde Cultivos.',
        inputPlaceholder: 'Nombre de la categoria',
        searchPlaceholder: 'Buscar categoria',
        icon: 'leaf-outline',
        list: () => this.catalogosService.getCategoriasCultivo(),
        create: (payload) => this.catalogosService.createCategoriaCultivo(payload),
        update: (id, payload) => this.catalogosService.updateCategoriaCultivo(id, payload),
        remove: (id) => this.catalogosService.deleteCategoriaCultivo(id),
      },
      {
        key: 'tipos-insumo',
        tabLabel: 'Tipos de insumo',
        title: 'Tipos de insumo',
        heading: 'Tipos de insumo',
        description: 'Centraliza los tipos de insumo consumidos por Inventario y sus formularios.',
        emptyTitle: 'No hay tipos de insumo registrados',
        emptyDescription: 'Cuando agregues un tipo, aparecera aqui para usarlo desde Insumos.',
        inputPlaceholder: 'Nombre del tipo de insumo',
        searchPlaceholder: 'Buscar tipo de insumo',
        icon: 'cube-outline',
        list: () => this.catalogosService.getTiposInsumo(),
        create: (payload) => this.catalogosService.createTipoInsumo(payload),
        update: (id, payload) => this.catalogosService.updateTipoInsumo(id, payload),
        remove: (id) => this.catalogosService.deleteTipoInsumo(id),
      },
      {
        key: 'tipos-tarea',
        tabLabel: 'Tipos de tarea',
        title: 'Tipos de tarea',
        heading: 'Tipos de tarea',
        description: 'Administra los tipos que usan las tareas operativas en lista y formularios.',
        emptyTitle: 'No hay tipos de tarea registrados',
        emptyDescription: 'Cuando agregues un tipo, aparecera aqui para usarlo desde Tareas.',
        inputPlaceholder: 'Nombre del tipo de tarea',
        searchPlaceholder: 'Buscar tipo de tarea',
        icon: 'reader-outline',
        list: () => this.catalogosService.getTiposTarea(),
        create: (payload) => this.catalogosService.createTipoTarea(payload),
        update: (id, payload) => this.catalogosService.updateTipoTarea(id, payload),
        remove: (id) => this.catalogosService.deleteTipoTarea(id),
      },
      {
        key: 'ubicaciones',
        tabLabel: 'Ubicaciones',
        title: 'Ubicaciones',
        heading: 'Ubicaciones',
        description: 'Mantiene las ubicaciones que se reutilizan en cultivos y reportes operativos.',
        emptyTitle: 'No hay ubicaciones registradas',
        emptyDescription: 'Cuando agregues una ubicacion, aparecera aqui para usarla desde Cultivos.',
        inputPlaceholder: 'Nombre de la ubicacion',
        searchPlaceholder: 'Buscar ubicacion',
        icon: 'location-outline',
        list: () => this.catalogosService.getUbicaciones(),
        create: (payload) => this.catalogosService.createUbicacion(payload),
        update: (id, payload) => this.catalogosService.updateUbicacion(id, payload),
        remove: (id) => this.catalogosService.deleteUbicacion(id),
      },
    ];
  }

  ionViewWillEnter(): void {
    this.cargarCatalogoActivo();
  }

  get configActiva(): CatalogoConfig {
    return this.catalogos.find((catalogo) => catalogo.key === this.catalogoActivo) ?? this.catalogos[0];
  }

  get tituloModal(): string {
    return this.registroEnEdicion ? `Editar ${this.configActiva.title.toLowerCase()}` : `Nuevo ${this.configActiva.title.toLowerCase()}`;
  }

  get mensajeConfirmacion(): string {
    const nombre = this.registroPendienteDesactivar?.nombre?.trim() || 'este registro';
    return `Se desactivara "${nombre}". Esta accion mantendra el historial pero lo quitara del catalogo activo.`;
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  cambiarCatalogo(event: CustomEvent): void {
    const siguienteCatalogo = event.detail.value as CatalogoKey | undefined;

    if (!siguienteCatalogo || siguienteCatalogo === this.catalogoActivo) {
      return;
    }

    this.catalogoActivo = siguienteCatalogo;
    this.busqueda = '';
    this.cerrarModal();
    this.cargarCatalogoActivo();
  }

  cargarCatalogoActivo(): void {
    this.cargando = true;

    this.configActiva.list()
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (registros) => {
          this.registros = registros;
        },
        error: (error) => {
          console.error(`Error al cargar ${this.configActiva.key}`, error);
        },
      });
  }

  registrosFiltrados(): CatalogoReferencia[] {
    const termino = this.busqueda.trim().toLowerCase();

    if (!termino) {
      return this.registros;
    }

    return this.registros.filter((registro) => (registro.nombre || '').toLowerCase().includes(termino));
  }

  abrirNuevo(): void {
    this.registroEnEdicion = null;
    this.nombreFormulario = '';
    this.modalAbierto = true;
  }

  abrirEdicion(registro: CatalogoReferencia): void {
    this.registroEnEdicion = registro;
    this.nombreFormulario = registro.nombre || '';
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.registroEnEdicion = null;
    this.nombreFormulario = '';
  }

  guardar(): void {
    const nombre = this.nombreFormulario.trim();
    const id = this.registroEnEdicion?.id;

    if (!nombre || this.guardando) {
      return;
    }

    this.guardando = true;

    const request$ = id
      ? this.configActiva.update(id, { nombre })
      : this.configActiva.create({ nombre });

    request$
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarCatalogoActivo();
        },
        error: (error) => {
          console.error(`Error al guardar ${this.configActiva.key}`, error);
        },
      });
  }

  solicitarDesactivacion(registro: CatalogoReferencia): void {
    if (!registro.id || this.eliminandoId) {
      return;
    }

    this.registroPendienteDesactivar = registro;
    this.alertaAbierta = true;
  }

  cerrarAlerta(): void {
    this.alertaAbierta = false;
    this.registroPendienteDesactivar = null;
  }

  confirmarDesactivacion(): void {
    const registro = this.registroPendienteDesactivar;
    const id = registro?.id;

    this.alertaAbierta = false;

    if (!id || this.eliminandoId) {
      this.registroPendienteDesactivar = null;
      return;
    }

    this.eliminandoId = id;

    this.configActiva.remove(id)
      .pipe(finalize(() => {
        this.eliminandoId = null;
        this.registroPendienteDesactivar = null;
      }))
      .subscribe({
        next: () => {
          if (this.registroEnEdicion?.id === id) {
            this.cerrarModal();
          }
          this.cargarCatalogoActivo();
        },
        error: (error) => {
          console.error(`Error al desactivar ${this.configActiva.key}`, error);
        },
      });
  }
}