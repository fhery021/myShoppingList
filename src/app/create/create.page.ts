import { Component, OnInit } from '@angular/core';
import { ShoppingListModel } from '../model/shoppingListModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Item } from '../model/item';
import { ShoppingListService } from '../shopping-list.service';
import { Router } from '@angular/router';

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
              private router: Router,
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
      return;
    }

    if (this.items.length === 0) {
      this.shoppingListService.presentAlert('Empty Items', 'Add at least one product to the shopping list');
      return;
    }

    this.shoppingList = new ShoppingListModel(this.shoppingListName, this.items);
    const alreadyCreated = this.shoppingListService.createNewShoppingList(this.shoppingList);
    if (alreadyCreated) {
      this.shoppingListService.presentAlert('Already Created', 'Shopping list already created.');
    } else {
      this.clear();
      this.router.navigate(['/list']);
    }
  }

  onSubmitAddItem() {
    console.log('add item pressed');
    this.newItem = this.createForm.value;
    if (this.newItem.product === null || this.newItem.product === '') {
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

  private clear() {
    this.shoppingListName = this.shoppingListService.generateShoppingListName();
    this.createForm.reset();
    this.items = new Array<Item>();
  }

}
