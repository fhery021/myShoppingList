import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingListModel } from '../model/shoppingListModel';
import { ItemService } from '../shared/item/item.service';
import { ItemEvent } from '../model/ItemEvent';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Item } from '../model/item';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss']
})
export class DetailPage implements OnInit {

  pageName = 'detail';
  shoppingList: ShoppingListModel;

  items: Item[];

  createForm: FormGroup;

  showAddItemForm = false;

  shoppingListId = 0;

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
    this.shoppingListId = +this.route.snapshot.paramMap.get('id');

    this.shoppingListService.getShoppingListById(this.shoppingListId)
      .subscribe(sl => this.shoppingList = sl);

    this.itemService.getItemsForShoppingList(this.shoppingListId)
      .subscribe(its => this.items = its);

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
    this.shoppingListService.listsChanged
      .subscribe(
        () => {
          this.shoppingListService.getShoppingListById(this.shoppingListId)
            .subscribe(sl => this.shoppingList = sl);
        });
  }

  goBack(): void {
    this.location.back();
  }

  private changeItem(itemEvent: ItemEvent) {
    if (itemEvent.pageName === this.pageName) {
      // this.shoppingListService.updateShoppingListItem(itemEvent.shoppingListId, itemEvent.item);
      this.itemService.updateShoppingListItem(itemEvent.shoppingListId, itemEvent.item);
    }
  }

  private deleteItem(itemEvent: ItemEvent) {
    if (itemEvent.pageName === this.pageName) {
      this.itemService.deleteShoppingListItem(itemEvent.shoppingListId, itemEvent.item);
    }
  }

  onSubmitAddItem() {
    console.log('add item pressed');
    this.newItem = this.createForm.value;
    if (this.newItem.product === null || this.newItem.product === '') {
      this.shoppingListService.presentAlert('Empty Product', 'Product name is mandatory!');
    } else {
      this.itemService.addItem(this.shoppingListId,
        new Item(this.newItem.product,
          this.newItem.quantity,
          this.newItem.unit,
          this.newItem.notes,
          false));
      this.toggleAddForm();
    }
  }

  toggleAddForm(): void {
    this.createForm.reset();
    this.showAddItemForm = !this.showAddItemForm;
  }

}
