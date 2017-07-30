export abstract class AbstractRepository {

  /**
   * Takes an HTMLCollection like structure and converts it to an Array.
   * The SQLite plugin returns all results like this.
   *
   * @param res
   * @return {Array}
   */
  protected collectionToArray(res: HTMLCollection) {
    const extracted = [];
    for(let i = 0; i < res.length; i++) {
      extracted.push(res.item(i));
    }
    return extracted;
  }

}
