import {SQLite} from 'ionic-native';
import {Config, Events} from "ionic-angular";
import {Injectable} from "@angular/core";
import {isString, identity, conforms} from "lodash/fp";
import {FileUtils} from "../../file-utils.service";

@Injectable()
export class ConnectionHandlerService {

  private _msgStoreDb: SQLite;
  private _waDb: SQLite;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private connectionRequests: Array<Array<Function>> = [];
  private whatsAppMessageStoreDatabase: string;
  private whatsAppUserDatabase: string;

  constructor(
    private config: Config,
    private fileUtils: FileUtils,
    private events: Events
  ) {
    this.whatsAppMessageStoreDatabase = this.config.get('whatsAppMessageStoreDatabase');
    this.whatsAppUserDatabase = this.config.get('whatsAppUserDatabase');
  }

  get msgStoreDb(): SQLite {
    return this._msgStoreDb;
  }

  get waDb(): SQLite {
    return this._waDb;
  }

  /**
   * Ensures that both databases are opened and ready for use
   *
   * @return {Promise}
   */
  public connect(): Promise<any> {

    //check if we are already connected
    if(this.isConnected) {
      return Promise.resolve();
    }

    //attempt to open databases
    return new Promise((resolve, reject) => {

      //if we get multiple requests to connect while the plugin is working in the background
      //we have to queue the requests in order to avoid opening multiple DB handles
      this.connectionRequests.push([resolve, reject]);

      if(!this.isConnecting) {

        //lock
        this.isConnecting = true;

        if(this.fileUtils.getHasCopiedDatabases()) {
          this.openDatabases();
        } else {
          this.addCopySubscriptionHandler();
        }
      }

    });
  }

  public addCopySubscriptionHandler() {
    const handler = () => {
      console.log('Opening databases');
      this.openDatabases();
      this.events.unsubscribe(FileUtils.EVENT_DATA_COPIED, handler);
    };
    this.events.subscribe(FileUtils.EVENT_DATA_COPIED, handler);
  }

  public async openDatabases() {
    this._msgStoreDb = new SQLite();
    this._waDb = new SQLite();

    try {
      //try to open both databases
      await Promise.all([
        this._msgStoreDb.openDatabase({
          name: this.whatsAppMessageStoreDatabase,
          location: 'default'
        }),
        this._waDb.openDatabase({
          name: this.whatsAppUserDatabase,
          location: 'default'
        })
      ]);

      //success
      this.isConnecting = false;
      this.isConnected = true;

      //execute all resolve functions
      this.connectionRequests.forEach(fns => fns[0]());
    } catch(err) {
      console.error(err);
      //execute all reject functions
      this.connectionRequests.forEach(fns => fns[1]())
    }
  }

}
