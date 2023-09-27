import { EngineConstantsType } from "../typings/constants-typings.ts";
import { LayoutMode } from "../typings";

export const ColumnStep: number = 12;
export const RowHeight: number = 10;

export const EngineConstants: EngineConstantsType = {
  layout: {
    [LayoutMode.Fluid]: {
      name: "宽屏",
      width: -1,
      height: -1,
      componentPadding: 4,
      scrollbarSize: 6,
    },
    [LayoutMode.Desktop]: {
      name: "桌面",
      width: 1280,
      height: -1,
      componentPadding: 4,
      scrollbarSize: 6,
    },
    [LayoutMode.Phone]: {
      // iPhone 13 mini
      name: "手机",
      width: 375,
      height: 812,
      componentPadding: 4,
      scrollbarSize: 6,
    },
    [LayoutMode.Tablet]: {
      // iPad mini 8.3
      name: "平板",
      width: 744,
      height: 1133,
      componentPadding: 4,
      scrollbarSize: 6,
    },
  },
  column: {
    initial: ColumnStep * 2,
    min: ColumnStep,
    max: ColumnStep * 6,
    step: ColumnStep,
  },
  row: {
    initial: 200,
    min: 20,
    max: 1000,
    step: 10,
    height: RowHeight,
  },
  designer: {
    headerHeight: 32,
    menuWidth: 250,
    propertiesEditorWidth: 350,
    zDroppable: 1,
    zDraggingBoundaries: 2,
    zComponentDefinition: 3,
    zComponentInstance: 4,
    zComponentName: 4,
    zComponentInstanceSelected: 10,
    zHeader: 1001,
    zLeft: 997,
    zMiddle: 0,
    zRight: 997,
    zSplitter: 998,
  },
};
