import { Injectable } from '@angular/core';
import { ShoppingListModel } from './model/shoppingListModel';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';

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

  getItems() {
    return this.items.asObservable();
  }

  loadShoppingLists() {
    return this.database.executeSql('SELECT * FROM shoppingLists', [])
      .then(data => {
        const dbShoppingLists: DBShoppingList[] = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            dbShoppingLists.push({
              id: data.rows.item(i).id,
              name: data.rows.item(i).name
            });
          }
        }
        this.shoppingLists.next(dbShoppingLists);
      });
  }
// TODO https://devdactic.com/ionic-4-sqlite-queries/ line 24 at the second part of database service
  loadItems() {

  }

  // CREATE
  addNewShoppingList(sl: ShoppingListModel): Promise<any> {
    return this.storage.get(KEY).then((lists: ShoppingListModel[]) => {
      if (lists) {
        lists.push(sl);
        return this.storage.set(KEY, lists);
      } else {
        return this.storage.set(KEY, [lists]);
      }
    });
  }

  // READ
  // getShoppingLists(): Promise<ShoppingListModel[]> {
  //   return this.storage.get(KEY);
  // }

  // UPDATE
  public updateShoppingList(sl: ShoppingListModel): Promise<any> {
    return this.storage.get(KEY).then((lists: ShoppingListModel[]) => {
      if (!lists || lists.length === 0) {
        return null;
      }

      let newShoppingList: ShoppingListModel[] = [];

      for (let i of lists) {
        if (i.id === sl.id) {
          newShoppingList.push(sl);
        } else {
          newShoppingList.push(i);
        }
      }

      return this.storage.set(KEY, newShoppingList);
    });
  }

  // DELETE
  deleteShoppingList(sl: ShoppingListModel): Promise<any> {
    return this.storage.get(KEY).then((lists: ShoppingListModel[]) => {
      if (!lists || lists.length === 0) {
        return null;
      }

      let toKeep: ShoppingListModel[] = [];

      for (let i of lists) {
        if (i.id !== sl.id) {
          toKeep.push(i);
        }
      }
      return this.storage.set(KEY, toKeep);
    });
  }

}
