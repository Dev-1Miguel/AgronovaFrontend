import { CommonModule, Location } from '@angular/common';
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
import {
  addCircleOutline,
  addOutline,
  arrowBackOutline,
  basketOutline,
  checkmarkOutline,
  closeOutline,
  personOutline,
  receiptOutline,
  trashOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Producto } from '../../../../core/models/producto.model';
import { CreateVentaDto, VentaDetalle } from '../../../../core/models/venta.model';
import { ProductosService } from '../../../../core/service/productos.service';
import { VentasService } from '../../../../core/service/ventas.service';

interface VentaForm {
  cliente: string;
}

@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
  styleUrls: ['./crear-venta.component.scss'],
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
export class CrearVentaComponent implements OnInit {
  venta: VentaForm = {
    cliente: '',
  };

  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  cantidad: number | null = null;
  detalles: VentaDetalle[] = [];
  totalVenta = 0;
  cargandoProductos = false;
  guardando = false;

  private readonly currencyFormat = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  });

  constructor(
    private readonly productosService: ProductosService,
    private readonly ventasService: VentasService,
    private readonly location: Location,
    private readonly router: Router,
  ) {
    addIcons({
      addCircleOutline,
      addOutline,
      arrowBackOutline,
      basketOutline,
      checkmarkOutline,
      closeOutline,
      personOutline,
      receiptOutline,
      trashOutline,
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargandoProductos = true;

    this.productosService.getProductos()
      .pipe(finalize(() => this.cargandoProductos = false))
      .subscribe({
        next: (productos) => {
          this.productos = productos;
        },
        error: (error) => {
          console.error('Error al cargar productos para ventas', error);
        },
      });
  }

  agregarDetalle(): void {
    if (!this.productoSeleccionado || this.cantidad === null) {
      return;
    }

    const cantidad = Number(this.cantidad);

    if (cantidad <= 0) {
      return;
    }

    const producto = this.productoSeleccionado;
    const precioUnitario = Number(producto.precioCaja);
    const existingIndex = this.detalles.findIndex(
      (detalle) => detalle.idProducto === producto.id,
    );

    if (existingIndex !== -1) {
      const detalleActual = this.detalles[existingIndex];
      const nuevaCantidad = detalleActual.cantidad + cantidad;

      this.detalles[existingIndex] = {
        ...detalleActual,
        cantidad: nuevaCantidad,
        subtotal: nuevaCantidad * detalleActual.precioUnitario,
      };
    } else {
      this.detalles.push({
        idProducto: producto.id,
        nombreProducto: producto.nombre,
        cantidad,
        precioUnitario,
        subtotal: cantidad * precioUnitario,
      });
    }

    this.productoSeleccionado = null;
    this.cantidad = null;
    this.recalcularTotal();
  }

  eliminarDetalle(index: number): void {
    this.detalles.splice(index, 1);
    this.recalcularTotal();
  }

  guardar(): void {
    if (!this.formularioValido() || this.guardando) {
      return;
    }

    const payload: CreateVentaDto = {
      fecha: new Date().toISOString(),
      cliente: this.venta.cliente.trim(),
      total: this.totalVenta,
      detalles: this.detalles.map((detalle) => ({
        idProducto: detalle.idProducto,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        subtotal: detalle.subtotal,
      })),
    };

    this.guardando = true;

    this.ventasService.createVenta(payload)
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/ventas']);
        },
        error: (error) => {
          console.error('Error al crear venta', error);
        },
      });
  }

  formularioValido(): boolean {
    return Boolean(this.venta.cliente.trim() && this.detalles.length > 0);
  }

  volverAGestion(): void {
    this.location.back();
  }

  formatearSubtotal(subtotal: number): string {
    return this.currencyFormat.format(subtotal);
  }

  formatearTotal(): string {
    return this.currencyFormat.format(this.totalVenta);
  }

  private recalcularTotal(): void {
    this.totalVenta = this.detalles.reduce(
      (acumulado, detalle) => acumulado + detalle.subtotal,
      0,
    );
  }
}

