import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingListModel } from '../model/shoppingListModel';
import { ShoppingListService } from '../shopping-list.service';
import { SharingService } from '../sharing.service';
import { AlertController } from '@ionic/angular';

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
    private sharingService: SharingService,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    console.log('list page on init');
    this.obsLists = this.shoppingListService.loadShoppingLists();
    this.obsLists.subscribe(l => {
      this.lists = l;
    });
  }

  public onShare(shoppingListId: number) {
    this.sharingService.shareShoppingList(shoppingListId)
    .catch(err => {
      this.presentAlert('Share unsuccessful', 'An error has occured during sharing this shopping list');
      console.log(err);
    });
  }

  public onImport() {
    this.sharingService.importShoppingList();
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
