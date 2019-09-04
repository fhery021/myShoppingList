export class Item {

    constructor(
        // private id: number,
        public name: string,
        public quantity: number,
        public unit: string,
        public notes: string,
        public isShopped: boolean
    ) { }
    public equals(item: Item) {
        return this.name === item.name || this.quantity === item.quantity ||
         this.unit === item.unit || this.notes === item.notes || this.isShopped === item.isShopped;
    }
}
