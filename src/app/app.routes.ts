import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { RoomsComponent } from './rooms/rooms.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent }, 
  { path: 'signin', component: SigninComponent },

  { path: 'rooms', component: RoomsComponent },
  { path: 'game/:id', component: GameComponent },

  { path: '**', redirectTo: 'login' }
];
