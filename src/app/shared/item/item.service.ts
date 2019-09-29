import { Injectable, EventEmitter } from '@angular/core';
import { Item } from 'src/app/model/item';
import { ItemEvent } from 'src/app/model/ItemEvent';
import { DatabaseService } from 'src/app/Database.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  public itemChanged = new EventEmitter<ItemEvent>();
  public itemDeleted = new EventEmitter<ItemEvent>();

  private pageName: string;

  constructor(
    private plt: Platform,
    private db: DatabaseService) {
    this.plt.ready().then(() => {
      this.loadItems();
    });
  }

  private loadItems() {
    
  }

  public newItem(product: string, quantity: number, unit: string, notes: string, isShopped: boolean) {
    const item: Item = new Item(product, quantity, unit, notes, isShopped);
    console.log(item);
    return item;
  }

  public updateItem(oldItem: Item, newItem: Item) {
    oldItem.name = newItem.name;
    oldItem.quantity = newItem.quantity;
    oldItem.unit = newItem.unit;
    oldItem.notes = newItem.notes;
  }
}
