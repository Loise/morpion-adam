import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Nécessaire pour les directives comme *ngIf
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service'; // Assurez-vous que le chemin est correct
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
@Component({
  selector: 'app-login',
  standalone: true, // Marque ce composant comme autonome (Angular 15+)
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // Si AuthService n'est pas fourni au niveau de 'root', vous pouvez le fournir ici:
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Formulaire réactif pour la connexion
  loading: boolean = false; // Indicateur de chargement
  errorMessage: string | null = null; // Message d'erreur à afficher
  
 
  private router = inject(Router)
  constructor(
    private fb: FormBuilder, // Injecte FormBuilder pour créer le formulaire
    private authService: AuthService // Injecte notre AuthService
  ) { }

  ngOnInit(): void {
    // Initialise le formulaire avec les champs 'username' et 'password'
    // et les validateurs nécessaires.
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Champ nom d'utilisateur, requis (correspond à 'email' dans votre backend)
      password: ['', Validators.required]  // Champ mot de passe, requis
    });
  }

  /**
   * Gère la soumission du formulaire de connexion.
   */
  onSubmit(): void {
    this.loading = true; // Active l'indicateur de chargement
    this.errorMessage = null; // Réinitialise le message d'erreur

    if (this.loginForm.invalid) {
      // Si le formulaire n'est pas valide (champs manquants),
      // affiche un message d'erreur et arrête le processus.
      this.errorMessage = 'Veuillez remplir tous les champs.';
      this.loading = false;
      return;
    }

    const { username, password } = this.loginForm.value; // 'username' correspondra à 'email' pour le backend

    // Appelle la méthode login du AuthService
    this.authService.login(username, password).subscribe({
      next: (accessToken: string) => { // <--- Ici, nous récupérons directement le jeton
        // En cas de succès, stocke le jeton et affiche un message de succès.
        if (accessToken) {
          this.authService.storeToken(accessToken); // <--- Stocke le jeton
          console.log('Connexion réussie ! Jeton stocké:', accessToken);
          // Vous pouvez rediriger l'utilisateur ici, par exemple:
          this.router.navigate(['/rooms']);
        } else {
          this.errorMessage = 'Connexion réussie, mais aucun jeton valide n\'a été reçu.';
        }
        this.loading = false;
      },
      error: (error) => {
        // En cas d'erreur, affiche le message d'erreur.
        this.errorMessage = error.message || 'Échec de la connexion. Veuillez réessayer.';
        console.error('Erreur de connexion:', error);
        this.loading = false;
      }
    });
  }

  /*navigateToSignin() {
    this.router.navigate(['/signin']);
  }*/

}