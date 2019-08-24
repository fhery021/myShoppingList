import { Component, OnInit } from '@angular/core';
import { ShoppingListModel } from '../model/shoppingListModel';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  shoppingList: ShoppingListModel;

  constructor() { }

  ngOnInit() {
  }

}
