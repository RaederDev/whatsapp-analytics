import {NgModule} from "@angular/core";
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import {IonicModule, IonicApp} from "ionic-angular";
import {MyApp} from "./app.component";
import {Home} from "../pages/home/home";
import {Contacts} from "../pages/contacts/contacts";
import {PromiseUtils} from "../shared/promise-utils.service";
import {FileUtils} from "../shared/file-utils.service";
import {CordovaPluginRoot} from "../native/cordova-plugin-root.service";
import {CordovaPluginSpinner} from "../native/cordova-plugin-spinner.service";
import {CONFIG} from "./app.config";
import {RepositoryFactory} from "../shared/data-access/repository-factory.service";
import {SQLitePluginRepository} from "../shared/data-access/sqlite-plugin-repository";
import {ContactList} from "../shared/components/contact-list/contact-list.component";
import {StorageHelper} from "../shared/storage-helper.service";
import {StateManagement} from "../shared/state-management.service";
import {NumberInfoCard} from "../shared/components/cards/number-info-card/number-info-card.component";
import {IonicStorageModule} from "@ionic/storage";

@NgModule({
  declarations: [
    MyApp,
    Home,
    Contacts,
    ContactList,
    NumberInfoCard
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, CONFIG),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    Contacts
  ],
  providers: [
    PromiseUtils,
    FileUtils,
    CordovaPluginRoot,
    CordovaPluginSpinner,
    RepositoryFactory,
    SQLitePluginRepository,
    StorageHelper,
    StateManagement
  ]
})
export class AppModule {
}
