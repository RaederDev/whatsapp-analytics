import {Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange} from "@angular/core";
import {Contact} from "../../data-access/entity/contact";

@Component({
  selector: 'contact-list',
  templateUrl: 'contact-list.html'
})
export class ContactList implements OnChanges {

  @Input()
  public contacts: Array<Contact> = [];

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const change: SimpleChange = changes['contacts'];
    this.contacts = change.currentValue;
  }

}
