import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ShoppingListModel } from './model/shoppingListModel';

const KEY = 'my-shopping-lists';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(public storage: Storage) { }

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
  getShoppingLists(): Promise<ShoppingListModel[]> {
    return this.storage.get(KEY);
  }

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
