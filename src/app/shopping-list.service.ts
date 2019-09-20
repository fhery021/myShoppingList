import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ShoppingListModel } from './model/shoppingListModel';
import { MyData } from './my-data';
import { Observable, of } from 'rxjs';
import { Item } from './model/item';
import { Md5 } from 'ts-md5/dist/md5';


@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {


  private LIST_NAME = 'New List';

  public listsChanged = new EventEmitter<ShoppingListModel[]>();

  private myData: MyData = new MyData();

  // listChanged = new EventEmitter<ShoppingListModel>();

  private shoppingLists: ShoppingListModel[];

  constructor(private alertController: AlertController, private md5: Md5) {
    console.log('Loading shopping list from my-data bootstrap class');
    this.shoppingLists = this.myData.getShoppingLists();
  }

  public getShoppingLists() {
    return this.shoppingLists.slice();
  }

  public getShoppingListById(id: string): Observable<ShoppingListModel> {
    return of(this.shoppingLists.find(sl => sl.id === id));
  }

  public deleteShoppingList(list: ShoppingListModel) {
    this.shoppingLists.splice(this.shoppingLists.indexOf(list), 1);
    this.listsChanged.emit(this.shoppingLists.slice());
  }

  public generateShoppingListName() {
    const dateTime = new Date();
    return this.LIST_NAME + ' ' + dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString();
  }

  validateShoppingList(name: string, items: Item[]) {
    if (name === '' || name === null) {
      this.presentAlert('Empty Name', 'Shopping list name is mandatory');
      return false;
    }

    if (items === null || items.length === 0) {
      this.presentAlert('Empty Items', 'Add at least one product to the shopping list');
      return false;
    }
    return true;
  }

  // checkNotAlreadyCreated(name: string) {
  //   this.shoppingLists.forEach((element, index) => {
  //     if (element.name === name) {
  //       this.presentAlert('Already Created', 'Shopping list with name \"' + name + '\" already created.');
  //       return false;
  //     }
  //   });
  //   return true;
  // }

  public createNewShoppingList(shoppingListName: string, items: Item[]) {
    if (this.validateShoppingList(shoppingListName, items)) {
      this.shoppingLists.push(this.newShoppingList(shoppingListName, items));
      this.listsChanged.emit(this.shoppingLists.slice());
      return true;
    }
    return false;
  }

  private newShoppingList(name: string, items: Item[]) {
    const sl: ShoppingListModel = new ShoppingListModel(Md5.hashStr(new Date().toString()).toString(), name, items);
    console.log(sl);
    return sl;
  }

  public updateShoppingListItem(shoppingListId: string, item: Item): void {
    const slIndex = this.findShoppingListIndex(shoppingListId);
    if (slIndex !== -1) {
      const itemIndex = this.shoppingLists[slIndex].items.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        this.shoppingLists[slIndex].items[itemIndex] = item;
      }
    }
  }

  public deleteShoppingListItem(shoppingListId: string, item: Item): void {
    const slIndex = this.findShoppingListIndex(shoppingListId);
    if (slIndex !== -1) {
      const itemIndex = this.shoppingLists[slIndex].items.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        this.shoppingLists[slIndex].items.splice(itemIndex, 1);
      }
    }
  }

  public addShoppingListItem(shoppingListId: string, newItem: Item): void {
    const slIndex = this.findShoppingListIndex(shoppingListId);
    if (slIndex !== -1) {
      this.shoppingLists[slIndex].items.push(newItem);
    }
  }

  private findShoppingListIndex(id: string): number {
    return this.shoppingLists.findIndex(sl => sl.id === id);
  }

  public async presentAlert(msgHeader: string, msgContent: string) {
    const alert = await this.alertController.create({
      header: msgHeader,
      message: msgContent,
      buttons: ['OK']
    });

    await alert.present();
  }

}
