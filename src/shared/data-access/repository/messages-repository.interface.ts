import {Message} from "../entity/message";

interface MessagesRepository {
  fetchAllMessages: () => Promise<Array<Message>>;
  fetchMessagesCount: () => Promise<number>;
  fetchOwnMessagesCount: () => Promise<number>;
  fetchOtherMessagesCount: () => Promise<number>;
  fetchMediaMessagesCount: () => Promise<number>;
}

export default MessagesRepository;
