export abstract class Entity {

  //maps DB column -> entity property
  protected columnToPropertyMap: {} = {};

  //maps entity propery -> DB column
  protected propertiesToColumnsMap: {} = {};

  /**
   * Name of the entity
   */
  protected name: string;

  constructor(name: string, propertiesToColumnsMap = null) {
    if(propertiesToColumnsMap !== null) {
      this.setPropertiesToColumnsMap(propertiesToColumnsMap);
      this.clearEntity();
    }
  }

  public copyColumnsToProperties(columns: any): void {
    const keys = Object.keys(columns);
    keys.forEach(key => {
      const propertyName = this.columnToPropertyMap[key];
      this[propertyName] = columns[key];
    });
  }

  protected clearEntity(): void {
    Object.keys(this.columnToPropertyMap).forEach(key => this[key] = null);
  }

  protected setPropertiesToColumnsMap(map: {}) {
    this.propertiesToColumnsMap = map;
    this.columnToPropertyMap = this.swapKeyValue(map);
  }

  protected swapKeyValue(object): any {
    const keys = Object.keys(object);
    const swapped = {};
    for (let i = 0; i < keys.length; i++) {
      swapped[object[keys[i]]] = keys[i];
    }
    return swapped;
  }

}
