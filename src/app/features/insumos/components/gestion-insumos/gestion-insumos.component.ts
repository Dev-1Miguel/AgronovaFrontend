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
import { archiveOutline, addOutline, arrowBackOutline, createOutline, trashOutline } from 'ionicons/icons';
import { finalize, forkJoin } from 'rxjs';

import { CatalogoReferencia } from '../../../../core/models/cultivo.model';
import { Insumo } from '../../../../core/models/insumo.model';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { InsumosService } from '../../../../core/service/insumos.service';

@Component({
  selector: 'app-gestion-insumos',
  templateUrl: './gestion-insumos.component.html',
  styleUrls: ['./gestion-insumos.component.scss'],
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
export class GestionInsumosComponent {
  busqueda = '';
  insumos: Insumo[] = [];
  cargandoInsumos = false;
  private tiposInsumoPorId = new Map<string, string>();

  constructor(
    private readonly insumosService: InsumosService,
    private readonly catalogosService: CatalogosService,
    private readonly router: Router,
  ) {
    addIcons({ archiveOutline, addOutline, arrowBackOutline, createOutline, trashOutline });
  }

  ionViewWillEnter(): void {
    this.cargarInsumos();
  }

  cargarInsumos(): void {
    this.cargandoInsumos = true;

    forkJoin({
      insumos: this.insumosService.getInsumos(),
      tiposInsumo: this.catalogosService.getTiposInsumo(),
    })
      .pipe(finalize(() => this.cargandoInsumos = false))
      .subscribe({
        next: ({ insumos, tiposInsumo }) => {
          this.tiposInsumoPorId = this.crearMapaCatalogo(tiposInsumo);
          this.insumos = insumos;
        },
        error: (error) => {
          console.error('Error al cargar insumos', error);
        },
      });
  }

  abrirFormulario(): void {
    this.router.navigate(['/insumos/crear']);
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  editarInsumo(insumo: Insumo): void {
    this.router.navigate(['/insumos/editar', insumo.id]);
  }

  eliminarInsumo(insumo: Insumo): void {
    this.insumosService.deleteInsumo(insumo.id).subscribe({
      next: () => {
        this.insumos = this.insumos.filter((item) => item.id !== insumo.id);
      },
      error: (error) => {
        console.error('Error al eliminar insumo', error);
      },
    });
  }

  insumosFiltrados(): Insumo[] {
    const termino = this.busqueda.trim().toLowerCase();

    if (!termino) {
      return this.insumos;
    }

    return this.insumos.filter((insumo) =>
      insumo.descripcion.toLowerCase().includes(termino)
        || this.obtenerTipoInsumo(insumo).toLowerCase().includes(termino)
    );
  }

  obtenerTipoInsumo(insumo: Insumo): string {
    return this.tiposInsumoPorId.get(insumo.idTipoInsumo) ?? 'Tipo no asignado';
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
}
