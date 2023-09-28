import { IDesignerDroppable } from "./designer-droppable-typings.ts";
import { IDesignerDraggable } from "./designer-draggable-typings.ts";
import { IDesignerHovering } from "./designer-hovering-typings.ts";
import { IDesignerDragging } from "./designer-dragging-typings.ts";
import { IDesignerResizing  } from "./designer-resizing-typings.ts";
import {IDesignerSelecting } from "./designer-selecting-typings.ts";
import { IDesignerComponent } from "./designer-component.ts";
import { FlakeApp } from "./app-typings.ts";

export type FlakeDesigner = {
  readonly app: FlakeApp;
  readonly saving: boolean;
  previewing: boolean;
  menuWidth: number;
  propertiesEditorWidth: number;
  readonly contentWidth: number;
  readonly height: number;
  readonly droppable: IDesignerDroppable;
  readonly draggable: IDesignerDraggable;
  readonly hovering: IDesignerHovering;
  readonly dragging: IDesignerDragging;
  readonly selecting: IDesignerSelecting;
  readonly resizing: IDesignerResizing;
  readonly component: IDesignerComponent;

  debugPrint(): void;
};
