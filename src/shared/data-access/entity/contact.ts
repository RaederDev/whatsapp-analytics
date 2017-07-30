import {Entity} from "./abstract.entity";
import {endsWith} from "lodash/fp";

//numbers ending with this string indicate a group
const GROUP_IDENTIFIER = '@s.whatsapp.net';

export class Contact extends Entity {

  public jid: string;
  public isWhatsAppUser: boolean;
  public status: string;
  public statusTimestamp: any;

  //WhatsApp has a bad structure here this can also contain an email like ID when dealing with a group
  //e.g. xxxxxxxxxx-xxxxxxxxxx@g.us
  public number: string;
  public displayName: string;

  constructor() {
    super('Contact', {
      jid: 'jid',
      isWhatsAppUser: 'is_whatsapp_user',
      status: 'status',
      statusTimestamp: 'status_timestamp',
      number: 'number',
      displayName: 'display_name'
    });
  }

  isGroup() {
    return endsWith(GROUP_IDENTIFIER, this.number);
  }

}
