import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ShoppingListModel } from './model/shoppingListModel';
import { Observable } from 'rxjs';
import { Item } from './model/item';
import { ItemService } from './shared/item/item.service';
import { File } from '@ionic-native/file/ngx';
import { ToastController } from '@ionic/angular';
import { TransferModel } from './shared/TransferModel';
import { ShoppingListService } from './shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  private obsItems: Observable<Item[]>;
  private items: Item[];
  private shoppingListModel: ShoppingListModel;

  constructor(
    private socialSharing: SocialSharing,
    private itemService: ItemService,
    private file: File,
    private toastController: ToastController,
    private shoppingListService: ShoppingListService) { }

  public shareShoppingList(listId: number) {
    this.obsItems = this.itemService.loadItems();
    this.obsItems.subscribe(itms => {
      this.items = itms.filter(i => i.shoppingListId === listId);
    });

    this.shoppingListService.getShoppingListById(listId).subscribe(slm => this.shoppingListModel = slm);

    if (this.items === null || this.shoppingListModel === null) {
      // utils/presentAlert
    }

    const transferModel = new TransferModel(this.shoppingListModel, this.items);

    const content = JSON.stringify(transferModel);

    const fileName = 'ShoppingList' + listId;
    this.file.createFile(this.file.cacheDirectory, fileName, true)
      .then(fileEntry => {
        this.showToast('File created');
        this.file.writeExistingFile(this.file.cacheDirectory, fileName, content)
          .then(() => {
            this.showToast('Sharing File');
            this.socialSharing.canShareViaEmail().then(() => {
              this.socialSharing.shareViaEmail('Download the attached shopping list and import it in the Share menu',
                'Shopping list:' + this.shoppingListModel.name,
                null, null, null, fileEntry.nativeURL);
            }).catch(reason => {
              this.showToast('Cannot share via e-mail');
              console.log('Cannot share via e-mail');
              console.log('Cannot share via e-mail reason: ' + reason);
            });

          });
      });

    // this.socialSharing.share('message', 'subject ' + list.name, null)
    //   .then(() => this.showToast('Share Done'));
  }

  public async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }
}
