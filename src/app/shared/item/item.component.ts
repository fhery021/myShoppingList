import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Item } from 'src/app/model/item';
import { ItemService } from './item.service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @Input() item: Item;

  editMode = false;

  constructor(private itemService: ItemService) {
  }


  ngOnInit() {
  }

  onClickEditItem() {
    this.editMode = true;
  }

  onClickSaveItem() {
    this.itemService.itemChanged.emit(this.item);
    this.editMode = false;
  }

  onClickDeleteItem() {
    this.itemService.itemDeleted.emit(this.item);
  }

}
