import { ComponentDefinition, ComponentInstance } from "./component-typings.ts";

export enum DesignerDraggingType {
  None = "None",
  ComponentDefinition = "ComponentDefinition",
  ComponentInstance = "ComponentInstance",
}

export type DesignerNoneDragging = {
  type: DesignerDraggingType.None;
};

export type DesignerComponentDefinitionDragging = {
  type: DesignerDraggingType.ComponentDefinition;
  definition: ComponentDefinition;
};

export type DesignerComponentInstanceDragging = {
  type: DesignerDraggingType.ComponentInstance;
  instance: ComponentInstance;
};

export type DesignerDragging =
  | DesignerNoneDragging
  | DesignerComponentDefinitionDragging
  | DesignerComponentInstanceDragging;

export type IDesignerDragging = {
  readonly type: DesignerDraggingType;

  use(): DesignerDragging;
  onNone(): void;
  onComponentDefinition(definition: ComponentDefinition): void;
  onComponentInstance(instance: ComponentInstance): void;
};
