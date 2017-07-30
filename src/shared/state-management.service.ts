import {Injectable} from "@angular/core";
import {AlertController} from "ionic-angular";
import {compact} from "lodash/fp";
import {StorageHelper} from "./storage-helper.service";
import {FileUtils} from "./file-utils.service";
import {CordovaPluginSpinner} from "../native/cordova-plugin-spinner.service";

@Injectable()
export class StateManagement {

  private KEY_HAS_SHOWN_ROOT_POPUP = 'has.shown.root.popup';

  constructor(
    private storageHelper: StorageHelper,
    private alertController: AlertController,
    private fileUtils: FileUtils,
    private cordovaPluginSpinner: CordovaPluginSpinner
  ) {}

  /**
   * Initializes the application.
   * Shows the user relevant dialogues and copies databases to private storage.
   *
   * @return {Promise<T>}
   */
  public async initApp(): Promise<any> {
    try {
      const hasShownRootPopup = await this.hasShownRootPopup();
      if(!hasShownRootPopup) {
        await this.showRootPopup();
      }
      this.cordovaPluginSpinner.activityStart();
      await this.fileUtils.copyDatabaseToTemp();
      this.cordovaPluginSpinner.activityStop();
    } catch(e) {
      this.showCopyFailedPopup();
      this.cordovaPluginSpinner.activityStop();
      throw e;
    }
  }

  /**
   * Shows the user a popup informing him of required root access and copies the database if he continues.
   *
   * @return {Promise<T>}
   */
  private showRootPopup(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alertController.create({
        enableBackdropDismiss: false,
        title: 'WhatsApp Analytics requires root permissions',
        message: `In order to work this app requires root permissions.
                After you close this dialogue please grant root access otherwise the App will automatically exit.`,
        buttons: [
          {
            text: 'Exit',
            handler: navigator['app'].exitApp
          },
          {
            text: 'Continue',
            handler: () => {
              this.cordovaPluginSpinner.activityStart();
              this.fileUtils.copyDatabaseToTemp()
                .then(() => this.storageHelper.setBoolean(this.KEY_HAS_SHOWN_ROOT_POPUP, true))
                .then(resolve)
                .catch(reject);
            }
          }
        ]
      }).present();
    });
  }

  /**
   * Informs the user that we couldn't get the required data and closes the app.
   */
  private showCopyFailedPopup(): void {
    this.alertController.create({
      enableBackdropDismiss: false,
      title: 'Failed to obtain root privileges or copy data',
      message: `Please make sure you have granted the app root access and that you have WhatsApp installed.
                If you have done all this and think this is an error please submit a bug report on Github.`,
      buttons: [
        {
          text: 'Exit',
          handler: navigator['app'].exitApp
        }
      ]
    }).present();
  };

  private hasShownRootPopup(): Promise<boolean> {
    return this.storageHelper.getBoolean(this.KEY_HAS_SHOWN_ROOT_POPUP);
  }

}
