//todo: it would be nice to find a way to integrate a proper ORM solution here
import {SQLite} from 'ionic-native';
import Repository from "./repository.interface";
import {Contact} from "./entity/contact";

export class SQLitePluginRepository implements Repository {

  private msgStoreDb: SQLite;
  private waDb: SQLite;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private connectionRequests: Array<Array<Function>> = [];

  fetchAllContacts(): Promise<Array<Contact>> {
    return new Promise((resolve, reject) => {
      const fetch = () => {
        resolve([]);
      };
      this.connect().then(fetch).catch(reject);
    });
  }

  /**
   * Ensures that both databases are opened and ready for use
   *
   * @return {Promise}
   */
  private connect(): Promise<void> {

    //check if we are already connected
    if(this.isConnected) {
      return Promise.resolve();
    }

    //attempt to open databases
    return new Promise((resolve, reject) => {
      if(this.isConnecting) {
        //if we get multiple requests to connect while the plugin is working in the background
        //we have to queue the requests in order to avoid opening multiple DB handles
        this.connectionRequests.push([resolve, reject]);
      } else {

        //create the plugin instances
        this.msgStoreDb = new SQLite();
        this.waDb = new SQLite();

        //try to open both databases
        Promise.all([
          this.msgStoreDb.openDatabase({
            name: 'msgstore.db',
            location: 'default'
          }),
          this.waDb.openDatabase({
            name: 'wa.db',
            location: 'default'
          })
        ]).then(() => {
          //success
          this.isConnecting = false;
          this.isConnected = true;

          //execute all resolve functions
          this.connectionRequests.forEach(fns => fns[0]());
        }).catch(err => {
          debugger;
          console.error(err);
          //execute all reject functions
          this.connectionRequests.forEach(fns => fns[1]())
        });

      }
    });
  }

}
