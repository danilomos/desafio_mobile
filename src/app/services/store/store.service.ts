import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  async updateUserData(user) {
    try {
      const userData = await this._getUser(user.uid);
      if (userData) {
        this._updateUser(user.uid, { lastLoginAt: user.lastLoginAt });
      } else {
        this._createUser(user);
      }
    } catch (err) {
      throw err;
    }
  }

  async _getUser(id) {
    try {
      const user = await this.firestore.collection('users').doc(id).get().toPromise();
      return user.data();
    } catch (err) {
      throw err;
    }
  }

  async _createUser(user) {
    try {
      const userToCreate = JSON.parse(JSON.stringify(user, (key, value) => (value === undefined ? "" : value)))
      return await this.firestore.collection('users').doc(user.uid).set(userToCreate);
    } catch (err) {
      throw err;
    }
  }

  async _updateUser(id, toUpdate) {
    try {
      return await this.firestore.collection('users').doc(id).update(toUpdate);
    } catch (err) {
      throw err;
    }
  }
}
