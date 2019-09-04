import { ShoppingListModel } from './model/shoppingListModel';
import { Item } from './model/item';

export class MyData {
    private shoppingLists: Array<ShoppingListModel> = new Array<ShoppingListModel>();

    private items1 = [
        new Item('potato', 1, 'kg', 'Big, transparent sack', true),
        new Item('tomato', 2, 'piece', '', false),
        new Item('chicken', 2.5, 'kg', '', true)
    ];

    private items2 = [
        new Item('cucumber', 1, 'piece', '', true),
        new Item('beer', 3, 'bottle', '', false),
        new Item('milk', 2, 'litre', '', true)
    ];

    private list1: ShoppingListModel;
    private list2: ShoppingListModel;

    constructor() {
        this.list1 = new ShoppingListModel('By these from Penny\'s Market', this.items1);
        this.list2 = new ShoppingListModel('Dedeman list', this.items2);

        this.shoppingLists.push(this.list1);
        this.shoppingLists.push(this.list2);
    }

    public getShoppingLists() {
        return this.shoppingLists.slice();
    }
}
