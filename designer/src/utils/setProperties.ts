import { Properties } from "../typings/common-typings.ts";

export function setProperties(
  target: Properties,
  properties: Properties,
  removeNull: boolean,
): boolean {
  for (let key in properties) {
    const value = properties[key];

    if ((value === undefined || value === null) && removeNull) {
      delete target[key];
    } else {
      target[key] = value;
    }
  }

  return Object.keys(properties).length > 0;
}
