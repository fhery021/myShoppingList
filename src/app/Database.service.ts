import { Injectable } from '@angular/core';
import { ShoppingListModel } from './model/shoppingListModel';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { Item } from './model/item';

const KEY = 'my-shopping-lists';

export interface DBItem {
  itemId: number;
  name: string;
  quantity: number;
  unit: string;
  notes: string;
  isShopped: number;
}

export interface DBShoppingList {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  shoppingLists = new BehaviorSubject([]);
  items = new BehaviorSubject([]);

  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'shoppingList.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        });
    });
  }

  private seedDatabase() {
    this.http.get('assets/seed.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.loadShoppingLists();
            this.loadItems();
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getShoppingLists() {
    return this.shoppingLists.asObservable();
  }


  // public id: string,
  // public name: string,
  // public quantity: number,
  // public unit: string,
  // public notes: string,
  // public isShopped: boolean

  // itemId INTEGER PRIMARY KEY AUTOINCREMENT,
  // name TEXT,
  // quantity INTEGER,
  // unit TEXT,
  // isShopped INTEGER,
  // notes TEXT,
  // shoppingListId INTEGER

  // load shopping items
  loadItems() {
    return this.database.executeSql('SELECT item.itemId, ' +
      'item.name, item.quantity, item.unit, item.isShopped, item.notes ' +
      'AS shlist' +
      'FROM items JOIN shoppingLists ON items.shoppingListId = shoppingLists.id', [])
      .then(data => {
        const dbItems: Item[] = [];

        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            dbItems.push({
              id: data.rows.item(i).itemId,
              name: data.rows.item(i).name,
              quantity: data.rows.item(i).quantity,
              unit: data.rows.item(i).unit,
              notes: data.rows.item(i).notes,
              isShopped: data.rows.item(i).isShopped === 1 ? true : false
            });
          }
        }
        this.items.next(dbItems);
      });
  }

}
