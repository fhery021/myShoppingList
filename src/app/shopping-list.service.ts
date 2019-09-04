import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ShoppingListModel } from './model/shoppingListModel';
import { MyData } from './my-data';


@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {


  private LIST_NAME = 'New List';

  public listsChanged = new EventEmitter<ShoppingListModel[]>();

  private myData: MyData = new MyData();

  // listChanged = new EventEmitter<ShoppingListModel>();

  private shoppingLists: ShoppingListModel[];

  constructor(private alertController: AlertController) {
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

  public generateShoppingListName() {
    const dateTime = new Date();
    return this.LIST_NAME + ' ' + dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString();
  }

  public createNewShoppingList(newList: ShoppingListModel) {
    let alreadyCreated = false;
    this.shoppingLists.forEach((element, index) => {
      if (element.equals(newList)) {
        alreadyCreated = true;
      }
    });
    if (!alreadyCreated) {
      this.shoppingLists.push(newList);
    }

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
