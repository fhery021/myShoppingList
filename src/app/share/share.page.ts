import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingListModel } from '../model/shoppingListModel';
import { ShoppingListService } from '../shopping-list.service';
import { SharingService } from '../sharing.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {
  obsLists: Observable<ShoppingListModel[]>;
  lists: ShoppingListModel[];

  constructor(
    private shoppingListService: ShoppingListService,
    private sharingService: SharingService) { }

  ngOnInit() {
    console.log('list page on init');
    this.obsLists = this.shoppingListService.loadShoppingLists();
    this.obsLists.subscribe(l => {
      this.lists = l;
    });
  }

  public onShare(shoppingListId: number) {
    this.sharingService.shareShoppingList(shoppingListId);
  }


}
