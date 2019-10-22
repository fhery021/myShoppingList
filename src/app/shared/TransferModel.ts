import { ShoppingListModel } from '../model/shoppingListModel';

import { Item } from '../model/item';

export class TransferModel {
    constructor(public shoppingListModel: ShoppingListModel, public items: Item[]) { }
}
