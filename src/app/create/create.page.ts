import { Component, OnInit } from '@angular/core';
import { ShoppingListModel } from '../model/shoppingListModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Item } from '../model/item';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  createForm: FormGroup;

  // shoppingList: ShoppingListModel;

  items: Item[] = new Array<Item>();

  newItem: {
    product: string;
    quantity: number;
    unit: string;
    notes: string
  };

  constructor(private formBuilder: FormBuilder, private alertController: AlertController) {
    this.createForm = this.formBuilder.group({
      product: ['', Validators.required],
      quantity: [''],
      unit: [''],
      notes: ['']
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Empty Product',
      message: 'Product name is mandatory!',
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() {
  }

  onSaveShoppingList() {
    console.log('save shopping list ');
  }

  onSubmitAddItem() {
    console.log('add item pressed');
    this.newItem = this.createForm.value;
    if (this.newItem.product !== '') {
      this.items.push(new Item(this.newItem.product, this.newItem.quantity, this.newItem.unit, this.newItem.notes, false));
    } else {
      this.presentAlert();
    }

    // console.log(this.items);

  }

  onDeleteItem(item) {
    this.items.forEach((element, index) => {
      if (element === item) { this.items.splice(index, 1); }
    });
  }

}
