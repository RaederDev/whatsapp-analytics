import {Pipe, PipeTransform} from "@angular/core";
import numeral from "numeral";

@Pipe({ name: 'numeral' })
export class NumeralPipe implements PipeTransform{

  transform(value: any, ...args): any {
    return numeral(value).format();
  }

}
