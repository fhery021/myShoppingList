import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { Item } from './model/item';
import { ShoppingListModel } from './model/shoppingListModel';


@Injectable({
  providedIn: 'root'
})
export class ShoppingListService implements OnInit {

  listsChanged = new EventEmitter<ShoppingListModel[]>();

  // listChanged = new EventEmitter<ShoppingListModel>();

  private items1 = [
    new Item('potato', 1, 'kg', true),
    new Item('tomato', 2, 'piece', false),
    new Item('chicken', 2.5, 'kg', true)
  ];

  private items2 = [
    new Item('cucumber', 1, 'piece', true),
    new Item('beer', 3, 'bottle', false),
    new Item('milk', 2, 'litre', true)
  ];

  private shoppingLists: ShoppingListModel[];

  private list1: ShoppingListModel;
  private list2: ShoppingListModel;

  ngOnInit(): void {



  }

  constructor() {
    this.shoppingLists = [];

    this.list1 = new ShoppingListModel('By these from Penny\'s Market');
    this.list1.items = [];
    this.items1.forEach(item => {
      this.list1.items.push(item);
    });

    this.list2 = new ShoppingListModel('Dedeman list');
    this.list2.items = [];
    this.items2.forEach(item => {
      this.list2.items.push(item);
    });

    this.shoppingLists.push(this.list1);
    this.shoppingLists.push(this.list2);

    console.log(this.shoppingLists);
  }

  public getShoppingLists() {
    return this.shoppingLists.slice();
  }

  public deleteShoppingList(list: ShoppingListModel) {
    this.shoppingLists.splice(this.shoppingLists.indexOf(list), 1);
    this.listsChanged.emit(this.shoppingLists.slice());
  }

}
