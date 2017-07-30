import {Contact} from "../entity/contact";

interface ContactsRepository {
  fetchAllContacts: () => Promise<Array<Contact>>;
  fetchAllGroups: () => Promise<Array<Contact>>;
  fetchAllContactsCount: () => Promise<number>;
  fetchAllGroupsCount: () => Promise<number>;
}

export default ContactsRepository;
