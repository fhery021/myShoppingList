export class Item {

    public id: number;

    constructor(
        public name: string,
        public quantity: number,
        public unit: string,
        public notes: string,
        public isShopped: boolean
    ) { }
}
