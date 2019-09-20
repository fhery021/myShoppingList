import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingListModel } from '../model/shoppingListModel';
import { ItemService } from '../shared/item/item.service';
import { ItemEvent } from '../model/ItemEvent';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss']
})
export class DetailPage implements OnInit {

  pageName = 'detail';
  shoppingList: ShoppingListModel;

  createForm: FormGroup;

  showAddItemForm = false;

  newItem: {
    product: string;
    quantity: number;
    unit: string;
    notes: string
  };

  constructor(
    private route: ActivatedRoute,
    private shoppingListService: ShoppingListService,
    private location: Location,
    private itemService: ItemService,
    private formBuilder: FormBuilder,
  ) {
    this.createForm = this.formBuilder.group({
      product: ['', Validators.required],
      quantity: [''],
      unit: [''],
      notes: ['']
    });
  }

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

  onSubmitAddItem() {
    console.log('add item pressed');
    this.newItem = this.createForm.value;
    if (this.newItem.product === null || this.newItem.product === '') {
      this.shoppingListService.presentAlert('Empty Product', 'Product name is mandatory!');
    } else {
      this.shoppingListService.addShoppingListItem(
        this.shoppingList.id,
        this.itemService
          .newItem(this.newItem.product, this.newItem.quantity, this.newItem.unit, this.newItem.notes, false));

      this.toggleAddForm();
    }
  }

  toggleAddForm(): void {
    this.createForm.reset();
    this.showAddItemForm = !this.showAddItemForm;
  }

}
