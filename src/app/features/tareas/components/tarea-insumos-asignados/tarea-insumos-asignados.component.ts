import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Insumo } from '../../../../core/models/insumo.model';
import { InsumoAsignado } from '../../../../core/models/tarea.model';
import { InsumosService } from '../../../../core/service/insumos.service';

@Component({
  selector: 'app-tarea-insumos-asignados',
  templateUrl: './tarea-insumos-asignados.component.html',
  styleUrls: ['./tarea-insumos-asignados.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon,
    IonInput,
    IonItem,
    IonSelect,
    IonSelectOption,
  ],
})
export class TareaInsumosAsignadosComponent implements OnInit {
  @Input()
  set asignaciones(value: InsumoAsignado[] | null | undefined) {
    this._asignaciones = (value ?? []).map((item) => ({ ...item }));
  }

  get asignaciones(): InsumoAsignado[] {
    return this._asignaciones;
  }

  @Output() readonly asignacionesChange = new EventEmitter<InsumoAsignado[]>();

  insumos: Insumo[] = [];
  cargando = false;
  insumoSeleccionado = '';
  cantidad: number | null = null;

  private _asignaciones: InsumoAsignado[] = [];

  constructor(private readonly insumosService: InsumosService) {
    addIcons({ addOutline, trashOutline });
  }

  ngOnInit(): void {
    this.cargarInsumos();
  }

  cargarInsumos(): void {
    this.cargando = true;

    this.insumosService.getInsumos()
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (insumos) => {
          this.insumos = insumos;
        },
        error: (error) => {
          console.error('Error al cargar insumos', error);
        },
      });
  }

  agregarInsumo(): void {
    const idInsumo = this.insumoSeleccionado.trim();
    const cantidad = Number(this.cantidad);

    if (!idInsumo || !Number.isFinite(cantidad) || cantidad <= 0) {
      return;
    }

    if (this.asignaciones.some((item) => item.idInsumo === idInsumo)) {
      return;
    }

    this.actualizarAsignaciones([
      ...this.asignaciones,
      { idInsumo, cantidad },
    ]);

    this.insumoSeleccionado = '';
    this.cantidad = null;
  }

  eliminarInsumo(index: number): void {
    this.actualizarAsignaciones(
      this.asignaciones.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  insumoDisponible(idInsumo: string): boolean {
    return !this.asignaciones.some((item) => item.idInsumo === idInsumo);
  }

  obtenerNombreInsumo(idInsumo: string): string {
    return this.insumos.find((item) => item.id === idInsumo)?.descripcion ?? 'Insumo no encontrado';
  }

  trackByInsumoId(_: number, item: InsumoAsignado): string {
    return item.idInsumo;
  }

  private actualizarAsignaciones(asignaciones: InsumoAsignado[]): void {
    this._asignaciones = asignaciones.map((item) => ({ ...item }));
    this.asignacionesChange.emit(this.asignaciones);
  }
}

