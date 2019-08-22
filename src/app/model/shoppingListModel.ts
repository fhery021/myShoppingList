import { Item } from './item';

export class ShoppingListModel {
    public name: string;

    public items: Item[];

    constructor(name: string) {
        this.name = name;
     }
    // public addItem()

    // public addItem(newItem: Item) {
    //     this.items.push(newItem);
    // }

    // public removeItem(item: Item){
    //     const index: number = this.items.indexOf(item);
    //     if (index !== -1){
    //         this.items.splice(index, 1);
    //     }
    // }

}
