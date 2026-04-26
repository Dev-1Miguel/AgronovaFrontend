import { Component } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { basket, fileTrayFull, leaf, menu, people, readerOutline} from 'ionicons/icons';
import { DASHBOARD_MODULES } from '../../core/models/dashboard-module.model';
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
    IonTitle,
    IonToolbar,
    ModuleCardComponent,
  ],
})
export class DashboardPage {
  protected readonly modules = DASHBOARD_MODULES;

  constructor() {
    addIcons({ basket, fileTrayFull, leaf, menu, people, readerOutline});
  }
}
