import {Contact} from "../entity/contact";
import {Injectable} from "@angular/core";
import {isString, identity, conforms} from "lodash/fp";
import {Entity} from "../entity/abstract.entity";
import {ConnectionHandlerService} from "./connection-handler.service";
import {AbstractRepository} from "./abstract-repository";
import ContactsRepository from "./contacts-repository.interface";

@Injectable()
export class SQLiteContactsRepository extends AbstractRepository implements ContactsRepository {

  private isValidContact: (value: Entity, index: number) => boolean = conforms({
    number: isString,
    isWhatsAppUser: identity
  });

  private STATEMENT_FETCH_ALL_CONTACTS = `SELECT jid, is_whatsapp_user, status, status_timestamp, number, display_name
                                          FROM wa_contacts`;

  constructor(private connectionHandler: ConnectionHandlerService) {
    super();
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
    await this.connectionHandler.connect();
    const sqlResult = await this.connectionHandler.waDb.executeSql(this.STATEMENT_FETCH_ALL_CONTACTS, []);
    return <Array<Contact>> this.collectionToArray(sqlResult.rows)
      .map(contact => (new Contact()).copyColumnsToProperties(contact))
      .filter(this.isValidContact); //remove invalid contacts
  }

}
