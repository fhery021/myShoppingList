export class Item {

    constructor(
        public id: string,
        public name: string,
        public quantity: number,
        public unit: string,
        public notes: string,
        public isShopped: boolean
    ) { }
}
