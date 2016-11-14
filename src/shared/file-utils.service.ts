import {Injectable} from "@angular/core";
import {File, DirectoryEntry} from "ionic-native";
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

        if (!res) {
          reject('Root access not granted');
          return;
        }

        this.createDatabaseDirectory().then(() => {

          const targetDir: string = this.getDatabaseDirectory();
          const promises = this.whatsAppDatabases.map(db => {
            //cp is not available on all devices so we have to cat the file instead
            return this.cordovaPluginRoot.run(`cat ${this.whatsAppDatabaseFolder}${db} > ${targetDir}${db}`);
          });

          Promise.all(promises)
            .then(this.doAllDatabasesExist.bind(this))
            .then(resolve)
            .catch(reject);

        }).catch(reject);
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
      const targetDir: string = `file://${this.getDatabaseDirectory()}`;
      const promises = this.whatsAppDatabases.map(File.checkFile.bind(File, targetDir));
      Promise.all(promises).then(
        //check if we have any falsey values in the result array, if we do not all databases have been copied
        (res: Array<boolean>) => resolve(compact(res).length === this.whatsAppDatabases.length)
      ).catch(reject);
    });
  }

  /**
   * We create all database files as empty stubs with phonegap.
   * This way if we cat into them later as root we don't need to fix the permissions,
   * since only the file content changes and not the permissions.
   *
   * @param directoryEntry
   */
  private touchDatabaseFiles(directoryEntry: DirectoryEntry) {
    return Promise.all(this.whatsAppDatabases.map(db => {
      return new Promise((resolve, reject) => {
        directoryEntry.getFile(db, {create: true, exclusive: false}, resolve, reject);
      });
    }));
  }

  /**
   * Creates the database directory where we'll store all of the WA databases.
   * Also invokes the touchDatabaseFiles method to create empty files
   */
  private createDatabaseDirectory() {
    return new Promise((resolve, reject) => {

      File.resolveDirectoryUrl(this.getBaseFileUrl())
        .then((entry: DirectoryEntry) => {
          return File.getDirectory(entry, 'databases', {create: true});
        })
        .then((databaseDir: DirectoryEntry) => {
          return this.touchDatabaseFiles(databaseDir)
        })
        .then(resolve)
        .catch(reject);

    });
  }

  private getDatabaseDirectory(): string {
    const base = cordova.file.applicationStorageDirectory.replace(/^file:\/\//, '');
    return `${base}databases/`;
  }

  private getBaseFileUrl(): string {
    return cordova.file.applicationStorageDirectory;
  }

}
