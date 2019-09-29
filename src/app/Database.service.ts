import { Injectable } from '@angular/core';
import { ShoppingListModel } from './model/shoppingListModel';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
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

  getShoppingLists(): Observable<ShoppingListModel[]>{
    return this.shoppingLists.asObservable();
  }

  getItems(): Observable<Item[]>{
    return this.items.asObservable();
  }

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

  // TODO converter for dbItem-Item ? (?)
  addItem(newItem: Item, shoppingListId: number) {
    const dbItem = [newItem.name, newItem.quantity, newItem.unit, newItem.isShopped === true ? 1 : 0, newItem.notes, shoppingListId];
    return this.database
      .executeSql('INSERT INTO items ' +
        'name, quantity, unit, isShopped, notes, shoppingListId ' +
        'VALUES (?, ?, ?, ?, ?, ?)', dbItem)
      .then(data => {
        this.loadItems();
      });
  }

  // getItemsByShoppingListId(shoppingListId: number) {
  //   return this.database.executeSql('SELECT item.itemId, ' +
  //     'item.name, item.quantity, item.unit, item.isShopped, item.notes ' +
  //     'AS shlist' +
  //     'FROM items JOIN shoppingLists ON items.shoppingListId = shoppingLists.id ' +
  //     'WHERE item.shoppshoppingListId = ?', [shoppingListId])
  //     .then(data => {
  //       const dbItems: Item[] = [];

  //       if (data.rows.length > 0) {
  //         for (let i = 0; i < data.rows.length; i++) {
  //           dbItems.push({
  //             id: data.rows.item(i).itemId,
  //             name: data.rows.item(i).name,
  //             quantity: data.rows.item(i).quantity,
  //             unit: data.rows.item(i).unit,
  //             notes: data.rows.item(i).notes,
  //             isShopped: data.rows.item(i).isShopped === 1 ? true : false
  //           });
  //         }
  //       }
  //     });
  // }

  deleteItem(itemId: number, shoppingListId: number) {
    return this.database.executeSql('DELETE FROM items WHERE itemId = ? AND shoppingListId = ?', [itemId, shoppingListId])
      .then(_ => {
        this.loadItems();
        // this.loadShoppingLists(); ??
      });
  }

  updateItem(item: Item, shoppingListId: number) {
    const dbItem = [item.name, item.quantity, item.unit, item.isShopped === true ? 1 : 0, item.notes, shoppingListId];
    return this.database.executeSql('UPDATE items ' +
      'SET name = ?, quantity = ?, unit = ?, isShopped = ?, notes = ? ' +
      'WHERE itemId = $[item.id] AND shoppingListId = $[shoppingListId]')
      .then(data => {
        this.loadItems();
        // this.loadShoppingLists ??
      });
  }

  // shoppingLists
  // id INTEGER  PRIMARY KEY AUTOINCREMENT,
  // name TEXT

  loadShoppingLists() {
    return this.database.executeSql('SELECT * FROM shoppingLists', [])
      .then(data => {
        const shl: ShoppingListModel[] = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            shl.push({
              id: data.rows.item(i).id,
              name: data.rows.item(i).name
            });
          }
        }
        this.shoppingLists.next(shl);
      });
  }

  // create new shopping list
  addShoppingList(shoppingListName: string, items: Item[]) {
    // insert shopping list, then add items
    const sl = [shoppingListName];
    let slId = 0;
    this.database.executeSql('INSERT INTO shoppingLists name VALUES (?)', sl)
      .then(data => {
        slId = data.id;
        // this.loadItems();
        items.forEach(i => {
          this.addItem(i, slId);
        });
      });
  }

  // getShoppingList(shoppingListId: number) {
  //   return this.database.executeSql('SELECT * from shoppingLists WHERE id = ?', [shoppingListId])
  //     .then()
  // }

  deleteShoppingList(shoppingListId: number) {
    this.database.executeSql('DELETE FROM shoppingLists WHERE id = ?', [shoppingListId])
      .then(_ => { this.loadShoppingLists(); });
    return this.database.executeSql('DELETE FROM items WHERE shoppingListId = ?', [shoppingListId])
      .then(_ => { this.loadItems(); });
  }

  updateShoppingList(shoppingListId: number, shoppingListName: string, items: Item[]) {
    this.database.executeSql('UPDATE shoppingLists SET name = ${shoppingListName} WHERE id = ${shoppingListId}');
    items.forEach(item => {
      this.updateItem(item, shoppingListId);
    });
    // TODO catch stuff here!
  }
}
