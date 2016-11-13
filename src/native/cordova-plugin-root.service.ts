import {Injectable} from "@angular/core";
import {PromiseUtils} from "../shared/promise-utils.service";

declare var root: any;

@Injectable()
export class CordovaPluginRoot {

  constructor(
    private promiseUtils: PromiseUtils
  ) {}

  public isAvailable(): Promise<boolean> {
    return this.promiseUtils.wrapLeft(root.isAvailable);
  }

  public run(command: string): Promise<Array<string>> {
    return this.promiseUtils.wrapRight(root.run, command);
  }

}
