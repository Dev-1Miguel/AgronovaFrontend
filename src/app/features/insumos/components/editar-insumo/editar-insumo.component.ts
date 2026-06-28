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
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { albumsOutline, archiveOutline, arrowBackOutline, checkmarkOutline, cubeOutline, pricetagOutline } from 'ionicons/icons';
import { finalize, forkJoin } from 'rxjs';

import { CatalogoReferencia } from '../../../../core/models/cultivo.model';
import { Insumo, UpdateInsumoDto } from '../../../../core/models/insumo.model';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { InsumosService } from '../../../../core/service/insumos.service';

interface InsumoForm {
  idTipoInsumo: string;
  descripcion: string;
  cantidad: number | null;
  unidadMedida: string;
}

@Component({
  selector: 'app-editar-insumo',
  templateUrl: './editar-insumo.component.html',
  styleUrls: ['./editar-insumo.component.scss'],
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
    IonTitle,
    IonToolbar,
  ],
})
export class EditarInsumoComponent implements OnInit {
  insumo: InsumoForm = {
    idTipoInsumo: '',
    descripcion: '',
    cantidad: null,
    unidadMedida: '',
  };

  tiposInsumo: CatalogoReferencia[] = [];
  unidadesMedida = ['Kg', 'Litros', 'Unidades', 'Bolsas', 'Galones'];
  cargando = false;
  guardando = false;
  private insumoId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly catalogosService: CatalogosService,
    private readonly insumosService: InsumosService,
  ) {
    addIcons({ albumsOutline, archiveOutline, arrowBackOutline, checkmarkOutline, cubeOutline, pricetagOutline });
  }

  ngOnInit(): void {
    this.insumoId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.insumoId) {
      this.router.navigate(['/insumos']);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    forkJoin({
      insumo: this.insumosService.getInsumoById(this.insumoId),
      tiposInsumo: this.catalogosService.getTiposInsumo(),
    })
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: ({ insumo, tiposInsumo }) => {
          this.tiposInsumo = tiposInsumo;
          this.insumo = this.mapearFormulario(insumo);
        },
        error: (error) => {
          console.error('Error al cargar insumo', error);
        },
      });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    const payload: UpdateInsumoDto = {
      idTipoInsumo: this.insumo.idTipoInsumo,
      descripcion: this.insumo.descripcion.trim(),
      cantidad: Number(this.insumo.cantidad),
      unidadMedida: this.insumo.unidadMedida,
    };

    this.guardando = true;

    this.insumosService.updateInsumo(this.insumoId, payload)
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => this.volverAGestion(),
        error: (error) => {
          console.error('Error al actualizar insumo', error);
        },
      });
  }

  formularioValido(): boolean {
    return Boolean(
      this.insumo.idTipoInsumo
        && this.insumo.descripcion.trim()
        && this.insumo.cantidad !== null
        && Number(this.insumo.cantidad) >= 0
        && this.insumo.unidadMedida
    );
  }

  volverAGestion(): void {
    this.location.back();
  }

  private mapearFormulario(insumo: Insumo): InsumoForm {
    return {
      idTipoInsumo: insumo.idTipoInsumo,
      descripcion: insumo.descripcion,
      cantidad: insumo.cantidad,
      unidadMedida: insumo.unidadMedida,
    };
  }
}
