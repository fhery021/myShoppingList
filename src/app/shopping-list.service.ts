import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { ShoppingListModel } from './model/shoppingListModel';
import { Observable, of } from 'rxjs';
import { Item } from './model/item';
import { DatabaseService } from './Database.service';


@Injectable({
  providedIn: 'root'
})
export class ShoppingListService implements OnInit {


  private LIST_NAME = 'New List';

  public listsChanged = new EventEmitter<ShoppingListModel[]>();

  private shoppingLists: Observable<ShoppingListModel[]>;
  private items: Item[] = [];

  constructor(
    private alertController: AlertController,
    private plt: Platform,
    private toastController: ToastController,
    private db: DatabaseService) {

    this.plt.ready().then(() => {
      this.loadShoppingLists();
    });
  }

  ngOnInit(): void {

    // ITT !!!!! szetvalasztani ezt: sl. service es item service-be:

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getItems().subscribe(items => {
          this.items = items;
        });
        this.shoppingLists = this.db.getShoppingLists();
      }
    });
  }

  // READ
  private loadShoppingLists() {
    this.storageService.getShoppingLists().then(lists => {
      this.shoppingLists = lists;
    });
  }

  public getShoppingLists() {
    return this.shoppingLists.slice();
  }

  public getShoppingListById(id: string): Observable<ShoppingListModel> {
    return of(this.shoppingLists.find(sl => sl.id === id));
  }

  // CREATE
  public createNewShoppingList(shoppingListName: string, items: Item[]) {
    if (this.validateShoppingList(shoppingListName, items)) {
      this.storageService
        .addNewShoppingList(
          new ShoppingListModel(Md5.hashStr(new Date().toString()).toString(), shoppingListName, items));
      this.loadShoppingLists();
      this.listsChanged.emit(this.shoppingLists.slice());

      return true;
    }
    return false;
  }

  // UPDATE
  public updateShoppingList(sl: ShoppingListModel) {
    this.storageService.updateShoppingList(sl).then(() => {
      this.loadShoppingLists();
      this.listsChanged.emit(this.shoppingLists.slice());
    });
  }

  // DELETE
  public deleteShoppingList(list: ShoppingListModel) {
    this.storageService.deleteShoppingList(list).then(sl => {
      this.loadShoppingLists();
      this.listsChanged.emit(this.shoppingLists.slice());
    });
  }


  // ITEM RELATED
  public updateShoppingListItem(shoppingListId: string, item: Item): void {
    const slIndex = this.findShoppingListIndex(shoppingListId);
    if (slIndex !== -1) {
      // const itemIndex = this.shoppingLists[slIndex].items.findIndex(i => i.id === item.id);
      // if (itemIndex !== -1) {
      //   this.shoppingLists[slIndex].items[itemIndex] = item;
      // }
      this.storageService.updateShoppingList(this.shoppingLists[slIndex]);
      this.loadShoppingLists();
      this.showToast('Item updated');
    }
  }

  public deleteShoppingListItem(shoppingListId: string, item: Item): void {
    const slIndex = this.findShoppingListIndex(shoppingListId);
    if (slIndex !== -1) {
      // const itemIndex = this.shoppingLists[slIndex].items.findIndex(i => i.id === item.id);
      // if (itemIndex !== -1) {
      //   this.shoppingLists[slIndex].items.splice(itemIndex, 1);
      // }
      this.storageService.updateShoppingList(this.shoppingLists[slIndex]);
      this.loadShoppingLists();
      this.showToast('Item deleted');
    }
  }

  public addShoppingListItem(shoppingListId: string, newItem: Item): void {
    const slIndex = this.findShoppingListIndex(shoppingListId);
    if (slIndex !== -1) {
      // this.shoppingLists[slIndex].items.push(newItem);
      this.storageService.updateShoppingList(this.shoppingLists[slIndex]);
      this.loadShoppingLists();
      this.showToast('Item added');
    }
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

  public async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
  }
}
