import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { RoomsComponent } from './rooms/rooms.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'rooms', component: RoomsComponent },
];
