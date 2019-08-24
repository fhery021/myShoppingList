import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { Item } from './model/item';
import { ShoppingListModel } from './model/shoppingListModel';
import { MyData } from './my-data';


@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  listsChanged = new EventEmitter<ShoppingListModel[]>();

  private myData: MyData = new MyData();

  // listChanged = new EventEmitter<ShoppingListModel>();

  private shoppingLists: ShoppingListModel[];

  constructor() {
    console.log('Loading shopping list from my-data bootstrap class');
    this.shoppingLists = this.myData.getShoppingLists();
  }

  public getShoppingLists() {
    return this.shoppingLists.slice();
  }

  public deleteShoppingList(list: ShoppingListModel) {
    this.shoppingLists.splice(this.shoppingLists.indexOf(list), 1);
    this.listsChanged.emit(this.shoppingLists.slice());
  }

}
