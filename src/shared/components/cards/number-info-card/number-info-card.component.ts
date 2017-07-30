import {Component, OnChanges, SimpleChange, Input, OnInit} from "@angular/core";
import {NumberInfoCardVariant} from "./number-info-card-variant";
import {RepositoryFactory} from "../../../data-access/repository/repository-factory.service";
import {NavController} from "ionic-angular";
import {Contacts} from "../../../../pages/contacts/contacts";
import MessagesRepository from "../../../data-access/repository/messages-repository.interface";
import ContactsRepository from "../../../data-access/repository/contacts-repository.interface";

@Component({
  selector: 'number-info-card',
  templateUrl: 'number-info-card.html'
})
export class NumberInfoCard implements OnChanges, OnInit {

  @Input()
  public type: NumberInfoCardVariant;

  public valid: boolean = false;
  private text: string = 'Loading...';
  private title: string;
  private icon: string;
  private contactsRepository: ContactsRepository;
  private messagesRepository: MessagesRepository;
  private targetView: any;

  constructor(
    private repositoryFactory: RepositoryFactory,
    private navController: NavController
  ) {
    this.contactsRepository = this.repositoryFactory.getContactsRepository();
    this.messagesRepository = this.repositoryFactory.getMessagesRepository();
  }

  ngOnInit(): void {
    this.loadCardData();
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const type: SimpleChange = changes['type'];
    this.type = type.currentValue;
    this.loadCardData();
  }

  private loadCardData() {
    switch (this.type) {
      case NumberInfoCardVariant.Contacts:
        this.loadContactCard();
        break;
      case NumberInfoCardVariant.Groups:
        this.loadGroupsCard();
        break;
      case NumberInfoCardVariant.Messages:
        this.loadMessagesCard();
        break;
      default:
        this.valid = false;
        return;
    }
    this.valid = true;
  }

  private async loadMessagesCard() {
    const numberOfMessages = await this.messagesRepository.fetchMessagesCount();
    this.title = 'Messages';
    this.icon = 'mail';
    this.targetView = Contacts;
    this.text = numberOfMessages.toString();
  }

  private loadContactCard() {
    this.contactsRepository.fetchAllContactsCount()
      .then(numberOfContacts => this.text = numberOfContacts.toString())
      .catch(() => this.text = 'Error');
    this.title = 'Contacts';
    this.icon = 'contact';
    this.targetView = Contacts;
  }

  private loadGroupsCard() {
    this.contactsRepository.fetchAllGroupsCount()
      .then(numberOfContacts => this.text = numberOfContacts.toString())
      .catch(() => this.text = 'Error');
    this.title = 'Groups';
    this.icon = 'contacts';
  }

  private goToView() {
    this.navController.push(this.targetView);
  }

}
