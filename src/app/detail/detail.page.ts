import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingListModel } from '../model/shoppingListModel';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss']
})
export class DetailPage implements OnInit {

  shoppingList: ShoppingListModel;

  constructor(
    private route: ActivatedRoute,
    private shoppingListService: ShoppingListService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getShoppingList();
  }

  private getShoppingList(): void {
    // todo make this getById see https://angular.io/tutorial/toh-pt5
    const id = this.route.snapshot.paramMap.get('id');
    this.shoppingListService.getShoppingListById(id)
      .subscribe(sl => this.shoppingList = sl);
  }

  goBack(): void {
    this.location.back();
  }
}
