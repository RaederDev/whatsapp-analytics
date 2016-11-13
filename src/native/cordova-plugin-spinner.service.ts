import {Injectable} from "@angular/core";

declare var SpinnerPlugin: any;

@Injectable()
export class CordovaPluginSpinner {

  public activityStart(
    text: string = "Loading...",
    options: any = { dimBackground: true }
  ) {
    SpinnerPlugin.activityStart("Loading...", options);
  }

  public activityStop() {
    SpinnerPlugin.activityStop();
  }

}
