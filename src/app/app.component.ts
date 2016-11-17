import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Home } from '../pages/home/home';
import { Contacts } from '../pages/contacts/contacts';
import {StateManagement} from "../shared/state-management.service";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Home;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    private stateManagement: StateManagement
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: Home },
      { title: 'Contacts', component: Contacts }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.stateManagement.initApp()
        .then(() => console.log('Initialized app'))
        .catch(err => console.error('Failed to initialize app', err));
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
