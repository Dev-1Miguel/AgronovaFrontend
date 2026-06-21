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
import { arrowBackOutline, basketOutline, checkmarkOutline, leafOutline } from 'ionicons/icons';
import { finalize, forkJoin } from 'rxjs';

import { Cultivo } from '../../../../core/models/cultivo.model';
import { CreateProductoDto } from '../../../../core/models/producto.model';
import { CultivosService } from '../../../../core/service/cultivos.service';
import { ProductosService } from '../../../../core/service/productos.service';

interface ProductoForm {
  nombre: string;
  descripcion: string;
  cantidadStock: number | null;
  precioCaja: number | null;
  idCultivo: string;
}

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss'],
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
export class CrearProductoComponent implements OnInit {
  producto: ProductoForm = {
    nombre: '',
    descripcion: '',
    cantidadStock: null,
    precioCaja: null,
    idCultivo: '',
  };

  cultivos: Cultivo[] = [];
  cargandoDatos = false;
  guardando = false;

  constructor(
    private readonly cultivosService: CultivosService,
    private readonly productosService: ProductosService,
    private readonly location: Location,
  ) {
    addIcons({ arrowBackOutline, basketOutline, checkmarkOutline, leafOutline });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargandoDatos = true;

    forkJoin({
      cultivos: this.cultivosService.getCultivos(),
    })
      .pipe(finalize(() => this.cargandoDatos = false))
      .subscribe({
        next: ({ cultivos }) => {
          this.cultivos = cultivos;
        },
        error: (error) => {
          console.error('Error al cargar cultivos para productos', error);
        },
      });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    const payload: CreateProductoDto = {
      nombre: this.producto.nombre.trim(),
      cantidadStock: Number(this.producto.cantidadStock),
      precioCaja: Number(this.producto.precioCaja),
      idCultivo: this.producto.idCultivo,
      ...(this.producto.descripcion.trim() ? { descripcion: this.producto.descripcion.trim() } : {}),
    };

    this.guardando = true;

    this.productosService.createProducto(payload)
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => this.volverAGestion(),
        error: (error) => {
          console.error('Error al crear producto', error);
        },
      });
  }

  formularioValido(): boolean {
    return Boolean(
      this.producto.nombre.trim()
        && this.producto.cantidadStock !== null
        && Number(this.producto.cantidadStock) >= 0
        && this.producto.precioCaja !== null
        && Number(this.producto.precioCaja) >= 0
        && this.producto.idCultivo
    );
  }

  volverAGestion(): void {
    this.location.back();
  }
}
