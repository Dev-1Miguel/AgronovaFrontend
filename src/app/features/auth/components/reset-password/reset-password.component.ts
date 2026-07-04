import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/service/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
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
export class ResetPasswordComponent implements OnInit {
  token = '';
  contrasena = '';
  confirmarContrasena = '';
  loading = false;
  errorMessage = '';
  mostrarContrasena = false;
  mostrarConfirmarContrasena = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    addIcons({
      leafOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      arrowBackOutline,
    });
  }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token')?.trim() ?? '';

    if (!this.token) {
      this.errorMessage = 'El enlace de recuperacion no es valido o esta incompleto.';
    }
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  toggleMostrarConfirmarContrasena(): void {
    this.mostrarConfirmarContrasena = !this.mostrarConfirmarContrasena;
  }

  restablecerContrasena(): void {
    this.errorMessage = '';

    if (this.loading) {
      return;
    }

    if (!this.token) {
      this.errorMessage = 'El enlace de recuperacion no es valido o esta incompleto.';
      return;
    }

    if (!this.contrasena || !this.confirmarContrasena) {
      this.errorMessage = 'Completa ambos campos para continuar.';
      return;
    }

    if (this.contrasena.length < 8) {
      this.errorMessage = 'La contrasena debe tener al menos 8 caracteres.';
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      this.errorMessage = 'Las contrasenas no coinciden.';
      return;
    }

    this.loading = true;

    this.authService.resetPassword({
      token: this.token,
      contrasena: this.contrasena,
    })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          void this.router.navigate(['/login'], { queryParams: { message: 'password-reset' } });
        },
        error: (error) => {
          const backendMessage = error?.error?.message;
          this.errorMessage = Array.isArray(backendMessage)
            ? backendMessage[0]
            : backendMessage ?? 'No se pudo restablecer la contrasena.';
        },
      });
  }
}
