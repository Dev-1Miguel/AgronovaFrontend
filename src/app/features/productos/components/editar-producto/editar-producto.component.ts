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
import { arrowBackOutline, basketOutline, checkmarkOutline, leafOutline } from 'ionicons/icons';
import { finalize, forkJoin } from 'rxjs';

import { Cultivo } from '../../../../core/models/cultivo.model';
import { Producto, UpdateProductoDto } from '../../../../core/models/producto.model';
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
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss'],
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
export class EditarProductoComponent implements OnInit {
  producto: ProductoForm = {
    nombre: '',
    descripcion: '',
    cantidadStock: null,
    precioCaja: null,
    idCultivo: '',
  };

  cultivos: Cultivo[] = [];
  cargando = false;
  guardando = false;
  private productoId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly cultivosService: CultivosService,
    private readonly productosService: ProductosService,
  ) {
    addIcons({ arrowBackOutline, basketOutline, checkmarkOutline, leafOutline });
  }

  ngOnInit(): void {
    this.productoId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.productoId) {
      this.router.navigate(['/productos']);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    forkJoin({
      producto: this.productosService.getProductoById(this.productoId),
      cultivos: this.cultivosService.getCultivos(),
    })
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: ({ producto, cultivos }) => {
          this.cultivos = cultivos;
          this.producto = this.mapearFormulario(producto);
        },
        error: (error) => {
          console.error('Error al cargar producto', error);
        },
      });
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    const payload: UpdateProductoDto = {
      nombre: this.producto.nombre.trim(),
      cantidadStock: Number(this.producto.cantidadStock),
      precioCaja: Number(this.producto.precioCaja),
      idCultivo: this.producto.idCultivo,
      ...(this.producto.descripcion.trim() ? { descripcion: this.producto.descripcion.trim() } : {}),
    };

    this.guardando = true;

    this.productosService.updateProducto(this.productoId, payload)
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => this.volverAGestion(),
        error: (error) => {
          console.error('Error al actualizar producto', error);
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

  private mapearFormulario(producto: Producto): ProductoForm {
    return {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      cantidadStock: producto.cantidadStock,
      precioCaja: producto.precioCaja,
      idCultivo: producto.idCultivo,
    };
  }
}
