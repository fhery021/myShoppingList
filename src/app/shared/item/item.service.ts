import { Injectable, EventEmitter } from '@angular/core';
import { Item } from 'src/app/model/item';
import { ItemEvent } from 'src/app/model/ItemEvent';
import { DatabaseService } from 'src/app/Database.service';
import { Platform, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  public itemChanged = new EventEmitter<ItemEvent>();
  public itemDeleted = new EventEmitter<ItemEvent>();

  private pageName: string;

  private items: Item[] = [];

  constructor(
    private plt: Platform,
    private toastController: ToastController,
    private db: DatabaseService) {
    this.plt.ready().then(() => {
      this.loadItems();
    });
  }

  public loadItems(): Observable<Item[]> {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getItems().subscribe(itms => this.items = itms);
      }
    });

    return this.db.getItems();
  }

  // READ
  public getItemsForShoppingList(id: number): Observable<Item[]> {
    return of(this.items.filter(i => i.shoppingListId === id));
  }

  // CREATE
  public addItem(shoppingListId: number, newItem: Item): Promise<void> {
    return this.db.addItem(newItem, shoppingListId).then(_ => this.showToast('Item added'));
  }

  // UPDATE
  public updateShoppingListItem(shoppingListId: number, item: Item): void {
    this.db.updateItem(item, shoppingListId).then(_ => this.showToast('Item updated'));
  }

  // DELETE
  public deleteShoppingListItem(shoppingListId: number, item: Item): void {
    this.db.deleteItem(item.id, shoppingListId).then(_ => this.showToast('Item deleted'));
  }

  public updateItem(oldItem: Item, newItem: Item) {
    oldItem.name = newItem.name;
    oldItem.quantity = newItem.quantity;
    oldItem.unit = newItem.unit;
    oldItem.notes = newItem.notes;
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
