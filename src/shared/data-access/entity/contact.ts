import {Entity} from "./abstract.entity";
import {endsWith} from "lodash/fp";

//numbers ending with this string indicate a group
const GROUP_IDENTIFIER = '@s.whatsapp.net';

export class Contact extends Entity {

  private jid: string;
  private isWhatsAppUser: boolean;
  private status: string;
  private statusTimestamp: any; //moment-js function

  //WhatsApp has a bad structure here this can also contain an email like ID when dealing with a group
  //e.g. xxxxxxxxxx-xxxxxxxxxx@g.us
  private number: string;
  private displayName: string;

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
