import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-module-card',
  templateUrl: './module-card.component.html',
  styleUrls: ['./module-card.component.scss'],
  imports: [IonIcon, RouterLink],
})
export class ModuleCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) icon!: string;
  @Input() route?: string;

  constructor() {
    addIcons({ arrowForwardOutline });
  }
}
