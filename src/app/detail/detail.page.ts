import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingListModel } from '../model/shoppingListModel';
import { ItemService } from '../shared/item/item.service';
import { ItemEvent } from '../model/ItemEvent';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss']
})
export class DetailPage implements OnInit {

  pageName = 'detail';
  shoppingList: ShoppingListModel;

  constructor(
    private route: ActivatedRoute,
    private shoppingListService: ShoppingListService,
    private location: Location,
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.getShoppingList();
    this.itemService.itemChanged
      .subscribe(
        (changedItem: ItemEvent) => {
          this.changeItem(changedItem);
        }
      );
    this.itemService.itemDeleted
      .subscribe(
        (deletedItem: ItemEvent) => {
          this.deleteItem(deletedItem);
        }
      );
  }

  private getShoppingList(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.shoppingListService.getShoppingListById(id)
      .subscribe(sl => this.shoppingList = sl);
  }

  goBack(): void {
    this.location.back();
  }

  private changeItem(itemEvent: ItemEvent) {
    if (itemEvent.pageName === this.pageName) {
      this.shoppingListService.updateShoppingListItem(itemEvent.shoppingListId, itemEvent.item);
    }
  }

  private deleteItem(itemEvent: ItemEvent) {
    if (itemEvent.pageName === this.pageName) {
      this.shoppingListService.deleteShoppingListItem(itemEvent.shoppingListId, itemEvent.item);
    }
  }
}
