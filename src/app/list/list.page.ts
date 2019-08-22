import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingListModel } from '../model/shoppingListModel';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  lists: ShoppingListModel[];

  private selectedItem: any;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.lists = this.shoppingListService.getShoppingLists();

    this.shoppingListService.listsChanged
      .subscribe(
        (lists: ShoppingListModel[]) => {
          this.lists = lists;
        }
      );
  }

  public deleteShoppingList(shl: ShoppingListModel) {
    this.shoppingListService.deleteShoppingList(shl);
  }
}
