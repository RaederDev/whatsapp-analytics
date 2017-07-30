import {Message} from "../entity/message";

interface MessagesRepository {
  fetchAllMessages: () => Promise<Array<Message>>;
  fetchMessagesCount: () => Promise<number>;
}

export default MessagesRepository;
