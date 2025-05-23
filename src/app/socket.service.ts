import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); // Connect to Socket.IO server
  }

  // Method to send message to the server
 sendMessage(eventName: string, data: any): void {
    if (this.socket.connected) {
      this.socket.emit(eventName, data);
      console.log(`Événement '${eventName}' émis avec les données:`, data);
    } else {
      console.warn('Socket non connecté. Impossible d\'émettre l\'événement:', eventName);
    }
  }

  // Observable to receive messages from the server
  onMessage(callback: (message: string) => void): void {
    this.socket.on('message', callback);
  }
}