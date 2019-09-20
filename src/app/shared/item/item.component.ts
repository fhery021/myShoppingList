import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Item } from 'src/app/model/item';
import { ItemService } from './item.service';
import { ItemEvent } from 'src/app/model/ItemEvent';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @Input() item: Item;
  @Input() pageName: string;
  @Input() shoppingListId: string;

  editMode = false;

  constructor(private itemService: ItemService) {
  }

  ngOnInit() {
  }

  onClickEditItem() {
    this.editMode = true;
  }

  onClickSaveItem() {
    this.itemService.itemChanged.emit(new ItemEvent(this.pageName, this.shoppingListId, this.item));
    this.editMode = false;
  }

  onClickDeleteItem() {
    this.itemService.itemDeleted.emit(new ItemEvent(this.pageName, this.shoppingListId, this.item));
  }

}
