import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {FileUtils} from "../../shared/file-utils.service";
import {CordovaPluginSpinner} from "../../native/cordova-plugin-spinner.service";
import {RepositoryFactory} from "../../shared/data-access/repository-factory.service";
import Repository from "../../shared/data-access/repository.interface";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {

  private repository: Repository;

  constructor(
    public navCtrl: NavController,
    private fileUtils: FileUtils,
    private cordovaPluginSpinner: CordovaPluginSpinner,
    private repositoryFactory: RepositoryFactory
  ) {
    this.repository = repositoryFactory.getRepository();
  }

  copyDatabase() {
    this.cordovaPluginSpinner.activityStart();
    this.fileUtils.copyDatabaseToTemp().then(res => {
      console.log('result: ', res);
      this.cordovaPluginSpinner.activityStop();
    }, (err) => {
      console.error(err);
      this.cordovaPluginSpinner.activityStop();
    });
  }

  load() {
    this.repository.fetchAllContacts().then((contacts) => {
      console.log(contacts);
    }, console.error.bind(console));
    this.repository.fetchAllGroups().then((contacts) => {
      console.log(contacts);
    }, console.error.bind(console));
  }

}
