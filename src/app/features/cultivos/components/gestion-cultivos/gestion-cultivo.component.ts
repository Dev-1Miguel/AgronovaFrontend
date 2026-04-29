import { Component } from '@angular/core';
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

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  addOutline,
  createOutline,
  leafOutline,
  trashOutline
} from 'ionicons/icons';
import { finalize, forkJoin } from 'rxjs';

import { CatalogoReferencia, Cultivo } from '../../../../core/models/cultivo.model';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { CultivosService } from '../../../../core/service/cultivos.service';

@Component({
  selector: 'app-gestion-cultivos',
  templateUrl: './gestion-cultivo.component.html',
  styleUrls: ['./gestion-cultivo.component.scss'],
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
  ],
})
export class CultivosPage {

  busqueda: string = '';
  cultivos: Cultivo[] = [];
  cargandoCultivos = false;
  private categoriasPorId = new Map<string, string>();
  private ubicacionesPorId = new Map<string, string>();

  constructor(
    private readonly cultivosService: CultivosService,
    private readonly catalogosService: CatalogosService,
    private readonly router: Router,
  ) {
    addIcons({
      addOutline,
      createOutline,
      leafOutline,
      trashOutline
    });
  }

  ionViewWillEnter(): void {
    this.cargarCultivos();
  }

  cargarCultivos(): void {
    this.cargandoCultivos = true;

    forkJoin({
      cultivos: this.cultivosService.getCultivos(),
      categorias: this.catalogosService.getCategoriasCultivo(),
      ubicaciones: this.catalogosService.getUbicaciones(),
    })
      .pipe(finalize(() => this.cargandoCultivos = false))
      .subscribe({
        next: ({ cultivos, categorias, ubicaciones }) => {
          this.categoriasPorId = this.crearMapaCatalogo(categorias);
          this.ubicacionesPorId = this.crearMapaCatalogo(ubicaciones);
          this.cultivos = cultivos;
        },
        error: (error) => {
          console.error('Error al cargar cultivos', error);
        },
      });
  }

  abrirFormulario(): void {
    this.router.navigate(['/cultivos/crear']);
  }

  editarCultivo(cultivo: Cultivo): void {
    this.router.navigate(['/cultivos/editar', cultivo.id]);
  }

  eliminarCultivo(cultivo: Cultivo): void {
    this.cultivosService.deleteCultivo(cultivo.id).subscribe({
      next: () => {
        this.cultivos = this.cultivos.filter(c => c.id !== cultivo.id);
      },
      error: (error) => {
        console.error('Error al eliminar cultivo', error);
      },
    });
  }

  cultivosFiltrados(): Cultivo[] {
    return this.cultivos.filter(c =>
      c.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  obtenerCategoria(cultivo: Cultivo): string | null {
    return this.obtenerNombreReferencia(cultivo.categoria)
      ?? this.obtenerNombrePorId(this.categoriasPorId, cultivo.idCategoria);
  }

  obtenerUbicacion(cultivo: Cultivo): string | null {
    return this.obtenerNombreReferencia(cultivo.ubicacion)
      ?? this.obtenerNombrePorId(this.ubicacionesPorId, cultivo.idUbicacion);
  }

  private obtenerNombreReferencia(referencia?: CatalogoReferencia | string | null): string | null {
    if (!referencia) {
      return null;
    }

    if (typeof referencia === 'string') {
      return referencia;
    }

    return referencia.nombre ?? null;
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

  private obtenerNombrePorId(catalogos: Map<string, string>, id?: string | null): string | null {
    if (!id) {
      return null;
    }

    return catalogos.get(id) ?? null;
  }
}
