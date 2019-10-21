import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingListModel } from '../model/shoppingListModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  obsLists: Observable<ShoppingListModel[]>;
  lists: ShoppingListModel[];

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
    console.log('list page on init');
    this.obsLists = this.shoppingListService.loadShoppingLists();
    this.obsLists.subscribe(l => {
      this.lists = l;
    });
  }

  public onDeleteShoppingList(shl: ShoppingListModel) {
    this.shoppingListService.deleteShoppingList(shl);
  }

}
