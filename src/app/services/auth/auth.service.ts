import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router
  ) {
    this.fireAuth.authState.subscribe(user => {
      localStorage.setItem('user', JSON.stringify(user));
    })
  }

  async signinUser({ email, password }) {
    try {
      const res = await this.fireAuth.signInWithEmailAndPassword(email, password);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async signOut() {
    try {
      const res = await this.fireAuth.signOut();
      localStorage.removeItem('user');
      return res;
    } catch (err) {
      throw err;
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

}
