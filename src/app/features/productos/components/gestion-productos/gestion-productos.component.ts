import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, basketOutline, trashOutline } from 'ionicons/icons';
import { finalize, forkJoin } from 'rxjs';

import { Cultivo } from '../../../../core/models/cultivo.model';
import { Producto } from '../../../../core/models/producto.model';
import { CultivosService } from '../../../../core/service/cultivos.service';
import { ProductosService } from '../../../../core/service/productos.service';

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.scss'],
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
    IonSearchbar,
    IonTitle,
    IonToolbar,
  ],
})
export class GestionProductosComponent {
  busqueda = '';
  productos: Producto[] = [];
  cargandoProductos = false;
  private cultivosPorId = new Map<string, string>();

  constructor(
    private readonly productosService: ProductosService,
    private readonly cultivosService: CultivosService,
    private readonly router: Router,
  ) {
    addIcons({ addOutline, createOutline, basketOutline, trashOutline });
  }

  ionViewWillEnter(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargandoProductos = true;

    forkJoin({
      productos: this.productosService.getProductos(),
      cultivos: this.cultivosService.getCultivos(),
    })
      .pipe(finalize(() => this.cargandoProductos = false))
      .subscribe({
        next: ({ productos, cultivos }) => {
          this.cultivosPorId = this.crearMapaCultivos(cultivos);
          this.productos = productos;
        },
        error: (error) => {
          console.error('Error al cargar productos', error);
        },
      });
  }

  abrirFormulario(): void {
    this.router.navigate(['/productos/crear']);
  }

  editarProducto(producto: Producto): void {
    this.router.navigate(['/productos/editar', producto.id]);
  }

  eliminarProducto(producto: Producto): void {
    this.productosService.deleteProducto(producto.id).subscribe({
      next: () => {
        this.productos = this.productos.filter((item) => item.id !== producto.id);
      },
      error: (error) => {
        console.error('Error al eliminar producto', error);
      },
    });
  }

  productosFiltrados(): Producto[] {
    const termino = this.busqueda.trim().toLowerCase();

    if (!termino) {
      return this.productos;
    }

    return this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(termino)
        || this.obtenerCultivo(producto).toLowerCase().includes(termino)
    );
  }

  obtenerCultivo(producto: Producto): string {
    return this.cultivosPorId.get(producto.idCultivo) ?? 'Cultivo no asignado';
  }

  private crearMapaCultivos(cultivos: Cultivo[]): Map<string, string> {
    return new Map(
      cultivos
        .filter((cultivo): cultivo is Required<Pick<Cultivo, 'id' | 'nombre'>> & Cultivo =>
          Boolean(cultivo.id && cultivo.nombre)
        )
        .map((cultivo) => [cultivo.id, cultivo.nombre])
    );
  }
}
