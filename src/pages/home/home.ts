import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {FileUtils} from "../../shared/file-utils.service";
import {CordovaPluginSpinner} from "../../native/cordova-plugin-spinner.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {

  constructor(
    public navCtrl: NavController,
    private fileUtils: FileUtils,
    private cordovaPluginSpinner: CordovaPluginSpinner
  ) {
  }

  copyDatabase() {
    this.cordovaPluginSpinner.activityStart();
    this.fileUtils.copyDatabaseToTemp().then(res => {
      console.log('result: ', res);
      this.cordovaPluginSpinner.activityStop();
    }, this.cordovaPluginSpinner.activityStop);
  }

}
