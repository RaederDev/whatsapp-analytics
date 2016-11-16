import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {NumberInfoCardVariant} from "../../shared/components/cards/number-info-card/number-info-card-variant";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {

  private numberInfoCardVariant: any = NumberInfoCardVariant;

  constructor(
    public navCtrl: NavController
  ) {}

}
