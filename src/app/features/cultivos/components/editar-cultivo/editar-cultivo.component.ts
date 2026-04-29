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
import {
  arrowBackOutline,
  checkmarkOutline,
  gridOutline,
  leafOutline,
  locationOutline,
} from 'ionicons/icons';
import { finalize, forkJoin } from 'rxjs';

import { CatalogoReferencia, UpdateCultivoDto } from '../../../../core/models/cultivo.model';
import { CatalogosService } from '../../../../core/service/catalogos.service';
import { CultivosService } from '../../../../core/service/cultivos.service';

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
  cultivo: UpdateCultivoDto = {
    nombre: '',
    idCategoria: '',
    idUbicacion: '',
  };

  categorias: CatalogoReferencia[] = [];
  ubicaciones: CatalogoReferencia[] = [];
  cargando = false;
  guardando = false;
  private cultivoId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly catalogosService: CatalogosService,
    private readonly cultivosService: CultivosService,
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
    this.cultivoId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.cultivoId) {
      this.router.navigate(['/cultivos']);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    forkJoin({
      cultivo: this.cultivosService.getCultivoById(this.cultivoId),
      categorias: this.catalogosService.getCategoriasCultivo(),
      ubicaciones: this.catalogosService.getUbicaciones(),
    })
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: ({ cultivo, categorias, ubicaciones }) => {
          this.categorias = categorias;
          this.ubicaciones = ubicaciones;
          this.cultivo = {
            nombre: cultivo.nombre,
            idCategoria: cultivo.idCategoria ?? '',
            idUbicacion: cultivo.idUbicacion ?? '',
          };
        },
        error: (error) => {
          console.error('Error al cargar cultivo', error);
        },
      });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    this.guardando = true;

    this.cultivosService.updateCultivo(this.cultivoId, {
      nombre: this.cultivo.nombre?.trim(),
      idCategoria: this.cultivo.idCategoria,
      idUbicacion: this.cultivo.idUbicacion,
    })
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.volverAGestion();
        },
        error: (error) => {
          console.error('Error al actualizar cultivo', error);
        },
      });
  }

  formularioValido(): boolean {
    return Boolean(
      this.cultivo.nombre?.trim()
        && this.cultivo.idCategoria
        && this.cultivo.idUbicacion
    );
  }

  volverAGestion(): void {
    this.location.back();
  }
}
