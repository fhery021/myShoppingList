import { ShoppingListModel } from '../model/shoppingListModel';

import { Item } from '../model/item';

export class TransferModel {
    constructor(private shoppingListModel: ShoppingListModel, private items: Item[]) { }
}
