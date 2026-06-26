import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowBackOutline,
  calendarOutline,
  cashOutline,
  closeCircleOutline,
  personOutline,
  receiptOutline,
  trashOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Venta } from '../../../../core/models/venta.model';
import { VentasService } from '../../../../core/service/ventas.service';

@Component({
  selector: 'app-gestion-ventas',
  templateUrl: './gestion-ventas.component.html',
  styleUrls: ['./gestion-ventas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
  ],
})
export class GestionVentasComponent {
  ventas: Venta[] = [];
  cargando = false;
  anulandoId = '';

  private readonly currencyFormat = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  });

  constructor(
    private readonly ventasService: VentasService,
    private readonly router: Router,
  ) {
    addIcons({
      addOutline,
      arrowBackOutline,
      calendarOutline,
      cashOutline,
      closeCircleOutline,
      personOutline,
      receiptOutline,
      trashOutline,
    });
  }

  ionViewWillEnter(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.cargando = true;

    this.ventasService.getVentas()
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (ventas) => {
          this.ventas = ventas;
        },
        error: (error) => {
          console.error('Error al cargar ventas', error);
        },
      });
  }

  crearVenta(): void {
    this.router.navigate(['/ventas/crear']);
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  anularVenta(venta: Venta): void {
    if (!venta.id || this.anulandoId) {
      return;
    }

    const confirmado = window.confirm(
      `¿Está seguro que desea anular la venta de "${venta.cliente}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.anulandoId = venta.id;

    this.ventasService.anularVenta(venta.id)
      .pipe(finalize(() => this.anulandoId = ''))
      .subscribe({
        next: () => {
          this.ventas = this.ventas.filter((item) => item.id !== venta.id);
        },
        error: (error) => {
          console.error('Error al anular venta', error);
        },
      });
  }

  formatearTotal(total: number): string {
    return this.currencyFormat.format(total);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-EC');
  }

  esAnulada(venta: Venta): boolean {
    return venta.estado === 'Anulada';
  }
}

