import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ShoppingListModel } from './model/shoppingListModel';
import { Observable } from 'rxjs';
import { Item } from './model/item';
import { ItemService } from './shared/item/item.service';
import { File } from '@ionic-native/file/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  private obsItems: Observable<Item[]>;
  private items: Item[];

  constructor(
    private socialSharing: SocialSharing,
    private itemService: ItemService,
    private file: File,
    private toastController: ToastController) { }

  public shareShoppingList(list: ShoppingListModel) {
    this.obsItems = this.itemService.loadItems();
    this.obsItems.subscribe(itms => {
      this.items = itms.filter(i => i.shoppingListId === list.id);
    });

    const content = 'TODO JSON content';
    // this.itemService.getItemsForShoppingList(list.id);

    this.file.createFile(this.file.dataDirectory, list.name, true)
      .then(fileEntry => {
        this.showToast('Creating ile');
        this.file.writeExistingFile(this.file.dataDirectory, list.name, content)
          .then(() => {
            this.showToast('Sharing File');
            this.socialSharing.share(list.name, 'Sharing shopping list: ' + list.name, null, null);
          });
      });
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
