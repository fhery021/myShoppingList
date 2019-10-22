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
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

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
    private shoppingListService: ShoppingListService,
    private fileChooser: FileChooser,
    private filePath: FilePath) { }

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

    const fileName = 'ShoppingList' + listId + '.json';
    // return ?
    return this.file.createFile(this.file.cacheDirectory, fileName, true)
      .then(fileEntry => {
        this.file.writeExistingFile(this.file.cacheDirectory, fileName, content)
          .then(() => {
            this.showToast('File exported successfully');
            const message = 'Download the attached shopping list and import it in the Share menu';
            const subject = 'Shopping list:' + this.shoppingListModel.name;

            // this.socialSharing.canShareViaEmail().then(() => {
            //   this.socialSharing.shareViaEmail('Download the attached shopping list and import it in the Share menu',
            //     'Shopping list:' + this.shoppingListModel.name,
            //     null, null, null, fileEntry.nativeURL);
            this.socialSharing.share(message, subject, fileEntry.nativeURL);
            }).catch(reason => {
              this.showToast('Cannot share ');
              console.log('Cannot share ');
              console.log('Cannot share. reason: ' + reason);
            });

          // });
      });

    // this.socialSharing.share('message', 'subject ' + list.name, null)
    //   .then(() => this.showToast('Share Done'));
  }

  public importShoppingList() {
    this.fileChooser.open()
      .then(uri => {
        console.log('File open successful from ' + uri);
        this.filePath.resolveNativePath(uri)
          .then(nativePath => {
            console.log('Native file path = ' + nativePath);
            const path = nativePath.substring(0, nativePath.lastIndexOf('/'));
            const fileName = nativePath.substring(nativePath.lastIndexOf('/') + 1, nativePath.length);

            this.file.readAsBinaryString(path, fileName)
              .then(content => {
                console.log('content = ' + JSON.stringify(content));
                const transferModel = JSON.parse(content) as TransferModel;
                console.log('TODO / IMPORTED: ' + transferModel.shoppingListModel.name);
                transferModel.items.forEach(itm => {
                  console.log('>>> ' + itm.name);
                  console.log('>>> ' + itm.quantity);
                  console.log('>>> ' + itm.unit);
                  console.log('>>> ' + itm.notes);
                  console.log('>>> ' + itm.isShopped);
                  console.log('>>> ' + itm.id);
                  console.log('>>> ' + itm.shoppingListId);
                });

                this.shoppingListService.createNewShoppingList(transferModel.shoppingListModel.name, transferModel.items);

              })
              .catch(err => console.log('Cannot read from file ' + err));
          })
          .catch(err => console.log('Cannot get native path ' + err));

      })
      .catch(err => console.log('Cannot open file' + err));
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
