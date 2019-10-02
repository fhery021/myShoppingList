import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy, AfterViewInit {

  backButtonSubscription: Subscription;

  constructor(
    private platform: Platform, 
    private toastController: ToastController) { }

  ngAfterViewInit() {
    let lastTimeBackPress = 0;
    const timePeriodExit = 2000;

    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(1, () => {
      if (new Date().getTime() - lastTimeBackPress < timePeriodExit) {
        navigator['app'].exitApp();
      } else {
        this.showToast('Press again to exit App');
        lastTimeBackPress = new Date().getTime();
      }

    });
  }

  ngOnDestroy(): void {
    this.backButtonSubscription.unsubscribe();
  }

  public async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }
}
