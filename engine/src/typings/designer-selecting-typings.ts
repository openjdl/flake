import { ComponentInstance } from "./component-typings.ts";

export enum DesignerSelectingType {
  None = "None",
  ComponentInstance = "ComponentInstance",
}

export type DesignerNoneSelecting = {
  type: DesignerSelectingType.None;
};
export type DesignerComponentInstanceSelecting = {
  type: DesignerSelectingType.ComponentInstance;
  instance: ComponentInstance;
};

export type DesignerSelecting =
  | DesignerNoneSelecting
  | DesignerComponentInstanceSelecting;

export type IDesignerSelecting = {
  readonly type: DesignerSelectingType;

  use(): DesignerSelecting;
  onNone(): void;
  onComponentInstance(instance: ComponentInstance): void;

  isSelectComponentInstance(
    instance: ComponentInstance,
    descendants?: boolean,
  ): boolean;
};
