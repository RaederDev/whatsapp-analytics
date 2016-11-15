//todo: it would be nice to find a way to integrate a proper ORM solution here
//todo: repository is probably not a very good name since it doesn't fit the traditional ORM pattern
import {SQLite} from 'ionic-native';
import Repository from "./repository.interface";
import {Contact} from "./entity/contact";
import {Config} from "ionic-angular";
import {Injectable} from "@angular/core";
import {isString, identity, conforms} from "lodash/fp";
import {Entity} from "./entity/abstract.entity";

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
    private config: Config
  ) {
    this.whatsAppMessageStoreDatabase = this.config.get('whatsAppMessageStoreDatabase');
    this.whatsAppUserDatabase = this.config.get('whatsAppUserDatabase');
  }

  fetchAllContacts(): Promise<Array<Contact>> {
    return new Promise((resolve, reject) => {
      this.fetchGroupsAndContacts()
        .then((contacts: Array<Contact>) => {
          resolve(contacts.filter(contact => !contact.isGroup()));
        })
        .catch(reject);
    });
  }

  fetchAllGroups(): Promise<Array<Contact>> {
    return new Promise((resolve, reject) => {
      this.fetchGroupsAndContacts()
        .then((contacts: Array<Contact>) => {
          resolve(contacts.filter(contact => contact.isGroup()));
        })
        .catch(reject);
    });
  }

  private fetchGroupsAndContacts(): Promise<Array<Contact>> {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(() => this.waDb.executeSql(this.STATEMENT_FETCH_ALL_CONTACTS, []))
        .then(res => {
          const result: Array<Contact> = <Array<Contact>> this.collectionToArray(res.rows)
            .map(contact => (new Contact()).copyColumnsToProperties(contact))
            .filter(this.isValidContact); //remove invalid contacts
          resolve(result);
        })
        .catch(reject);
    });
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
  private connect(): Promise<void> {

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

        //create the plugin instances
        this.isConnecting = true;
        this.msgStoreDb = new SQLite();
        this.waDb = new SQLite();

        //try to open both databases
        Promise.all([
          this.msgStoreDb.openDatabase({
            name: this.whatsAppMessageStoreDatabase,
            location: 'default'
          }),
          this.waDb.openDatabase({
            name: this.whatsAppUserDatabase,
            location: 'default'
          })
        ]).then(() => {
          //success
          this.isConnecting = false;
          this.isConnected = true;

          //execute all resolve functions
          this.connectionRequests.forEach(fns => fns[0]());
        }).catch(err => {
          console.error(err);
          //execute all reject functions
          this.connectionRequests.forEach(fns => fns[1]())
        });

      }

    });
  }

}
