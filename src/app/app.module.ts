import {NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {Home} from "../pages/home/home";
import {Page2} from "../pages/page2/page2";
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

@NgModule({
  declarations: [
    MyApp,
    Home,
    Page2,
    ContactList
  ],
  imports: [
    IonicModule.forRoot(MyApp, CONFIG)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    Page2
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
