import {Injectable} from "@angular/core";
import {compact} from "lodash/fp";
import {Storage} from "@ionic/storage";
import {isString} from "lodash/fp";

@Injectable()
export class StorageHelper extends Storage {

  /**
   * Sets a boolean value for the given key.
   *
   * @param key the key to identify this value
   * @param value the value for this key
   * @return Promise that resolves when the value is set
   */
  setBoolean(key: string, value: boolean): Promise<any> {
    return this.set(key, Boolean(value).toString());
  }

  /**
   * Get the boolean value associated with the given key.
   * If the value is neither true nor false, it will default to false (e.g. unset value).
   *
   * @param key the key to identify this value
   * @return Promise that resolves with the value
   */
  getBoolean(key: string) {
    return new Promise((resolve, reject) => {
      this.get(key).then(res => {
        resolve(res === 'true');
      }).catch(reject);
    });
  }

  /**
   * Sets an value for the given key and automatically invokes JSON.stringify.
   *
   * @param key the key to identify this value
   * @param value the value for this key
   * @return Promise that resolves when the value is set
   */
  setObject(key: string, value: boolean): Promise<any> {
    return this.set(key, JSON.stringify(value));
  }

  /**
   * Get the object associated with the given key.
   * The value will automatically be converted to an object using JSON.parse.
   * Should parsing fail null will be returned.
   *
   * @param key the key to identify this value
   * @return Promise that resolves with the value
   */
  getObject(key: string) {
    return new Promise((resolve, reject) => {
      this.get(key).then(res => {
        if (!isString(res)) {
          resolve(null);
        } else {
          resolve(JSON.parse(res));
        }
      }).catch(reject);
    });
  }

}
