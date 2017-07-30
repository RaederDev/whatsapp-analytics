import {Contact} from "../entity/contact";

interface MessagesRepositoryInterface {
  fetchAllContacts: () => Promise<Array<Contact>>;
  fetchAllGroups: () => Promise<Array<Contact>>;
  fetchAllContactsCount: () => Promise<number>;
  fetchAllGroupsCount: () => Promise<number>;
}

export default MessagesRepositoryInterface;
