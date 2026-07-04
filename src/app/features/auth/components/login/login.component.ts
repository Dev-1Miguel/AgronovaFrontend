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
import { eyeOffOutline, eyeOutline, leafOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['../auth-page.shared.scss', './login.component.scss'],
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
export class LoginComponent implements OnInit {
  correo = '';
  contrasena = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  mostrarContrasena = false;

  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    addIcons({ leafOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });

    if (this.authService.isAuthenticated()) {
      void this.router.navigate(['/dashboard']);
      return;
    }

    const message = this.activatedRoute.snapshot.queryParamMap.get('message');
    this.successMessage = this.getSuccessMessage(message);
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  iniciarSesion(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const correo = this.correo.trim();
    const contrasena = this.contrasena;

    if (!correo || !contrasena || this.loading) {
      if (!correo || !contrasena) {
        this.errorMessage = 'Ingresa correo y contrasena para continuar.';
      }
      return;
    }

    this.loading = true;

    this.authService.login({ correo, contrasena })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          void this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'No se pudo iniciar sesion. Verifica tus credenciales.';
        },
      });
  }

  private getSuccessMessage(message: string | null): string {
    switch (message) {
      case 'registered':
        return 'Tu cuenta fue creada. Inicia sesion para continuar.';
      case 'reset-sent':
        return 'Revisa tu correo si la cuenta existe. Enviamos un enlace de recuperacion.';
      case 'password-reset':
        return 'Tu contrasena fue actualizada. Ya puedes iniciar sesion.';
      default:
        return '';
    }
  }
}
