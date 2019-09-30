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

  private items: Item[] = [];

  constructor(
    private plt: Platform,
    private db: DatabaseService) {
    this.plt.ready().then(() => {
      this.loadItems();
    });
  }

  private loadItems() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getItems().subscribe(items => {
          this.items = items;
        });
      }
    });

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
