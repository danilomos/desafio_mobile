import { Injectable } from '@angular/core';
// import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  readonly dbName = "users.db";
  readonly tableName = "users_position";
  // private storage: SQLiteObject;

  constructor(
    private platform: Platform,
    // private sqlite: SQLite
  ) {
    this.init();
  }

  async init() {
    try {
      // await this.platform.ready();
      // this.storage = await this.sqlite.create({ name: this.dbName, location: 'default' });
      // if (!this.storage) return;
      // await this.storage.executeSql(`
      //   CREATE TABLE IF NOT EXISTS ${this.tableName} (
      //     id INTEGER PRIMARY KEY, 
      //     user_id varchar(255),
      //     latitude REAL,
      //     longitude REAL
      //   )`, []);
    } catch (err) {
      console.log(err);
    }
  }

  async addUserPosition(user) {
    // if (!this.storage) return;
    // const data = [user.uid, user.latitude, user.longitude];
    // return await this.storage.executeSql(`INSERT INTO ${this.tableName} (user_id, latitude, longitude) VALUES (?, ?, ?)`, data)
  }
}
