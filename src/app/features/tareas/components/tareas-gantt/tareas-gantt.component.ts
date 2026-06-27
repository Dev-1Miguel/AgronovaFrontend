import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Tarea } from '../../../../core/models/tarea.model';

interface GanttTaskViewModel {
  tarea: Tarea;
  start: Date;
  end: Date;
  estadoClase: string;
  estadoLabel: string;
  fechaInicioLabel: string;
  fechaFinLabel: string;
  offsetPx: number;
  widthPx: number;
}

@Component({
  selector: 'app-tareas-gantt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas-gantt.component.html',
  styleUrls: ['./tareas-gantt.component.scss'],
})
export class TareasGanttComponent implements OnChanges {
  @Input() tareas: Tarea[] = [];

  fechaSeleccionada = '';
  readonly dayWidth = 44;
  ganttItems: GanttTaskViewModel[] = [];
  timelineDays: Date[] = [];

  private readonly dayNumberFormatter = new Intl.DateTimeFormat('es-EC', { day: '2-digit' });
  private readonly dayMonthFormatter = new Intl.DateTimeFormat('es-EC', { month: 'short' });
  private readonly shortDateFormatter = new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tareas']) {
      this.reconstruirVista();
    }
  }

  onFechaSeleccionadaChange(): void {
    this.reconstruirVista();
  }

  limpiarFiltroFecha(): void {
    this.fechaSeleccionada = '';
    this.reconstruirVista();
  }

  get timelineWidthPx(): number {
    return Math.max(this.timelineDays.length * this.dayWidth, this.dayWidth);
  }

  get mensajeSinResultados(): string {
    return this.fechaSeleccionada
      ? 'No hay tareas para la fecha seleccionada.'
      : 'No hay tareas disponibles para mostrar en el Gantt.';
  }

  trackByDay(_index: number, day: Date): string {
    return day.toISOString();
  }

  trackByTarea(_index: number, item: GanttTaskViewModel): string {
    return item.tarea.id;
  }

  formatearDiaNumero(day: Date): string {
    return this.dayNumberFormatter.format(day);
  }

  formatearDiaMes(day: Date): string {
    return this.dayMonthFormatter.format(day);
  }

  private reconstruirVista(): void {
    const tareasNormalizadas = this.tareas
      .map((tarea) => this.normalizarTarea(tarea))
      .filter((item): item is Omit<GanttTaskViewModel, 'offsetPx' | 'widthPx'> => Boolean(item));

    const fechaFiltro = this.parseDateInput(this.fechaSeleccionada);
    const tareasFiltradas = fechaFiltro
      ? tareasNormalizadas.filter((item) => this.estaDentroDelRango(fechaFiltro, item.start, item.end))
      : tareasNormalizadas;

    if (!tareasFiltradas.length) {
      this.ganttItems = [];
      this.timelineDays = [];
      return;
    }

    const timelineStart = tareasFiltradas.reduce(
      (min, item) => item.start.getTime() < min.getTime() ? item.start : min,
      tareasFiltradas[0].start,
    );
    const timelineEnd = tareasFiltradas.reduce(
      (max, item) => item.end.getTime() > max.getTime() ? item.end : max,
      tareasFiltradas[0].end,
    );

    this.timelineDays = this.crearDiasTimeline(timelineStart, timelineEnd);
    this.ganttItems = tareasFiltradas
      .sort((left, right) => {
        const diferencia = left.start.getTime() - right.start.getTime();
        return diferencia !== 0 ? diferencia : left.tarea.nombre.localeCompare(right.tarea.nombre);
      })
      .map((item) => {
        const duracionDias = this.diferenciaEnDias(item.start, item.end) + 1;

        return {
          ...item,
          offsetPx: this.diferenciaEnDias(timelineStart, item.start) * this.dayWidth + 4,
          widthPx: Math.max(duracionDias * this.dayWidth - 8, 36),
        };
      });
  }

  private normalizarTarea(tarea: Tarea): Omit<GanttTaskViewModel, 'offsetPx' | 'widthPx'> | null {
    const start = this.parseTaskDate(tarea.fechaInicio);

    if (!start) {
      return null;
    }

    const parsedEnd = this.parseTaskDate(tarea.fechaFin);
    const end = parsedEnd && parsedEnd.getTime() >= start.getTime() ? parsedEnd : start;
    const estado = this.resolverEstado(tarea.estado);

    return {
      tarea,
      start,
      end,
      estadoClase: estado.clase,
      estadoLabel: estado.label,
      fechaInicioLabel: this.shortDateFormatter.format(start),
      fechaFinLabel: this.shortDateFormatter.format(end),
    };
  }

  private resolverEstado(estado?: string): { clase: string; label: string } {
    const label = estado?.trim() || 'Pendiente';
    const normalizado = label.toLowerCase();

    if (normalizado === 'completada' || normalizado === 'completado') {
      return { clase: 'estado-completada', label: 'Completada' };
    }

    if (normalizado === 'inactivo') {
      return { clase: 'estado-inactivo', label: 'Inactivo' };
    }

    if (normalizado === 'activo') {
      return { clase: 'estado-activo', label: 'Activo' };
    }

    return { clase: 'estado-pendiente', label };
  }

  private parseTaskDate(value?: string): Date | null {
    if (!value) {
      return null;
    }

    const directMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (directMatch) {
      const [, year, month, day] = directMatch;
      return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0, 0);
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 12, 0, 0, 0);
  }

  private parseDateInput(value: string): Date | null {
    return this.parseTaskDate(value);
  }

  private crearDiasTimeline(start: Date, end: Date): Date[] {
    const days: Date[] = [];
    const current = new Date(start.getTime());

    while (current.getTime() <= end.getTime()) {
      days.push(new Date(current.getTime()));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  private estaDentroDelRango(selected: Date, start: Date, end: Date): boolean {
    return selected.getTime() >= start.getTime() && selected.getTime() <= end.getTime();
  }

  private diferenciaEnDias(start: Date, end: Date): number {
    const msPorDia = 1000 * 60 * 60 * 24;
    return Math.round((end.getTime() - start.getTime()) / msPorDia);
  }
}
