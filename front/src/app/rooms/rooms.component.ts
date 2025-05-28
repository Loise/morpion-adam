import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rooms',
  imports: [NgFor],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {
  private router = inject(Router)
  // Liste des salons à afficher
  rooms: { name: string, id: string }[] = [
    { name: 'Salon 1', id: 'room1' },
    { name: 'Salon 2', id: 'room2' },
    { name: 'Salon 3', id: 'room3' }
  ];


  constructor(private socketService: SocketService) {}

  /**
   * Gère la sélection d'un salon.
   * Pour l'instant, affiche simplement le salon sélectionné dans la console.
   * Vous pouvez ajouter ici une logique de navigation ou d'entrée dans le salon.
   * @param room Le salon sélectionné.
   */
  selectRoom(room: { name: string, id: string }): void {
    console.log(`Vous avez sélectionné le salon: ${room.name} (ID: ${room.id})`);
    // Exemple de logique future :
    // this.router.navigate(['/chat', room.id]);
    this.router.navigate(['/game/' + room.id]);
  }
}