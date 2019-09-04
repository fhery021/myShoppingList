import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Item } from 'src/app/model/item';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item: Item;

  editMode = false;

  public itemChanged = new EventEmitter<Item>();
  public itemDeleted = new EventEmitter<Item>();

  constructor() {

  }

  ngOnInit() {
  }

  onClickEditItem() {
    this.editMode = true;
  }

  onClickSaveItem() {
    // shoppintlistservice.itemchanged()
    this.itemChanged.emit(this.item);
    this.editMode = false;
  }

  onClickDeleteItem() {
    this.itemDeleted.emit(this.item);
  }

}
