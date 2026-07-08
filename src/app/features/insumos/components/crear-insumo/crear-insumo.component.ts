import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
import { forkJoin } from 'rxjs';

import { CatalogoReferencia } from '../../../../core/models/cultivo.model';
import { CreateInsumoDto } from '../../../../core/models/insumo.model';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { InsumosService } from '../../../../core/service/insumos.service';
import { runFormRequest } from '../../../../core/utils/run-form-request.util';

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
  private readonly catalogosService = inject(CatalogosService);
  private readonly insumosService = inject(InsumosService);
  private readonly router = inject(Router);

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

  constructor() {
    addIcons({ albumsOutline, archiveOutline, arrowBackOutline, checkmarkOutline, cubeOutline, pricetagOutline });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    runFormRequest({
      request$: forkJoin({
        tiposInsumo: this.catalogosService.obtenerPorTipo('tipos-insumo'),
      }),
      setLoading: (loading) => {
        this.cargandoDatos = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudieron cargar los datos del insumo en este momento.',
      logMessage: 'Error al cargar datos de insumos',
      onSuccess: ({ tiposInsumo }) => {
        this.tiposInsumo = tiposInsumo;
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

    runFormRequest({
      request$: this.insumosService.createInsumo(payload),
      setLoading: (loading) => {
        this.guardando = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudo registrar el insumo en este momento.',
      logMessage: 'Error al crear insumo',
      onSuccess: () => this.volverAGestion(),
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


