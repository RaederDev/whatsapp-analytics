import {Entity} from "./abstract.entity";

export class Message extends Entity {

  public remoteJid: string;
  public fromMe: number;
  public id: string;
  public status: number;
  public data: any;
  public timestamp: number;
  public mediaMimeType: string;

  constructor() {
    super('Message', {
      remoteJid: 'key_remote_jid',
      fromMe: 'key_from_me',
      id: 'key_id',
      status: 'status',
      data: 'data',
      timestamp: 'timestamp',
      mediaMimeType: 'media_mime_type'
    });
  }

}
