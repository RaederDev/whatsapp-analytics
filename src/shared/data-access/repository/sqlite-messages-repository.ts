import {Injectable} from "@angular/core";
import {isString, identity, conforms} from "lodash/fp";
import {ConnectionHandlerService} from "./connection-handler.service";
import {AbstractRepository} from "./abstract-repository";
import MessagesRepositoryInterface from "./messages-repository.interface";
import {Message} from "../entity/message";

@Injectable()
export class SqliteMessagesRepository extends AbstractRepository implements MessagesRepositoryInterface {

  private STATEMENT_FETCH_MESSAGES_COUNT = `SELECT COUNT(*) AS messages_count FROM messages`;

  constructor(private connectionHandler: ConnectionHandlerService) {
    super();
  }

  async fetchAllMessages(): Promise<Array<Message>> {
    return [];
  };

  async fetchMessagesCount(): Promise<number> {
    await this.connectionHandler.connect();
    const res = await this.connectionHandler.msgStoreDb
      .executeSql(this.STATEMENT_FETCH_MESSAGES_COUNT, {});
    const rows = this.collectionToArray(res.rows);
    if(rows.length > 0) {
      return rows[0]['messages_count'];
    }
    throw new Error('Failed to execute query');
  };

}
