import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { finalize, forkJoin } from 'rxjs';

import { CatalogoReferencia, CreateCultivoDto } from '../../../../core/models/cultivo.model';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { CultivosService } from '../../../../core/service/cultivos.service';

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

  constructor(
    private readonly catalogosService: CatalogosService,
    private readonly cultivosService: CultivosService,
    private readonly location: Location,
  ) {
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
    this.cargandoCatalogos = true;

    forkJoin({
      categorias: this.catalogosService.getCategoriasCultivo(),
      ubicaciones: this.catalogosService.getUbicaciones(),
    })
      .pipe(finalize(() => this.cargandoCatalogos = false))
      .subscribe({
        next: ({ categorias, ubicaciones }) => {
          this.categorias = categorias;
          this.ubicaciones = ubicaciones;
        },
        error: (error) => {
          console.error('Error al cargar catalogos de cultivos', error);
        },
      });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    this.guardando = true;

    this.cultivosService.createCultivo({
      ...this.cultivo,
      nombre: this.cultivo.nombre.trim(),
    })
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.volverAGestion();
        },
        error: (error) => {
          console.error('Error al crear cultivo', error);
        },
      });
  }

  formularioValido(): boolean {
    return Boolean(
      this.cultivo.nombre.trim()
        && this.cultivo.idCategoria
        && this.cultivo.idUbicacion
    );
  }

  volverAGestion(): void {
    this.location.back();
  }
}
