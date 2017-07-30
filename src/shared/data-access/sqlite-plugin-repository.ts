//todo: it would be nice to find a way to integrate a proper ORM solution here
//todo: repository is probably not a very good name since it doesn't fit the traditional ORM pattern
import {SQLite} from 'ionic-native';
import Repository from "./repository.interface";
import {Contact} from "./entity/contact";
import {Config, Events} from "ionic-angular";
import {Injectable} from "@angular/core";
import {isString, identity, conforms} from "lodash/fp";
import {Entity} from "./entity/abstract.entity";
import {FileUtils} from "../file-utils.service";

@Injectable()
export class SQLitePluginRepository implements Repository {

  private msgStoreDb: SQLite;
  private waDb: SQLite;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private connectionRequests: Array<Array<Function>> = [];
  private whatsAppMessageStoreDatabase: string;
  private whatsAppUserDatabase: string;
  private isValidContact: (value: Entity, index: number) => boolean = conforms({
    number: isString,
    isWhatsAppUser: identity
  });

  private STATEMENT_FETCH_ALL_CONTACTS = `SELECT jid, is_whatsapp_user, status, status_timestamp, number, display_name
                                          FROM wa_contacts`;

  constructor(
    private config: Config,
    private fileUtils: FileUtils,
    private events: Events
  ) {
    this.whatsAppMessageStoreDatabase = this.config.get('whatsAppMessageStoreDatabase');
    this.whatsAppUserDatabase = this.config.get('whatsAppUserDatabase');
  }

  async fetchAllContacts(): Promise<Array<Contact>> {
    return (await this.fetchGroupsAndContacts())
      .filter(contact => !contact.isGroup());
  }

  async fetchAllContactsCount(): Promise<number> {
    return (await this.fetchAllContacts()).length;
  }

  async fetchAllGroupsCount(): Promise<number> {
    return (await this.fetchAllGroups()).length;
  }

  async fetchAllGroups(): Promise<Array<Contact>> {
    return (await this.fetchGroupsAndContacts())
      .filter(contact => contact.isGroup());
  }

  private async fetchGroupsAndContacts(): Promise<Array<Contact>> {
    await this.connect();
    const sqlResult = await this.waDb.executeSql(this.STATEMENT_FETCH_ALL_CONTACTS, []);
    return <Array<Contact>> this.collectionToArray(sqlResult.rows)
      .map(contact => (new Contact()).copyColumnsToProperties(contact))
      .filter(this.isValidContact); //remove invalid contacts
  }

  /**
   * Takes an HTMLCollection like structure and converts it to an Array.
   * The SQLite plugin returns all results like this.
   *
   * @param res
   * @return {Array}
   */
  private collectionToArray(res: HTMLCollection) {
    const extracted = [];
    for(let i = 0; i < res.length; i++) {
      extracted.push(res.item(i));
    }
    return extracted;
  }

  /**
   * Ensures that both databases are opened and ready for use
   *
   * @return {Promise}
   */
  private connect(): Promise<any> {

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

  private addCopySubscriptionHandler() {
    const handler = () => {
      console.log('Opening databases');
      this.openDatabases();
      this.events.unsubscribe(FileUtils.EVENT_DATA_COPIED, handler);
    };
    this.events.subscribe(FileUtils.EVENT_DATA_COPIED, handler);
  }

  private async openDatabases() {
    this.msgStoreDb = new SQLite();
    this.waDb = new SQLite();

    try {
      //try to open both databases
      await Promise.all([
        this.msgStoreDb.openDatabase({
          name: this.whatsAppMessageStoreDatabase,
          location: 'default'
        }),
        this.waDb.openDatabase({
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
