import { LayoutMode } from "./app-typings.ts";

export type LayoutConstantsType = {
  name: string;
  width: number;
  height: number;
  componentPadding: number;
  scrollbarSize: number;
};

export type ColumnConstantsType = {
  initial: number;
  min: number;
  max: number;
  step: number;
};

export type RowConstantsType = {
  initial: number;
  min: number;
  max: number;
  step: number;
  height: number;
};

export type DesignerConstantsType = {
  headerHeight: number;
  menuWidth: number;
  propertiesEditorWidth: number;
  zDroppable: number;
  zDraggingBoundaries: number;
  zComponentDefinition: number;
  zComponentInstance: number;
  zComponentName: number;
  zComponentInstanceSelected: number;
  zHeader: number;
  zLeft: number;
  zMiddle: number;
  zRight: number;
  zSplitter: number;
}

export type ConstantsType = {
  layout: Record<LayoutMode, LayoutConstantsType>;
  column: ColumnConstantsType;
  row: RowConstantsType;
  designer: DesignerConstantsType;
}
