//todo: it would be nice to find a way to integrate a proper ORM solution here
import {Contact} from "./entity/contact";

interface Repository {
  fetchAllContacts: () => Promise<Array<Contact>>;
}

export default Repository;
