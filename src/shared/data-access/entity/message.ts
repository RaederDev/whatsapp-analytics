import {Entity} from "./abstract.entity";

export class Message extends Entity {

  private remoteJid: string;
  private fromMe: number;
  private id: string;
  private status: number;
  private data: any;
  private timestamp: number;

  constructor() {
    super('Message', {
      remoteJid: 'key_remote_jid',
      fromMe: 'key_from_me',
      id: 'key_id',
      status: 'status',
      data: 'data',
      timestamp: 'timestamp'
    });
  }

}
