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
  itemName: string;
  quantity: number;
  unit: string;
  notes: string;
  isShopped: number;
}

export interface DBShoppingList {
  id: number;
  listName: string;
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
    console.log('seed database');
    this.http.get('assets/seed.sql', { responseType: 'text' })
      .subscribe(sql => {
        console.log('seed database: sql=' + sql);
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.loadShoppingLists();
            this.loadItems();
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
    console.log('seed database done');
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getShoppingLists(): Observable<ShoppingListModel[]> {
    return this.shoppingLists.asObservable();
  }

  getItems(): Observable<Item[]> {
    return this.items.asObservable();
  }

  // load shopping items
  // select items.id, items.shoppingListId, items.itemName, items.quantity, items.isShopped, items.notes
  // FROM items JOIN shoppingLists ON items.shoppingListId = shoppingLists.id
  loadItems() {
    console.log('load items');
    return this.database.executeSql('SELECT items.id, ' +
      'items.shoppingListId, ' +
      'items.itemName, items.quantity, items.isShopped, items.unit, items.notes ' +
      'FROM items JOIN shoppingLists ON items.shoppingListId = shoppingLists.id', [])
      .then(data => {
        const dbItems: Item[] = [];

        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            dbItems.push({
              id: data.rows.item(i).id,
              shoppingListId: data.rows.item(i).shoppingListId,
              name: data.rows.item(i).itemName,
              quantity: data.rows.item(i).quantity,
              isShopped: data.rows.item(i).isShopped === 1 ? true : false,
              unit: data.rows.item(i).unit,
              notes: data.rows.item(i).notes
            });
          }
        }
        this.items.next(dbItems);
      });
  }

  addItem(newItem: Item, shoppingListId: number) {
    console.log('add item ' + newItem + 'shoppingListId ' + shoppingListId);
    const dbItem = [shoppingListId, newItem.name, newItem.quantity, newItem.unit, newItem.isShopped === true ? 1 : 0, newItem.notes];
    console.log('dbItem== ' + dbItem);
    return this.database
      .executeSql('INSERT INTO items ' +
        '(shoppingListId, itemName, quantity, unit, isShopped, notes) ' +
        'VALUES (?, ?, ?, ?, ?, ?)', dbItem)
      .then(i => {
        console.log('i= ' + i);
        this.loadItems();
      });
  }


  deleteItem(itemId: number, shoppingListId: number) {
    return this.database.executeSql('DELETE FROM items WHERE ID = ? AND shoppingListId = ?', [itemId, shoppingListId])
      .then(_ => {
        this.loadItems();
        // this.loadShoppingLists(); ??
      });
  }

  updateItem(item: Item, shoppingListId: number) {
    const dbItem = [item.name, item.quantity, item.unit, item.isShopped === true ? 1 : 0, item.notes, shoppingListId];
    return this.database.executeSql('UPDATE items ' +
      'SET itemName = ?, quantity = ?, unit = ?, isShopped = ?, notes = ? ' +
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
            console.log('data.rows.item(i).id === ' + data.rows.item(i).id);
            console.log('data.rows.item(i).listName === ' + data.rows.item(i).listName);

            shl.push({
              id: data.rows.item(i).id,
              name: data.rows.item(i).listName
            });
          }
        }
        this.shoppingLists.next(shl);
      });
  }


  /// ATTACK HERE
  // data.id and data.listname are returned as undefined
  // addItem gets a shopping list id 'undefined'

  // create new shopping list
  addShoppingList(shoppingListName: string, items: Item[]) {
    // insert shopping list, then add items
    const sl = [shoppingListName];
    let slId = 0;
    console.log('addShoppingList >>> ' + sl);
    return this.database.executeSql(
      'INSERT INTO shoppingLists (listName) VALUES (?)', sl)
      .then(() => {
        this.loadShoppingLists();

        // dbItems.push({
        //   id: data.rows.item(i).id,
        //   shoppingListId: data.rows.item(i).shoppingListId,
        // this.database.executeSql('SELECT  id from shoppingLists where listName=${shoppingListName}')
      })
      .catch(e => console.log('error inserting shopping list ' + e));

    // items.forEach(i => {
    //   this.addItem(i, slId);
    // });

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
    return this.database.executeSql('UPDATE shoppingLists SET listName = ${shoppingListName} WHERE id = ${shoppingListId}').then(_ => {
      items.forEach(item => {
        this.updateItem(item, shoppingListId);
      });
    });
    // TODO catch stuff here!
  }
}
