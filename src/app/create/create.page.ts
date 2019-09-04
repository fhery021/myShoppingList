import { Component, OnInit } from '@angular/core';
import { ShoppingListModel } from '../model/shoppingListModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Item } from '../model/item';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  createForm: FormGroup;

  shoppingListName: string;
  shoppingList: ShoppingListModel;

  items: Item[] = new Array<Item>();

  newItem: {
    product: string;
    quantity: number;
    unit: string;
    notes: string
  };

  constructor(private formBuilder: FormBuilder,
              private shoppingListService: ShoppingListService) {
    this.createForm = this.formBuilder.group({
      product: ['', Validators.required],
      quantity: [''],
      unit: [''],
      notes: ['']
    });
    this.shoppingListName = shoppingListService.generateShoppingListName();
  }

  ngOnInit() {
  }

  onSaveShoppingList() {
    console.log('save shopping list pressed');

    if (this.shoppingListName === '') {
      this.shoppingListService.presentAlert('Empty Name', 'Shopping list name is mandatory');
    } else {
      this.shoppingList = new ShoppingListModel(this.shoppingListName, this.items);
      this.shoppingListService.createNewShoppingList(this.shoppingList);
    }
  }

  onSubmitAddItem() {
    console.log('add item pressed');
    this.newItem = this.createForm.value;
    if (this.newItem.product === '') {
      this.shoppingListService.presentAlert('Empty Product', 'Product name is mandatory!');
    } else {
      this.items.push(new Item(this.newItem.product, this.newItem.quantity, this.newItem.unit, this.newItem.notes, false));
    }
  }

  onDeleteItem(item) {
    this.items.forEach((element, index) => {
      if (element === item) { this.items.splice(index, 1); }
    });
  }

}
