import {Component, OnChanges, SimpleChange, Input, OnInit} from "@angular/core";
import {NumberInfoCardVariant} from "./number-info-card-variant";
import {RepositoryFactory} from "../../../data-access/repository-factory.service";
import Repository from "../../../data-access/repository.interface";

@Component({
  selector: 'number-info-card',
  templateUrl: 'number-info-card.html'
})
export class NumberInfoCard implements OnChanges, OnInit {

  @Input()
  private type: NumberInfoCardVariant;

  private text: string = 'Loading...';
  private title: string;
  private icon: string;
  private valid: boolean = false;
  private repository: Repository;

  constructor(
    private repositoryFactory: RepositoryFactory
  ) {
    this.repository = this.repositoryFactory.getRepository();
  }

  private loadCardData() {
    switch (this.type) {
      case NumberInfoCardVariant.Contacts:
        this.loadContactCard();
        break;
      case NumberInfoCardVariant.Groups:
        this.loadGroupsCard();
        break;
      default:
        this.valid = false;
        return;
    }
    this.valid = true;
  }

  private loadContactCard() {
    this.repository.fetchAllContactsCount()
      .then(numberOfContacts => this.text = numberOfContacts.toString())
      .catch(() => this.text = 'Error');
    this.title = 'Contacts';
    this.icon = 'contact';
  }

  private loadGroupsCard() {
    this.repository.fetchAllGroupsCount()
      .then(numberOfContacts => this.text = numberOfContacts.toString())
      .catch(() => this.text = 'Error');
    this.title = 'Groups';
    this.icon = 'contacts';
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const type: SimpleChange = changes['type'];
    this.type = type.currentValue;
    this.loadCardData();
  }

  ngOnInit(): void {
    this.loadCardData();
  }

}
