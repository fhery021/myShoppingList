import { Item } from './item';

export class ItemEvent {
    constructor(public pageName: string, public shoppingListId: number, public item: Item) { }
}
