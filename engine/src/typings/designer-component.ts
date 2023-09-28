import { FlakeRect, FlakeSize, Properties } from "./common-typings.ts";
import { ComponentDefinition, ComponentInstance } from "./component-typings.ts";
import { DesignerDroppableType } from "./designer-droppable-typings.ts";

export type IDesignerComponent = {
  isDropZoneOccupied(
    draggableRect: FlakeRect,
    droppableSize: FlakeSize,
    instanceId: string,
    parentId: string,
    offCanvas: boolean,
  ): boolean;

  resizeToDropZone(
    draggableRect: FlakeRect,
    draggableMinSize: FlakeSize,
    droppableSize: FlakeSize,
    selfId: string,
    parentId: string,
    offCanvas: boolean,
  ): { rect: FlakeRect; delta: FlakeRect; occupied: boolean };

  add(
    definition: ComponentDefinition,
    parentId: string,
    layout: FlakeRect,
  ): void;

  move(
    instance: ComponentInstance,
    droppableId: string,
    droppableType: DesignerDroppableType,
    droppableCols: number,
    layout: FlakeRect,
  ): void;

  rename(instance: ComponentInstance, name: string): void;

  updateSettings(instance: ComponentInstance, properties: Properties): void;
};
