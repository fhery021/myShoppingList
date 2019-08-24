import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  shoppingListName: string = 'Name of your shopping list';

  constructor() { }

  ngOnInit() {
  }

}
