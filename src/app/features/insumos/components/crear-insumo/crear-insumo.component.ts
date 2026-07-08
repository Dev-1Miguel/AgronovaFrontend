import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { albumsOutline, archiveOutline, arrowBackOutline, checkmarkOutline, cubeOutline, pricetagOutline } from 'ionicons/icons';
import { finalize, forkJoin } from 'rxjs';

import { CatalogoReferencia } from '../../../../core/models/cultivo.model';
import { CreateInsumoDto } from '../../../../core/models/insumo.model';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { InsumosService } from '../../../../core/service/insumos.service';
import { getHttpErrorMessage } from '../../../../core/utils/http-error-message.util';

interface InsumoForm {
  idTipoInsumo: string;
  descripcion: string;
  cantidad: number | null;
  unidadMedida: string;
}

@Component({
  selector: 'app-crear-insumo',
  templateUrl: './crear-insumo.component.html',
  styleUrls: ['./crear-insumo.component.scss'],
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
export class CrearInsumoComponent implements OnInit {
  insumo: InsumoForm = {
    idTipoInsumo: '',
    descripcion: '',
    cantidad: null,
    unidadMedida: '',
  };

  tiposInsumo: CatalogoReferencia[] = [];
  unidadesMedida = ['Kg', 'Litros', 'Unidades', 'Bolsas', 'Galones'];
  cargandoDatos = false;
  guardando = false;
  errorMessage = '';

  constructor(
    private readonly catalogosService: CatalogosService,
    private readonly insumosService: InsumosService,
    private readonly router: Router,
  ) {
    addIcons({ albumsOutline, archiveOutline, arrowBackOutline, checkmarkOutline, cubeOutline, pricetagOutline });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargandoDatos = true;
    this.errorMessage = '';

    forkJoin({
      tiposInsumo: this.catalogosService.obtenerPorTipo('tipos-insumo'),
    })
      .pipe(finalize(() => this.cargandoDatos = false))
      .subscribe({
        next: ({ tiposInsumo }) => {
          this.tiposInsumo = tiposInsumo;
        },
        error: (error) => {
          this.errorMessage = getHttpErrorMessage(error, 'No se pudieron cargar los datos del insumo en este momento.');
          console.error('Error al cargar datos de insumos', error);
        },
      });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    const payload: CreateInsumoDto = {
      idTipoInsumo: this.insumo.idTipoInsumo,
      descripcion: this.insumo.descripcion.trim(),
      cantidad: Number(this.insumo.cantidad),
      unidadMedida: this.insumo.unidadMedida,
    };

    this.guardando = true;
    this.errorMessage = '';

    this.insumosService.createInsumo(payload)
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => this.volverAGestion(),
        error: (error) => {
          this.errorMessage = getHttpErrorMessage(error, 'No se pudo registrar el insumo en este momento.');
          console.error('Error al crear insumo', error);
        },
      });
  }

  formularioValido(): boolean {
    return Boolean(
      this.insumo.idTipoInsumo
        && this.insumo.descripcion.trim()
        && this.insumo.cantidad !== null
        && Number(this.insumo.cantidad) >= 0
        && this.insumo.unidadMedida,
    );
  }

  volverAGestion(): void {
    void this.router.navigate(['/insumos']);
  }
}
