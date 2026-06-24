import { CommonModule } from '@angular/common';
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
  addOutline,
  checkmarkOutline,
  closeOutline,
  createOutline,
  leafOutline,
  saveOutline,
  trashOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { CatalogoReferencia } from '../../../../core/models/cultivo.model';
import { CatalogosService } from '../../../../core/service/catalogos.service';

@Component({
  selector: 'app-gestion-categorias-cultivo',
  standalone: true,
  templateUrl: './gestion-categorias-cultivo.component.html',
  styleUrls: ['./gestion-categorias-cultivo.component.scss'],
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
export class GestionCategoriasCultivoComponent {
  categorias: CatalogoReferencia[] = [];
  nombreNuevaCategoria = '';
  categoriaEnEdicionId: string | null = null;
  nombreEdicion = '';
  cargando = false;
  guardando = false;
  eliminandoId: string | null = null;

  constructor(private readonly catalogosService: CatalogosService) {
    addIcons({
      addOutline,
      checkmarkOutline,
      closeOutline,
      createOutline,
      leafOutline,
      saveOutline,
      trashOutline,
    });
  }

  ionViewWillEnter(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;

    this.catalogosService.getCategoriasCultivo()
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (categorias) => {
          this.categorias = categorias;
        },
        error: (error) => {
          console.error('Error al cargar categorias de cultivo', error);
        },
      });
  }

  crearCategoria(): void {
    const nombre = this.nombreNuevaCategoria.trim();

    if (!nombre || this.guardando) {
      return;
    }

    this.guardando = true;

    this.catalogosService.createCategoriaCultivo({ nombre })
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.nombreNuevaCategoria = '';
          this.cargarCategorias();
        },
        error: (error) => {
          console.error('Error al crear categoria de cultivo', error);
        },
      });
  }

  iniciarEdicion(categoria: CatalogoReferencia): void {
    this.categoriaEnEdicionId = categoria.id ?? null;
    this.nombreEdicion = categoria.nombre ?? '';
  }

  cancelarEdicion(): void {
    this.categoriaEnEdicionId = null;
    this.nombreEdicion = '';
  }

  guardarEdicion(categoria: CatalogoReferencia): void {
    const id = categoria.id;
    const nombre = this.nombreEdicion.trim();

    if (!id || !nombre || this.guardando) {
      return;
    }

    this.guardando = true;

    this.catalogosService.updateCategoriaCultivo(id, { nombre })
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.cancelarEdicion();
          this.cargarCategorias();
        },
        error: (error) => {
          console.error('Error al actualizar categoria de cultivo', error);
        },
      });
  }

  eliminarCategoria(categoria: CatalogoReferencia): void {
    const id = categoria.id;
    const nombre = categoria.nombre?.trim() || 'esta categoria';

    if (!id || this.eliminandoId) {
      return;
    }

    if (!window.confirm(`Se desactivara "${nombre}". ¿Deseas continuar?`)) {
      return;
    }

    this.eliminandoId = id;

    this.catalogosService.deleteCategoriaCultivo(id)
      .pipe(finalize(() => this.eliminandoId = null))
      .subscribe({
        next: () => {
          if (this.categoriaEnEdicionId === id) {
            this.cancelarEdicion();
          }
          this.cargarCategorias();
        },
        error: (error) => {
          console.error('Error al desactivar categoria de cultivo', error);
        },
      });
  }

  estaEditando(categoria: CatalogoReferencia): boolean {
    return Boolean(categoria.id && categoria.id === this.categoriaEnEdicionId);
  }
}
