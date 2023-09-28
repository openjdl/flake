import { FlakeRect } from "./common-typings.ts";

export enum DesignerDroppableType {
  Canvas = "Canvas",
  Container = "Container",
}

export type DesignerDroppable = {
  type: DesignerDroppableType;
  rect: FlakeRect | null;
  isDragOver: boolean;
};

export type DesignerDroppableInfo = {
  type: DesignerDroppableType;
  instanceId: string;
  columns: number;
  rows: number;
  columnWidth: number;
  layout: FlakeRect;
};

export type DesignerUseDroppableResult = [
  setNodeRef: (element: HTMLElement | null) => void,
  droppable: DesignerDroppable,
];

export type IDesignerDroppable = {
  use(
    info: DesignerDroppableInfo,
    disabled: boolean,
  ): DesignerUseDroppableResult;
};
