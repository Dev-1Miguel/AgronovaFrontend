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
  IonModal,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  eyeOutline,
  peopleOutline,
  personOutline,
  saveOutline,
  shieldHalfOutline,
  timeOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { AuthenticatedUser } from '../../../../core/models/auth.model';
import { Usuario } from '../../../../core/models/usuario.model';
import { AuthService } from '../../../../core/service/auth.service';
import { UsuariosService } from '../../../../core/service/usuarios.service';
import { getHttpErrorMessage } from '../../../../core/utils/http-error-message.util';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss'],
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
    IonModal,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar,
  ],
})
export class GestionUsuariosComponent {
  busqueda = '';
  usuarios: Usuario[] = [];
  cargando = false;
  cargandoDetalle = false;
  guardandoRol = false;
  guardandoEstado = false;
  errorCarga = '';
  errorAccion = '';
  modalAbierto = false;
  usuarioDetalle: Usuario | null = null;
  rolFormulario: 'Administrador' | 'Lider' = 'Lider';
  estadoFormulario: 'Activo' | 'Inactivo' = 'Activo';
  private readonly currentUser: AuthenticatedUser | null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly usuariosService: UsuariosService,
  ) {
    addIcons({
      arrowBackOutline,
      eyeOutline,
      peopleOutline,
      personOutline,
      saveOutline,
      shieldHalfOutline,
      timeOutline,
    });

    this.currentUser = this.authService.getCurrentUser();
  }

  ionViewWillEnter(): void {
    this.cargarUsuarios();
  }

  volverAAdministracion(): void {
    void this.router.navigate(['/administracion']);
  }

  buscarUsuarios(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.errorCarga = '';

    this.usuariosService.getUsuarios(this.busqueda)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios;
        },
        error: (error) => {
          this.errorCarga = getHttpErrorMessage(error, 'No se pudieron cargar los usuarios en este momento.');
          console.error('Error al cargar usuarios', error);
        },
      });
  }

  abrirDetalle(usuario: Usuario): void {
    this.errorAccion = '';
    this.modalAbierto = true;
    this.cargandoDetalle = true;
    this.usuarioDetalle = null;

    this.usuariosService.getUsuarioById(usuario.id)
      .pipe(finalize(() => this.cargandoDetalle = false))
      .subscribe({
        next: (detalle) => {
          this.usuarioDetalle = detalle;
          this.rolFormulario = detalle.rol === 'Administrador' ? 'Administrador' : 'Lider';
          this.estadoFormulario = detalle.estado === 'Inactivo' ? 'Inactivo' : 'Activo';
        },
        error: (error) => {
          this.errorAccion = getHttpErrorMessage(error, 'No se pudo cargar el detalle del usuario.');
          console.error('Error al cargar detalle del usuario', error);
        },
      });
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.usuarioDetalle = null;
    this.errorAccion = '';
    this.cargandoDetalle = false;
  }

  guardarRol(): void {
    if (!this.usuarioDetalle || this.guardandoRol || this.bloquearCambioPropioRol) {
      return;
    }

    if (this.rolFormulario === this.usuarioDetalle.rol) {
      return;
    }

    this.guardandoRol = true;
    this.errorAccion = '';

    this.usuariosService.updateRol(this.usuarioDetalle.id, { rol: this.rolFormulario })
      .pipe(finalize(() => this.guardandoRol = false))
      .subscribe({
        next: (usuarioActualizado) => {
          this.sincronizarUsuario(usuarioActualizado);
        },
        error: (error) => {
          this.errorAccion = getHttpErrorMessage(error, 'No se pudo actualizar el rol del usuario.');
          console.error('Error al actualizar rol', error);
        },
      });
  }

  guardarEstado(): void {
    if (!this.usuarioDetalle || this.guardandoEstado || this.bloquearCambioPropioEstado) {
      return;
    }

    if (this.estadoFormulario === this.usuarioDetalle.estado) {
      return;
    }

    this.guardandoEstado = true;
    this.errorAccion = '';

    this.usuariosService.updateEstado(this.usuarioDetalle.id, { estado: this.estadoFormulario })
      .pipe(finalize(() => this.guardandoEstado = false))
      .subscribe({
        next: (usuarioActualizado) => {
          this.sincronizarUsuario(usuarioActualizado);
        },
        error: (error) => {
          this.errorAccion = getHttpErrorMessage(error, 'No se pudo actualizar el estado del usuario.');
          console.error('Error al actualizar estado', error);
        },
      });
  }

  get bloquearCambioPropioRol(): boolean {
    return this.esUsuarioActual(this.usuarioDetalle);
  }

  get bloquearCambioPropioEstado(): boolean {
    return this.esUsuarioActual(this.usuarioDetalle);
  }

  formatearUltimoAcceso(ultimoAcceso: string | null): string {
    if (!ultimoAcceso) {
      return 'Sin acceso registrado';
    }

    const fecha = new Date(ultimoAcceso);

    if (Number.isNaN(fecha.getTime())) {
      return 'Sin acceso registrado';
    }

    return fecha.toLocaleString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private esUsuarioActual(usuario: Usuario | null): boolean {
    return Boolean(usuario && this.currentUser?.id === usuario.id);
  }

  private sincronizarUsuario(usuarioActualizado: Usuario): void {
    this.usuarioDetalle = usuarioActualizado;
    this.rolFormulario = usuarioActualizado.rol === 'Administrador' ? 'Administrador' : 'Lider';
    this.estadoFormulario = usuarioActualizado.estado === 'Inactivo' ? 'Inactivo' : 'Activo';
    this.usuarios = this.usuarios.map((usuario) => usuario.id === usuarioActualizado.id ? usuarioActualizado : usuario);
  }
}

