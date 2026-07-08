import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, people, settingsOutline, shieldCheckmarkOutline } from 'ionicons/icons';

import { ModuleCardComponent } from '../../../../shared/components/module-card/module-card.component';
import { ADMINISTRATION_MODULES } from './administracion.modules';

@Component({
  selector: 'app-administracion',
  standalone: true,
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss'],
  imports: [IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModuleCardComponent],
})
export class AdministracionComponent {
  private readonly router = inject(Router);

  protected readonly modules = ADMINISTRATION_MODULES;

  constructor() {
    addIcons({ arrowBackOutline, people, settingsOutline, shieldCheckmarkOutline });
  }

  volverAlDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }
}
