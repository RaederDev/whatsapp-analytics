import {Injectable} from "@angular/core";
import Repository from "./repository.interface";
import {SQLitePluginRepository} from "./sqlite-plugin-repository";

@Injectable()
export class RepositoryFactory {

  private repository: Repository = null;

  /**
   * Returns the default repository implementation
   */
  getRepository() {
    if(this.repository === null) {
      //if we migrate to a better plugin, this should be the only place in the app
      //where a change should be necessary
      this.repository = new SQLitePluginRepository();
    }
    return this.repository;
  }

}
