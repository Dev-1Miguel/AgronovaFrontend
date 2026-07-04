import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  eyeOffOutline,
  eyeOutline,
  leafOutline,
  lockClosedOutline,
  mailOutline,
  personOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['../auth-page.shared.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonSpinner,
    IonText,
    IonTitle,
  ],
})
export class RegisterComponent {
  nombre = '';
  correo = '';
  contrasena = '';
  confirmarContrasena = '';
  loading = false;
  errorMessage = '';
  mostrarContrasena = false;
  mostrarConfirmarContrasena = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    addIcons({
      leafOutline,
      personOutline,
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      arrowBackOutline,
    });
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  toggleMostrarConfirmarContrasena(): void {
    this.mostrarConfirmarContrasena = !this.mostrarConfirmarContrasena;
  }

  registrar(): void {
    this.errorMessage = '';

    const nombre = this.nombre.trim();
    const correo = this.correo.trim();
    const contrasena = this.contrasena;
    const confirmarContrasena = this.confirmarContrasena;

    if (this.loading) {
      return;
    }

    if (!nombre || !correo || !contrasena || !confirmarContrasena) {
      this.errorMessage = 'Completa todos los campos para crear tu cuenta.';
      return;
    }

    if (!this.isValidEmail(correo)) {
      this.errorMessage = 'Ingresa un correo valido.';
      return;
    }

    if (contrasena.length < 8) {
      this.errorMessage = 'La contrasena debe tener al menos 8 caracteres.';
      return;
    }

    if (contrasena !== confirmarContrasena) {
      this.errorMessage = 'Las contrasenas no coinciden.';
      return;
    }

    this.loading = true;

    this.authService.register({ nombre, correo, contrasena })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          void this.router.navigate(['/login'], { queryParams: { message: 'registered' } });
        },
        error: (error) => {
          const backendMessage = error?.error?.message;
          this.errorMessage = Array.isArray(backendMessage)
            ? backendMessage[0]
            : backendMessage ?? 'No se pudo crear la cuenta.';
        },
      });
  }

  private isValidEmail(correo: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  }
}
