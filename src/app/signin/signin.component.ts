import { Component } from '@angular/core';
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-signin',
  imports: [FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  private http = inject(HttpClient);
  readonly url = 'http://localhost:3000/user/signin';
  email: string = '';
  password: string = '';

  signin(email: string, password: string): Observable<string> {
    return this.http.post<string>(this.url, {email, password});
  }


  onSubmit() {
    // Implement your login logic here
    console.log('Username:', this.email);
    console.log('Password:', this.password);
    try {

    const res = this.signin(this.email, this.password).subscribe()
    console.log(res);
    } catch(e) {
      console.log(e)
    }
    // Add authentication logic and navigate to the next page upon successful login
  }
}
