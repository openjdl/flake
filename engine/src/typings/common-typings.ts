export type Maybe<T> = T | null | undefined;

export type Properties = Record<
  string,
  boolean | number | string | null | undefined
>;

export type FlakeCoordinates = {
  x: number;
  y: number;
};

export type FlakeSize = {
  width: number;
  height: number;
};

export type FlakeTransform = FlakeCoordinates & {
  scaleX: number;
  scaleY: number;
};

export type FlakeRect = FlakeCoordinates & FlakeSize;

export enum DesignerSplitterCategory {
  Menu = "Menu",
  PropertiesEditor = "PropertiesEditor",
}

export enum DesignerResizeHandleType {
  Top = "Top",
  Right = "Right",
  Bottom = "Bottom",
  Left = "Left",
  TopRight = "TopRight",
  BottomRight = "BottomRight",
  BottomLeft = "BottomLeft",
  TopLeft = "TopLeft",
}
