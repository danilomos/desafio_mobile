import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireAuth: AngularFireAuth,
    private storeService: StoreService
  ) {
    this.fireAuth.authState.subscribe(user => {
      if (user) this.storeService.updateUserData(user.toJSON());
    })
  }

  async signIn({ email, password }) {
    try {
      const { user } = await this.fireAuth.signInWithEmailAndPassword(email, password);
      return user.toJSON();
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

  async getUser() {
    try {
      const user = await this.fireAuth.currentUser;
      return user.toJSON();
    } catch (err) {
      throw err;
    }
  }

}
