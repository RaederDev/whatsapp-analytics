import {Injectable} from "@angular/core";
import Repository from "./repository.interface";
import {SQLitePluginRepository} from "./sqlite-plugin-repository";

@Injectable()
export class RepositoryFactory {

  private repository: Repository;

  constructor(
    private sqlitePluginRepository: SQLitePluginRepository
  ) {
    //if we migrate to a better plugin / an actual ORM, this should be the only place in the app
    //where a change should be necessary
    this.repository = this.sqlitePluginRepository;
  }

  /**
   * Returns the default repository implementation
   */
  getRepository() {
    return this.repository;
  }

}
