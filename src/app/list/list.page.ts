import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingListModel } from '../model/shoppingListModel';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { SharingService } from '../sharing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  obsLists: Observable<ShoppingListModel[]>;
  lists: ShoppingListModel[];

  constructor(
    private shoppingListService: ShoppingListService,
    private location: Location,
    private alertCtrl: AlertController,
    private sharingService: SharingService,
    private router: Router) {
  }

  ngOnInit() {
    console.log('list page on init');
    this.obsLists = this.shoppingListService.loadShoppingLists();
    this.obsLists.subscribe(l => {
      this.lists = l;
    });
  }

  public onDeleteShoppingList(shl: ShoppingListModel) {
    this.presentConfirmAndDelete(shl);
  }

  public onSend(shoppingListId: number) {
    this.sharingService.shareShoppingList(shoppingListId)
      .catch(err => {
        this.presentAlert('Share unsuccessful', 'An error has occured during sharing this shopping list');
        console.log(err);
      });
  }

  public onImport() {
    this.sharingService.importShoppingList();
  }

  public onNewList() {
    this.router.navigate(['/create']);
  }

  async presentConfirmAndDelete(sl: ShoppingListModel) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm delete',
      message: 'Are you sure you want to delete this shopping list? All items from this list will be lost.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Delete clicked');
            this.shoppingListService.deleteShoppingList(sl);
          }
        }
      ]
    });
    await alert.present();
  }

  goBack(): void {
    this.location.back();
  }

  public async presentAlert(msgHeader: string, msgContent: string) {
    const alert = await this.alertCtrl.create({
      header: msgHeader,
      message: msgContent,
      buttons: ['OK']
    });

    await alert.present();
  }
}
