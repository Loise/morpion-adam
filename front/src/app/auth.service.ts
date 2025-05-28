import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root' // Le service est disponible dans toute l'application
})
export class AuthService {
  public jwtHelper: JwtHelperService = new JwtHelperService();
  // L'URL est maintenant 'http://localhost:3000/user/login' comme dans votre exemple.
  private loginUrl = 'http://localhost:3000/user/login';

  constructor(private http: HttpClient) {}

  /**
   * Effectue une requête de connexion au backend.
   * @param email L'email de l'utilisateur.
   * @param password Le mot de passe.
   * @returns Un Observable contenant le jeton d'accès directement sous forme de chaîne.
   */
  login(email: string, password: string): Observable<string> {
    // Le type de retour est maintenant 'string' car nous supposons que le backend renvoie le jeton directement.
    return this.http.post(this.loginUrl, { email, password }, { responseType: 'text' })
      .pipe(
        tap(token => {
          // Ici, 'token' est directement la chaîne de caractères du jeton.
          console.log('Jeton reçu dans le service (tap):', token);
          this.storeToken(token)
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Stocke le jeton d'authentification dans le localStorage.
   * @param token Le jeton à stocker.
   */
  storeToken(token: string): void {
    localStorage.setItem('accessToken', token); // Utilisez 'accessToken' comme clé
    console.log('Jeton stocké dans le localStorage sous la clé "accessToken".');
  }

  public getDecodedToken(): any {
    const token = localStorage.getItem('accessToken');// Get your token from storage
    console.log(token);
    if (token) {
      return this.jwtHelper.decodeToken(token);
    }
    return null;
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    // Check whether the token is expired and return true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  // Example of accessing claims
  public getUserId(): string | null {
    const decodedToken = this.getDecodedToken();
    console.log(decodedToken)
    if (decodedToken && decodedToken.userId) { // Assuming 'username' is a claim in your token
      return decodedToken.userId;
    }
    return null;
  }

  /**
   * Récupère le jeton d'authentification depuis le localStorage.
   * @returns Le jeton d'authentification ou null s'il n'existe pas.
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken'); // Récupère avec la clé 'accessToken'
  }

  /**
   * Supprime le jeton d'authentification du localStorage (pour la déconnexion).
   */
  removeToken(): void {
    localStorage.removeItem('accessToken'); // Supprime avec la clé 'accessToken'
    console.log('Jeton supprimé du localStorage.');
  }

  /**
   * Gère les erreurs HTTP provenant des requêtes.
   * @param error L'objet HttpErrorResponse.
   * @returns Un Observable d'erreur.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue!';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client ou réseau
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Le backend a renvoyé un code d'erreur.
      // Le corps de la réponse peut contenir des informations utiles.
      errorMessage = `Code d'erreur du serveur: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        // Si le backend renvoie un message d'erreur dans le corps de la réponse JSON
        // (même si le type de réponse est 'text', si le backend envoie du JSON en cas d'erreur)
        try {
          const errorBody = JSON.parse(error.error);
          errorMessage = `Code d'erreur du serveur: ${error.status}\nMessage: ${errorBody.message || error.message}`;
        } catch (e) {
          // Si l'erreur n'est pas un JSON parsable, utilisez le message brut
          errorMessage = `Code d'erreur du serveur: ${error.status}\nMessage: ${error.error || error.message}`;
        }
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}