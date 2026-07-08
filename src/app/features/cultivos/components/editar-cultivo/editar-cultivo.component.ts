import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
import {
  arrowBackOutline,
  checkmarkOutline,
  gridOutline,
  leafOutline,
  locationOutline,
} from 'ionicons/icons';
import { forkJoin } from 'rxjs';

import { CatalogoReferencia, UpdateCultivoDto } from '../../../../core/models/cultivo.model';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { CultivosService } from '../../../../core/service/cultivos.service';
import { runFormRequest } from '../../../../core/utils/run-form-request.util';

@Component({
  selector: 'app-editar-cultivo',
  templateUrl: './editar-cultivo.component.html',
  styleUrls: ['./editar-cultivo.component.scss'],
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
export class EditarCultivoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogosService = inject(CatalogosService);
  private readonly cultivosService = inject(CultivosService);

  cultivo: UpdateCultivoDto = {
    nombre: '',
    idCategoria: '',
    idUbicacion: '',
  };

  categorias: CatalogoReferencia[] = [];
  ubicaciones: CatalogoReferencia[] = [];
  cargando = false;
  guardando = false;
  errorMessage = '';
  private cultivoId = '';

  constructor() {
    addIcons({
      arrowBackOutline,
      checkmarkOutline,
      gridOutline,
      leafOutline,
      locationOutline,
    });
  }

  ngOnInit(): void {
    this.cultivoId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.cultivoId) {
      void this.router.navigate(['/cultivos']);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    runFormRequest({
      request$: forkJoin({
        cultivo: this.cultivosService.getCultivoById(this.cultivoId),
        categorias: this.catalogosService.obtenerPorTipo('categorias-cultivo'),
        ubicaciones: this.catalogosService.obtenerPorTipo('ubicaciones'),
      }),
      setLoading: (loading) => {
        this.cargando = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudo cargar el cultivo en este momento.',
      logMessage: 'Error al cargar cultivo',
      onSuccess: ({ cultivo, categorias, ubicaciones }) => {
        this.categorias = categorias;
        this.ubicaciones = ubicaciones;
        this.cultivo = {
          nombre: cultivo.nombre,
          idCategoria: cultivo.idCategoria ?? '',
          idUbicacion: cultivo.idUbicacion ?? '',
        };
      },
    });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    runFormRequest({
      request$: this.cultivosService.updateCultivo(this.cultivoId, {
        nombre: this.cultivo.nombre?.trim(),
        idCategoria: this.cultivo.idCategoria,
        idUbicacion: this.cultivo.idUbicacion,
      }),
      setLoading: (loading) => {
        this.guardando = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudo actualizar el cultivo en este momento.',
      logMessage: 'Error al actualizar cultivo',
      onSuccess: () => {
        this.volverAGestion();
      },
    });
  }

  formularioValido(): boolean {
    return Boolean(
      this.cultivo.nombre?.trim()
        && this.cultivo.idCategoria
        && this.cultivo.idUbicacion,
    );
  }

  volverAGestion(): void {
    void this.router.navigate(['/cultivos']);
  }
}


