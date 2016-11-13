import {Injectable} from "@angular/core";

@Injectable()
export class PromiseUtils {

  /**
   * Takes a function that takes a success and fail callback.
   * Then returns a promise, invokes the function with success function as first parameter,
   * fail as second parameter and applies additional parameters at the end of the function.
   *
   * @param fn
   * @param args
   * @return {Promise<T>}
   */
  public wrapLeft(fn: Function, ...args: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      fn(resolve, reject, ...args);
    });
  }

  /**
   * Takes a function that takes a success and fail callback.
   * Then returns a promise, invokes the function with success function as the second to last parameter,
   * fail as last parameter and applies additional parameters at the start of the function.
   *
   * @param fn
   * @param args
   * @return {Promise<T>}
   */
  public wrapRight(fn: Function, ...args: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      fn(...args, resolve, reject);
    });
  }

}
