import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  fileTrayFull,
  leaf,
  logOutOutline,
  people,
  personCircleOutline,
  personOutline,
  readerOutline,
  settingsOutline,
} from 'ionicons/icons';
import { finalize, forkJoin } from 'rxjs';
import { DASHBOARD_MODULES } from '../../core/models/dashboard-module.model';
import { AuthenticatedUser } from '../../core/models/auth.model';
import { AuthService } from '../../core/service/auth.service';
import { CultivosService } from '../../core/service/cultivos.service';
import { InsumosService } from '../../core/service/insumos.service';
import { TareasService } from '../../core/service/tareas.service';
import { getHttpErrorMessage } from '../../core/utils/http-error-message.util';
import { ModuleCardComponent } from '../../shared/components/module-card/module-card.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPopover,
    IonText,
    IonTitle,
    IonToolbar,
    ModuleCardComponent,
  ],
})
export class DashboardPage {
  protected readonly kpis = [
    {
      value: 0,
      label: 'Cultivos activos',
      hint: 'Lotes visibles para gestion diaria',
      accentClass: 'accent-cultivos',
    },
    {
      value: 0,
      label: 'Tareas pendientes',
      hint: 'Tareas no completadas',
      accentClass: 'accent-tareas',
    },
    {
      value: 0,
      label: 'Insumos registrados',
      hint: 'Inventario operativo disponible',
      accentClass: 'accent-insumos',
    },
  ];
  protected cargandoResumen = false;
  protected errorResumen = '';
  protected menuUsuarioAbierto = false;
  protected currentUser: AuthenticatedUser | null = null;
  private readonly authService = inject(AuthService);
  private readonly cultivosService = inject(CultivosService);
  private readonly tareasService = inject(TareasService);
  private readonly insumosService = inject(InsumosService);
  private readonly router = inject(Router);

  constructor() {
    addIcons({
      fileTrayFull,
      leaf,
      logOutOutline,
      people,
      personCircleOutline,
      personOutline,
      readerOutline,
      settingsOutline,
    });
  }

  get nombreUsuario(): string {
    return this.currentUser?.nombre?.trim() || 'Usuario';
  }

  get modules() {
    return DASHBOARD_MODULES.filter((module) => !module.adminOnly || this.currentUser?.rol === 'Administrador');
  }

  ionViewWillEnter(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.cargarResumen();
  }

  abrirMenuUsuario(): void {
    this.menuUsuarioAbierto = true;
  }

  cerrarMenuUsuario(): void {
    this.menuUsuarioAbierto = false;
  }

  cerrarSesion(): void {
    this.cerrarMenuUsuario();
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  private cargarResumen(): void {
    this.cargandoResumen = true;
    this.errorResumen = '';
    forkJoin({
      cultivos: this.cultivosService.getCultivos(),
      tareas: this.tareasService.getTareas(),
      insumos: this.insumosService.getInsumos(),
    })
      .pipe(finalize(() => (this.cargandoResumen = false)))
      .subscribe({
        next: ({ cultivos, tareas, insumos }) => {
          this.kpis[0].value = cultivos.length;
          this.kpis[1].value = tareas.filter((tarea) => tarea.estado !== 'Completada').length;
          this.kpis[2].value = insumos.length;
        },
        error: (error) => {
          this.errorResumen = getHttpErrorMessage(
            error,
            'No se pudo cargar el resumen operativo. La navegacion del Dashboard sigue disponible.',
          );
          console.error('Error al cargar resumen del dashboard', error);
        },
      });
  }
}
