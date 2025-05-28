import { Component } from '@angular/core';
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signin',
  imports: [FormsModule, CommonModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  private http = inject(HttpClient);
  private router = inject(Router)
  readonly url = 'http://localhost:3000/user/signin';
  email: string = '';
  username: string = '';

  password: string = '';
    // Liste d'avatars pour l'utilisateur
    avatarList: string[] = [
      'assets/avatars/avatar1.png',
      'assets/avatars/avatar2.png',
      'assets/avatars/avatar3.png',
      'assets/avatars/avatar4.png'
    ];
    
    selectedAvatar: string = '';

  onSubmit() {
    // Implement your login logic here
    // Add authentication logic and navigate to the next page upon successful login
    const userData = {
      email: this.email, 
      password: this.password,
      username: this.username,
      avatar: this.selectedAvatar,
    };
    
    this.http.post('http://localhost:3000/user/signin', userData)
        .subscribe(res => {
          console.log('Utilisateur créé', res);
          this.router.navigate(['/login']);
        });
  }

  /**
   * Sélectionne un avatar pour l'utilisateur.
   * @param avatar - Chemin de l'avatar sélectionné.
   */
  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    console.log("Avatar sélectionné :", avatar);
  }

  /*navigateToLogin() {
    this.router.navigate(['/login']);
  }*/
}