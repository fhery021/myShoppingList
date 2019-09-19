import { Item } from './item';

export class ShoppingListModel {

    constructor(public id: string, public name: string, public items: Item[]) {
    }

    public equals(slm: ShoppingListModel) {
        if (this.name !== slm.name || this.items.length !== slm.items.length) {
            return false;
        } else {
            return this.eq(this.items, slm.items);
        }
    }

    // too ugly, change it when you are getting smarter
    private eq(items1: Item[], items2: Item[]) {
        for (const i1 of items1) {
            for (const i2 of items2) {
                if (!i1.equals(i2)) {
                    return false;
                }
            }
        }
        return true;
    }

}
