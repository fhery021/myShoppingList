import { ShoppingListModel } from './model/shoppingListModel';
import { Item } from './model/item';

export class MyData {
    private shoppingLists: ShoppingListModel[];

    private items1 = [
        new Item('potato', 1, 'kg', true),
        new Item('tomato', 2, 'piece', false),
        new Item('chicken', 2.5, 'kg', true)
    ];

    private items2 = [
        new Item('cucumber', 1, 'piece', true),
        new Item('beer', 3, 'bottle', false),
        new Item('milk', 2, 'litre', true)
    ];

    private list1: ShoppingListModel;
    private list2: ShoppingListModel;

    constructor() {


        this.list1 = new ShoppingListModel('By these from Penny\'s Market');
        this.list1.items = [];
        this.items1.forEach(item => {
            this.list1.items.push(item);
        });

        this.list2 = new ShoppingListModel('Dedeman list');
        this.list2.items = [];
        this.items2.forEach(item => {
            this.list2.items.push(item);
        });

        this.shoppingLists.push(this.list1);
        this.shoppingLists.push(this.list2);
    }

    public getShoppingLists() {
        return this.shoppingLists.slice();
    }
}
