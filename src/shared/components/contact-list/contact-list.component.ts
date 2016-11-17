import {Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange} from "@angular/core";
import {Contact} from "../../data-access/entity/contact";
import {RepositoryFactory} from "../../data-access/repository-factory.service";
import Repository from "../../data-access/repository.interface";
import isUndefined from "lodash/fp";

@Component({
  selector: 'contact-list',
  templateUrl: 'contact-list.html'
})
export class ContactList implements OnChanges, OnInit {

  @Input()
  public contacts: Array<Contact> = [];

  @Input()
  public autoInit: boolean;

  private repository: Repository;
  private error: boolean;

  constructor(
    private repositoryFactory: RepositoryFactory
  ) {
    this.repository = this.repositoryFactory.getRepository();
  }

  ngOnInit(): void {
    if(this.autoInit) {
      this.initWithDefaultList();
    }
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const contacts: SimpleChange = changes['contacts'];
    if(!isUndefined(contacts)) {
      this.contacts = contacts.currentValue;
    }
  }

  private initWithDefaultList(): void {
    this.repository.fetchAllContacts()
      .then(contacts => this.contacts = contacts)
      .catch(err => {
        console.error(err);
        this.error = true;
      });
  }

}
