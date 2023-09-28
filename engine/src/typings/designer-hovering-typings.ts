import { ComponentInstance } from "./component-typings.ts";

export enum DesignerHoveringType {
  None = "None",
  ComponentInstance = "ComponentInstance",
}

export type DesignerNoneHovering = {
  type: DesignerHoveringType.None;
};

export type DesignerComponentInstanceHovering = {
  type: DesignerHoveringType.ComponentInstance;
  instance: ComponentInstance;
};

export type DesignerHovering =
  | DesignerNoneHovering
  | DesignerComponentInstanceHovering;

export type IDesignerHovering = {
  readonly type: DesignerHoveringType;

  use(): DesignerHovering;
  onNone(): void;
  onComponentInstance(instance: ComponentInstance): void;
};
