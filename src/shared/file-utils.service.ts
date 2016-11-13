import {Injectable} from "@angular/core";
import {File} from "ionic-native";
import {CordovaPluginRoot} from "../native/cordova-plugin-root.service";
import {Config} from "ionic-angular";
import {compact} from "lodash/fp";

@Injectable()
export class FileUtils {

  private whatsAppDatabaseFolder: string;
  private whatsAppDatabases: Array<string>;

  constructor(
    private cordovaPluginRoot: CordovaPluginRoot,
    private config: Config
  ) {
    this.whatsAppDatabaseFolder = this.config.get('whatsAppDatabaseFolder');
    this.whatsAppDatabases = this.config.get('whatsAppDatabases');
  };

  /**
   * Copies the private WhatsApp database to the temp folder so the App can safely operate on it.
   *
   * @return {Promise<void>}
   */
  public copyDatabaseToTemp(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cordovaPluginRoot.isAvailable().then(res => {

        const targetDir: string = this.getCacheDirectory();
        const promises = this.whatsAppDatabases.map(db => {
          return this.cordovaPluginRoot.run(`cp ${this.whatsAppDatabaseFolder}${db} ${targetDir}`);
        });

        Promise.all(promises)
          .then(this.doAllDatabasesExist.bind(this))
          .then(resolve)
          .catch(reject);

      }).catch(reject);
    });
  }

  /**
   * Checks if all required databases have been copied to our temp folder
   *
   * @return {Promise<boolean>}
   */
  private doAllDatabasesExist(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const targetDir: string = `file://${this.getCacheDirectory()}`;
      const promises = this.whatsAppDatabases.map(File.checkFile.bind(File, targetDir));
      Promise.all(promises).then(
        //check if we have any falsey values in the result array, if we do not all databases have been copied
        (res: Array<boolean>) => resolve(compact(res).length === this.whatsAppDatabases.length)
      ).catch(reject);
    });
  }

  private getCacheDirectory(): string {
    return cordova.file.cacheDirectory.replace(/^file:\/\//, '');
  }

}
