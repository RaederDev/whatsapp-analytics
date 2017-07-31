import {Injectable} from "@angular/core";
import {isString, identity, conforms} from "lodash/fp";
import {ConnectionHandlerService} from "./connection-handler.service";
import {AbstractRepository} from "./abstract.repository";
import MessagesRepositoryInterface from "./messages-repository.interface";
import {Message} from "../entity/message";

@Injectable()
export class SqliteMessagesRepository extends AbstractRepository implements MessagesRepositoryInterface {

  private STATEMENT_FETCH_MESSAGES_COUNT = `SELECT COUNT(*) AS messages_count FROM messages WHERE key_id != -1`;
  private STATEMENT_FETCH_OWN_MESSAGES_COUNT = `SELECT COUNT(*) AS messages_count FROM messages 
                                                WHERE key_from_me = 1 AND key_id != -1`;
  private STATEMENT_FETCH_OTHER_MESSAGES_COUNT = `SELECT COUNT(*) AS messages_count FROM messages 
                                                  WHERE key_from_me = 0 AND key_id != -1`;
  private STATEMENT_FETCH_MEDIA_MESSAGES_COUNT = `SELECT COUNT(*) AS messages_count FROM messages 
                                                  WHERE media_mime_type IS NOT NULL AND key_id != -1`;

  constructor(private connectionHandler: ConnectionHandlerService) {
    super();
  }

  async fetchAllMessages(): Promise<Array<Message>> {
    return [];
  };

  fetchOwnMessagesCount(): Promise<number> {
    return this.executeMessageNumberQuery(this.STATEMENT_FETCH_OWN_MESSAGES_COUNT);
  };

  fetchOtherMessagesCount(): Promise<number> {
    return this.executeMessageNumberQuery(this.STATEMENT_FETCH_OTHER_MESSAGES_COUNT);
  };

  fetchMediaMessagesCount(): Promise<number> {
    return this.executeMessageNumberQuery(this.STATEMENT_FETCH_MEDIA_MESSAGES_COUNT);
  };

  fetchMessagesCount(): Promise<number> {
    return this.executeMessageNumberQuery(this.STATEMENT_FETCH_MESSAGES_COUNT);
  };

  async executeMessageNumberQuery(query): Promise<number> {
    await this.connectionHandler.connect();
    const res = await this.connectionHandler.msgStoreDb
      .executeSql(query, {});
    const rows = this.collectionToArray(res.rows);
    if(rows.length > 0) {
      return rows[0]['messages_count'];
    }
    throw new Error('Failed to execute query');
  };

}
