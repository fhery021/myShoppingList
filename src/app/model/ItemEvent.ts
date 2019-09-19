import { Item } from './item';

export class ItemEvent {
    constructor(public pageName: string, public shoppingListId, public item: Item) { }
}
