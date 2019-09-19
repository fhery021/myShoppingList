import { Item } from './item';

export class ItemEvent {
    constructor(public pageName: string, public shoppingListId: string, public item: Item) { }
}
