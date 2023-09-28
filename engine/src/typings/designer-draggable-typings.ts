import {
  FlakeTransform,
  DesignerResizeHandleType,
  DesignerSplitterCategory,
} from "./common-typings.ts";
import { ComponentDefinition, ComponentInstance } from "./component-typings.ts";

export enum DesignerDraggableType {
  Splitter = "Splitter",
  ComponentDefinition = "ComponentDefinition",
  ComponentInstance = "ComponentInstance",
  ResizeHandle = "ResizeHandle",
}

export type DesignerDraggable = {
  type: DesignerDraggableType;
  transform: FlakeTransform | null;
  isDragging: boolean;
};

export type DesignerDraggableSplitterInfo = {
  type: DesignerDraggableType.Splitter;
  category: DesignerSplitterCategory;
};

export type DesignerDraggableComponentDefinitionInfo = {
  type: DesignerDraggableType.ComponentDefinition;
  definition: ComponentDefinition;
};

export type DesignerDraggableComponentInstanceInfo = {
  type: DesignerDraggableType.ComponentInstance;
  instance: ComponentInstance;
};

export type DesignerDraggableResizeHandleInfo = {
  type: DesignerDraggableType.ResizeHandle;
  handle: DesignerResizeHandleType;
  instance: ComponentInstance;
};

export type DesignerDraggableInfo =
  | DesignerDraggableSplitterInfo
  | DesignerDraggableComponentDefinitionInfo
  | DesignerDraggableComponentInstanceInfo
  | DesignerDraggableResizeHandleInfo;

export type DesignerUseDraggableResult = [
  setNodeRef: (element: HTMLElement | null) => void,
  nodeProps: Record<string, any>,
  draggable: DesignerDraggable,
];

export type IDesignerDraggable = {
  useSplitter(
    category: DesignerSplitterCategory,
    disabled: boolean,
  ): DesignerUseDraggableResult;

  useComponentDefinition(
    definition: ComponentDefinition,
    disabled: boolean,
  ): DesignerUseDraggableResult;

  useComponentInstance(
    instance: ComponentInstance,
    disabled: boolean,
  ): DesignerUseDraggableResult;

  useResizeHandle(
    handle: DesignerResizeHandleType,
    instance: ComponentInstance,
    disabled: boolean,
  ): DesignerUseDraggableResult;
};
