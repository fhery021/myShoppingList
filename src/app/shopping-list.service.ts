import { Injectable, EventEmitter } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { ShoppingListModel } from './model/shoppingListModel';
import { Item } from './model/item';
import { DatabaseService } from './Database.service';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {


  private LIST_NAME = 'New List';

  public listsChanged = new EventEmitter<ShoppingListModel[]>();

  private shoppingLists: ShoppingListModel[];

  constructor(
    private alertController: AlertController,
    private plt: Platform,
    private toastController: ToastController,
    private db: DatabaseService) {

    this.plt.ready().then(() => {
      this.loadShoppingLists();
    });
  }

  private loadShoppingLists() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getShoppingLists().subscribe(sl => this.shoppingLists = sl);
      }
    });
  }

  // READ
  public getShoppingLists(): ShoppingListModel[] {
    return this.shoppingLists;
  }

  public getShoppingListById(id: number): Observable<ShoppingListModel> {
    return of(this.shoppingLists.find(sl => sl.id === id));
  }

  // CREATE
  public createNewShoppingList(shoppingListName: string, items: Item[]) {
    if (this.validateShoppingList(shoppingListName, items)) {
      this.db.addShoppingList(shoppingListName, items);
      this.listsChanged.emit(this.shoppingLists.slice());
      return true;
    }
    return false;
  }

  // UPDATE
  public updateShoppingList(sl: ShoppingListModel, items: Item[]) {
    this.db.updateShoppingList(sl.id, sl.name, items).then(_ => {
      this.listsChanged.emit(this.shoppingLists.slice());
    });
  }

  // DELETE
  public deleteShoppingList(list: ShoppingListModel) {
    this.db.deleteShoppingList(list.id).then(_ => {
      // this.loadShoppingLists();
      this.listsChanged.emit(this.shoppingLists.slice());
    });
  }


  // UTILS -- future improvement to move in some helper class (?)
  public generateShoppingListName() {
    const dateTime = new Date();
    return this.LIST_NAME + ' ' + dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString();
  }

  private validateShoppingList(name: string, items: Item[]) {
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

  public async presentAlert(msgHeader: string, msgContent: string) {
    const alert = await this.alertController.create({
      header: msgHeader,
      message: msgContent,
      buttons: ['OK']
    });

    await alert.present();
  }

  public async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }

}
