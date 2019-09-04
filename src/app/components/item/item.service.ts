import { Injectable, EventEmitter } from '@angular/core';
import { Item } from 'src/app/model/item';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  public itemChanged = new EventEmitter<Item>();
  public itemDeleted = new EventEmitter<Item>();

  constructor(private md5: Md5) { }

  public newItem(product: string, quantity: number, unit: string, notes: string, isShopped: boolean) {
    const item: Item = new Item(Md5.hashStr(new Date().toString()).toString(), product, quantity, unit, notes, isShopped);
    console.log(item);
    return item;
  }
}
