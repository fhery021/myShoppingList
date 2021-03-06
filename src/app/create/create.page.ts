import { Component, OnInit } from '@angular/core';
import { ShoppingListModel } from '../model/shoppingListModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Item } from '../model/item';
import { ShoppingListService } from '../shopping-list.service';
import { Router } from '@angular/router';
import { ItemService } from '../shared/item/item.service';
import { ItemEvent } from '../model/ItemEvent';

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

  PAGE_NAME = 'create';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private shoppingListService: ShoppingListService,
    private itemService: ItemService) {

    this.createForm = this.formBuilder.group({
      product: ['', Validators.required],
      quantity: [''],
      unit: [''],
      notes: ['']
    });
    this.shoppingListName = shoppingListService.generateShoppingListName();
  }

  ngOnInit() {
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

  onSaveShoppingList() {
    // if (this.shoppingListService.createNewShoppingList(new ShoppingListModel(this.shoppingListName, this.items))) {
    if (this.shoppingListService.createNewShoppingList(this.shoppingListName, this.items)) {
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
      this.createForm.reset();
    }
  }

  private deleteItem(itemEvent: ItemEvent) {
    if (itemEvent.pageName === this.PAGE_NAME) {
      const item = itemEvent.item;
      this.items.forEach((element, index) => {
        if (element === item) { this.items.splice(index, 1); }
      });
    }
  }

  private changeItem(itemEvent: ItemEvent) {
    if (itemEvent.pageName === this.PAGE_NAME) {
      const item = itemEvent.item;
      const index = this.items.findIndex(el => el.id === item.id);

      if (index !== -1) {
        this.itemService.updateItem(this.items[index], item);
      } else {
        console.log('item not found with index: ' + index);
      }
    }
  }

  private clear() {
    this.shoppingListName = this.shoppingListService.generateShoppingListName();
    this.createForm.reset();
    this.items = new Array<Item>();
  }


}
