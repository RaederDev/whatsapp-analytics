import {Injectable} from "@angular/core";
import Repository from "./contacts-repository.interface";
import {SQLiteContactsRepository} from "./sqlite-contacts-repository";

@Injectable()
export class RepositoryFactory {

  private contactsRepository: Repository;

  constructor(
    private sqLiteContactsRepository: SQLiteContactsRepository
  ) {
    //if we migrate to a better plugin / an actual ORM, this should be the only place in the app
    //where a change should be necessary
    this.contactsRepository = this.sqLiteContactsRepository;
  }

  /**
   * Returns the default repository implementation
   */
  getContactsRepository() {
    return this.contactsRepository;
  }

}
