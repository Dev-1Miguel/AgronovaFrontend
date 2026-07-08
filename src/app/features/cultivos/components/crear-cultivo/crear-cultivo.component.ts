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
import {
  arrowBackOutline,
  checkmarkOutline,
  gridOutline,
  leafOutline,
  locationOutline,
} from 'ionicons/icons';
import { forkJoin } from 'rxjs';

import { CatalogoReferencia, CreateCultivoDto } from '../../../../core/models/cultivo.model';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { CultivosService } from '../../../../core/service/cultivos.service';
import { runFormRequest } from '../../../../core/utils/run-form-request.util';

@Component({
  selector: 'app-crear-cultivo',
  templateUrl: './crear-cultivo.component.html',
  styleUrls: ['./crear-cultivo.component.scss'],
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
export class CrearCultivoComponent implements OnInit {
  private readonly catalogosService = inject(CatalogosService);
  private readonly cultivosService = inject(CultivosService);
  private readonly router = inject(Router);

  cultivo: CreateCultivoDto = {
    nombre: '',
    idCategoria: '',
    idUbicacion: '',
    estado: 'Activo',
  };

  categorias: CatalogoReferencia[] = [];
  ubicaciones: CatalogoReferencia[] = [];
  cargandoCatalogos = false;
  guardando = false;
  errorMessage = '';

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
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    runFormRequest({
      request$: forkJoin({
        categorias: this.catalogosService.obtenerPorTipo('categorias-cultivo'),
        ubicaciones: this.catalogosService.obtenerPorTipo('ubicaciones'),
      }),
      setLoading: (loading) => {
        this.cargandoCatalogos = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudieron cargar los catalogos del cultivo en este momento.',
      logMessage: 'Error al cargar catalogos de cultivos',
      onSuccess: ({ categorias, ubicaciones }) => {
        this.categorias = categorias;
        this.ubicaciones = ubicaciones;
      },
    });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    runFormRequest({
      request$: this.cultivosService.createCultivo({
        ...this.cultivo,
        nombre: this.cultivo.nombre.trim(),
      }),
      setLoading: (loading) => {
        this.guardando = loading;
      },
      setErrorMessage: (message) => {
        this.errorMessage = message;
      },
      fallbackMessage: 'No se pudo registrar el cultivo en este momento.',
      logMessage: 'Error al crear cultivo',
      onSuccess: () => {
        this.volverAGestion();
      },
    });
  }

  formularioValido(): boolean {
    return Boolean(
      this.cultivo.nombre.trim()
        && this.cultivo.idCategoria
        && this.cultivo.idUbicacion,
    );
  }

  volverAGestion(): void {
    void this.router.navigate(['/cultivos']);
  }
}


