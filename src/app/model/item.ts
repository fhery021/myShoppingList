export class Item {

    public id: number;
    public shoppingListId: number;

    constructor(
        public name: string,
        public quantity: number,
        public unit: string,
        public notes: string,
        public isShopped: boolean
    ) { }

    log(): void {
        console.log('item_id=' + this.id +
            ' shoppingListId=' + this.shoppingListId +
            ' item name=' + this.name + ' quantity=' + this.quantity +
            ' unit=' + this.unit + ' isShopped=' + this.isShopped);
    }

}
