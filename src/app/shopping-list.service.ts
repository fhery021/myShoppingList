import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ShoppingListModel } from './model/shoppingListModel';
import { MyData } from './my-data';
import { Observable, of } from 'rxjs';


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

  public getShoppingListByName(name: string): Observable<ShoppingListModel> {
    return of(this.shoppingLists.find(sl => sl.name === name));
  }

  public deleteShoppingList(list: ShoppingListModel) {
    this.shoppingLists.splice(this.shoppingLists.indexOf(list), 1);
    this.listsChanged.emit(this.shoppingLists.slice());
  }

  public generateShoppingListName() {
    const dateTime = new Date();
    return this.LIST_NAME + ' ' + dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString();
  }

  validateShoppingList(sl: ShoppingListModel) {
    if (sl.name === '' || sl.name === null) {
      this.presentAlert('Empty Name', 'Shopping list name is mandatory');
      return false;
    }

    if (sl.items === null || sl.items.length === 0) {
      this.presentAlert('Empty Items', 'Add at least one product to the shopping list');
      return false;
    }
    return true;
  }

  checkNotAlreadyCreated(sl: ShoppingListModel) {
    this.shoppingLists.forEach((element, index) => {
      if (element.equals(sl)) {
        this.presentAlert('Already Created', 'Shopping list already created.');
        return false;
      }
    });
    return true;
  }

  public createNewShoppingList(newList: ShoppingListModel) {
    if (this.validateShoppingList(newList) && this.checkNotAlreadyCreated(newList)) {
      this.shoppingLists.push(newList);
      return true;
    }
    return false;
  }

  public updateShoppingList(l: ShoppingListModel) {
    if (this.validateShoppingList(l)) {
      // this.shoppingLists.find(sh) by name
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
