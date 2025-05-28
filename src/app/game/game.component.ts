import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-game',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [AuthService]
})
export class GameComponent implements OnInit {
  roomId: string = 'salon 1';
  userId: string | null;
  playerUsername: string = '';
  opponentUsername: string = '';
  board: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
  currentPlayer: string = 'X';
  gameOver: boolean = false;
  winner: string | null = null;
  isMyTurn: boolean = true;
  playerSymbol: string = 'X';
  showBoxscore: boolean = false;
  users: any[] = [];
  bestUsers: any[] = [];
  participants: any[] = [];

  playerAvatar: string = 'assets/avatars/avatar1.png'; // Avatar par défaut
  opponentAvatar: string = 'assets/avatars/avatar2.png'; // Avatar par défaut de l'adversaire

  startTime: number = 0;
  gameDuration: string = '';

  private socket!: Socket;

  constructor(private route: ActivatedRoute, private authService: AuthService) {
    this.route.params.subscribe(params => {
      this.roomId = params['id']
    });
    this.userId = this.authService.getUserId();
    
  }

  ngOnInit(): void {
    // Connexion au serveur socket
    this.socket = io('http://localhost:3000');

    // Récupération de l'identifiant utilisateur et de la room depuis localStorage
    /*this.roomId = localStorage.getItem('roomId') || '';*/

    // Envoie une demande pour rejoindre une room
    this.socket.emit('joinRoom', { roomId: this.roomId, userId: this.userId });
    console.log('joinRoom', { roomId: this.roomId, userId: this.userId })

    // Réception des infos des deux joueurs connectés à la room
    this.socket.on('playersInfo', (users: any[]) => {
      this.users = users;

      const me = users.find(u => u._id === this.userId);
      const opponent = users.find(u => u._id !== this.userId);

      this.playerUsername = me?.username || 'Moi';
      this.opponentUsername = opponent?.username || 'Adversaire';
    });

    // Événement de redémarrage de la partie
    this.socket.on('restartGame', () => {
      this.onClickRejouer();
    });

    this.socket.on('play', (data: any) => {
      console.log(data);
      this.board[data.abs][data.ord] = data.userId === this.userId ? 'X' : '0';
  })
}

  /**
   * Réinitialise la partie
   */
  resetBoard(): void {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    this.currentPlayer = 'X';
    this.gameOver = false;
    this.winner = null;

    this.startTime = Date.now(); // Enregistre le moment où la partie commence

    this.socket.emit('restartGame');

    console.log('Nouvelle partie');
  }

  onClickRejouer(): void {
    this.socket.emit('restartGame');
    this.resetBoard();
  }

  // logique de jeu
  playMove(row: number, col: number): void {
    if (this.board[row][col] !== '' || this.gameOver) return;
  
    this.board[row][col] = this.currentPlayer;
  this.socket.emit('game progress', {
      roomId: this.roomId,
      userId: this.userId,
      abs: row,
      ord: col,
      cross: this.currentPlayer,
    });

    if (this.startTime === 0) {
      this.startTime = Date.now(); // Enregistre le moment où la partie commence
  }
    if (this.checkWin()) {
      this.gameOver = true;
      this.winner = this.currentPlayer;
      this.calculateGameDuration();
  
      this.socket.emit('gameFinished', {
        roomId: this.roomId,
        winner: this.winner,
        duration: this.gameDuration,
      });
  
    } else if (this.checkDraw()) {
      this.gameOver = true;
      this.winner = 'draw';
      this.calculateGameDuration();
  
      this.socket.emit('gameFinished', {
        roomId: this.roomId,
        winner: this.winner,
        duration: this.gameDuration,
      });
  
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      this.isMyTurn = false;
    }
  }
  

  checkWin(): boolean {
    const b = this.board;
    const p = this.currentPlayer;

    return (
      [0, 1, 2].some((i) => b[i][0] === p && b[i][1] === p && b[i][2] === p) || // lignes
      [0, 1, 2].some((i) => b[0][i] === p && b[1][i] === p && b[2][i] === p) || // colonnes
      (b[0][0] === p && b[1][1] === p && b[2][2] === p) || // diagonale \
      (b[0][2] === p && b[1][1] === p && b[2][0] === p) // diagonale /
    );
  }

  checkDraw(): boolean {
    return this.board.flat().every((cell) => cell !== '');
  }

  calculateGameDuration(): void {
    const endTime = Date.now();
    const durationMs = endTime - this.startTime;

    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes < 0) {
        this.gameDuration = `La partie a duré ${minutes} min ${seconds} sec`;
    } else {
        this.gameDuration = `La partie a duré ${seconds} sec`;
    }
}


  toggleBoxscore(): void {
    this.showBoxscore = !this.showBoxscore;
  }
}
