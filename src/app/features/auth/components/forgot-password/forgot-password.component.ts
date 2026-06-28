import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonTitle,
} from '@ionic/angular/standalone';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/service/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../auth-page.shared.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonSpinner,
    IonText,
    IonTitle,
  ],
})
export class ForgotPasswordComponent {
  correo = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  enviarEnlace(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const correo = this.correo.trim();

    if (this.loading) {
      return;
    }

    if (!correo) {
      this.errorMessage = 'Ingresa tu correo para continuar.';
      return;
    }

    if (!this.isValidEmail(correo)) {
      this.errorMessage = 'Ingresa un correo valido.';
      return;
    }

    this.loading = true;

    this.authService.forgotPassword({ correo })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          void this.router.navigate(['/login'], { queryParams: { message: 'reset-sent' } });
        },
        error: (error) => {
          const backendMessage = error?.error?.message;
          this.errorMessage = Array.isArray(backendMessage)
            ? backendMessage[0]
            : backendMessage ?? 'No se pudo procesar la solicitud.';
        },
      });
  }

  private isValidEmail(correo: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  }
}
