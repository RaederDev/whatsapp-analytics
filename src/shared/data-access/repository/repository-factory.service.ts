import {Injectable} from "@angular/core";
import {SQLiteContactsRepository} from "./sqlite-contacts-repository";
import {SqliteMessagesRepository} from "./sqlite-messages-repository";
import ContactsRepository from "./contacts-repository.interface";
import MessagesRepository from "./messages-repository.interface";

@Injectable()
export class RepositoryFactory {

  private contactsRepository: ContactsRepository;
  private messagesRepository: MessagesRepository;

  constructor(
    private sqLiteContactsRepository: SQLiteContactsRepository,
    private sqLiteMessagesRepository: SqliteMessagesRepository
  ) {
    //if we migrate to a better plugin / an actual ORM, this should be the only place in the app
    //where a change should be necessary
    this.contactsRepository = this.sqLiteContactsRepository;
    this.messagesRepository = this.sqLiteMessagesRepository;
  }

  getContactsRepository(): ContactsRepository {
    return this.contactsRepository;
  }

  getMessagesRepository(): MessagesRepository {
    return this.messagesRepository;
  }

}
