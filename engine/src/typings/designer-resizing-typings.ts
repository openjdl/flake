import { ComponentInstance } from "./component-typings.ts";

export enum DesignerResizingType {
  None = "None",
  ComponentInstance = "ComponentInstance",
}

export type DesignerNoneResizing = {
  type: DesignerResizingType.None;
};
export type DesignerComponentInstanceResizing = {
  type: DesignerResizingType.ComponentInstance;
  instance: ComponentInstance;
};

export type DesignerResizing =
  | DesignerNoneResizing
  | DesignerComponentInstanceResizing;

export type IDesignerResizing = {
  readonly type: DesignerResizingType;

  use(): DesignerResizing;
  onNone(): void;
  onComponentInstance(instance: ComponentInstance): void;
};
