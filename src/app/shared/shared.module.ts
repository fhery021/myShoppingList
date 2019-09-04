import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ItemComponent } from './item/item.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ItemComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [ItemComponent]

})
export class SharedModule { }
