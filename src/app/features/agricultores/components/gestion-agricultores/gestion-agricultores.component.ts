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
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, peopleOutline, trashOutline } from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Agricultor } from '../../../../core/models/agricultor.model';
import { AgricultoresService } from '../../../../core/service/agricultores.service';

@Component({
  selector: 'app-gestion-agricultores',
  templateUrl: './gestion-agricultores.component.html',
  styleUrls: ['./gestion-agricultores.component.scss'],
  standalone: true,
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
    IonSearchbar,
    IonTitle,
    IonToolbar,
  ],
})
export class GestionAgricultoresComponent {
  busqueda = '';
  agricultores: Agricultor[] = [];
  cargandoAgricultores = false;

  constructor(
    private readonly agricultoresService: AgricultoresService,
    private readonly router: Router,
  ) {
    addIcons({ addOutline, createOutline, peopleOutline, trashOutline });
  }

  ionViewWillEnter(): void {
    this.cargarAgricultores();
  }

  cargarAgricultores(): void {
    this.cargandoAgricultores = true;

    this.agricultoresService.getAgricultores()
      .pipe(finalize(() => this.cargandoAgricultores = false))
      .subscribe({
        next: (agricultores) => {
          this.agricultores = agricultores;
        },
        error: (error) => {
          console.error('Error al cargar agricultores', error);
        },
      });
  }

  abrirFormulario(): void {
    this.router.navigate(['/agricultores/crear']);
  }

  editarAgricultor(agricultor: Agricultor): void {
    this.router.navigate(['/agricultores/editar', agricultor.id]);
  }

  eliminarAgricultor(agricultor: Agricultor): void {
    this.agricultoresService.deleteAgricultor(agricultor.id).subscribe({
      next: () => {
        this.agricultores = this.agricultores.filter((item) => item.id !== agricultor.id);
      },
      error: (error) => {
        console.error('Error al eliminar agricultor', error);
      },
    });
  }

  agricultoresFiltrados(): Agricultor[] {
    const termino = this.busqueda.trim().toLowerCase();

    if (!termino) {
      return this.agricultores;
    }

    return this.agricultores.filter((agricultor) =>
      agricultor.nombre.toLowerCase().includes(termino)
        || agricultor.zona.toLowerCase().includes(termino)
        || agricultor.experiencia.toLowerCase().includes(termino)
    );
  }
}
