import {
  ComponentDefinition,
  ComponentInstance,
  DesignerDroppableType,
  FlakeApp,
  FlakeRect,
  FlakeSize,
  IDesignerComponent,
  IDesignerSelecting,
  Properties,
} from "../typings";
import { useCallback, useMemo } from "react";
import { Constants } from "../app/Constants.ts";
import { setProperties } from "../utils/setProperties.ts";

export function useDesignerComponent(
  app: FlakeApp,
  selecting: IDesignerSelecting,
): IDesignerComponent {
  const isDropZoneOccupied = useCallback(
    (
      draggableRect: FlakeRect,
      droppableSize: FlakeSize,
      instanceId: string,
      parentId: string,
      offCanvas: boolean,
    ): boolean => {
      // 必须在 drop 区域内
      // 与其他组件做刚体碰撞检测

      // 左边界
      if (draggableRect.x < 0) {
        return false;
      }

      // 右边界
      if (draggableRect.x + draggableRect.width > droppableSize.width) {
        return false;
      }

      // 上边界
      if (draggableRect.y < 0) {
        return false;
      }

      // 下边界
      if (draggableRect.y + draggableRect.height > droppableSize.height) {
        return false;
      }

      // 其他刚体
      if (!offCanvas) {
        const bodies = app.component.instances
          .filter((it) => !it.definition.offCanvas)
          .filter((it) => it.id !== instanceId && it.parentId === parentId)
          .map((it) => it.layout);

        for (const body of bodies) {
          const intersect =
            draggableRect.x + draggableRect.width > body.x &&
            body.x + body.width > draggableRect.x &&
            draggableRect.y + draggableRect.height > body.y &&
            body.y + body.height > draggableRect.y;
          if (intersect) {
            return false;
          }
        }
      }

      // 过
      return true;
    },
    [app],
  );

  const resizeToDropZone = useCallback(
    (
      draggableRect: FlakeRect,
      draggableMinSize: FlakeSize,
      droppableSize: FlakeSize,
      instanceId: string,
      parentId: string,
      offCanvas: boolean,
    ): { rect: FlakeRect; delta: FlakeRect; occupied: boolean } => {
      // 必须在 drop 区域内
      // 与其他组件做刚体碰撞检测

      const rect: FlakeRect = { ...draggableRect };
      const delta: FlakeRect = { x: 0, y: 0, width: 0, height: 0 };

      // 左边界
      if (rect.x < 0) {
        delta.width -= rect.x;
        delta.x += rect.x;
      }

      // 右边界
      if (rect.x + rect.width > droppableSize.width) {
        delta.width += rect.x + rect.width - droppableSize.width;
      }

      // 上边界
      if (rect.y < 0) {
        delta.height -= rect.y;
        delta.y += rect.y;
      }

      // 下边界
      if (rect.y + rect.height > droppableSize.height) {
        delta.height += rect.y + rect.height - droppableSize.height;
      }

      // 偏移计算
      rect.x -= delta.x;
      rect.y -= delta.y;
      rect.width -= delta.width;
      rect.height -= delta.height;

      // 限制
      if (
        rect.width < draggableMinSize.width ||
        rect.height < draggableMinSize.height
      ) {
        return { rect, delta, occupied: true };
      }

      // 其他刚体
      let inside = false;
      if (!offCanvas) {
        // 确定一个最小框
        const bodies = app.component.instances
          .filter((it) => !it.definition.offCanvas)
          .filter((it) => it.id !== instanceId && it.parentId === parentId)
          .map((it) => it.layout);

        for (let it of bodies) {
          const top = Math.max(it.y, rect.y);
          const left = Math.max(it.x, rect.x);
          const right = Math.min(it.x + it.width, rect.x + rect.width);
          const bottom = Math.min(it.y + it.height, rect.y + rect.height);
          const width = right - left;
          const height = bottom - top;

          if (left < right && top < bottom) {
            if (width >= rect.width && height >= rect.height) {
              inside = true;
              break;
            }

            // rect 边界
            const rectLeft = rect.x;
            const rectRight = rect.x + rect.width;
            const rectTop = rect.y;
            const rectBottom = rect.y + rect.height;

            if (width < rect.width) {
              // 右侧有交叉
              if (rectLeft < left) {
                const chop: number = rectRight - left;

                delta.width += chop;
                rect.width -= chop;
              }
              // 左侧交叉
              else {
                const chop: number = right - rectLeft;

                delta.x -= chop;
                delta.width += chop;
                rect.x += chop;
                rect.width -= chop;
              }
            }

            if (height < rect.height) {
              // 上侧交叉
              if (rectTop < top) {
                const chop: number = rectBottom - top;

                delta.height += chop;
                rect.height -= chop;
              }
              // 下侧交叉
              else {
                const chop: number = bottom - rectTop;

                delta.y -= chop;
                delta.height += chop;
                rect.y += chop;
                rect.height -= chop;
              }
            }
          }
        }
      }

      // 过
      return {
        rect,
        delta,
        occupied:
          inside ||
          rect.width < draggableMinSize.width ||
          rect.height < draggableMinSize.height,
      };
    },
    [app],
  );

  const add = useCallback(
    (
      definition: ComponentDefinition,
      parentId: string,
      layout: FlakeRect,
    ): void => {
      // id
      const id = app.nextID();

      // name
      let nextSeq: number = app.component.instances.length + 1;
      let name = `${definition.type}${nextSeq}`;
      while (app.isNameOccupied(name)) {
        nextSeq++;
        name = `${definition.type}${nextSeq}`;
      }

      //
      const instance: ComponentInstance = {
        id,
        version: 1,
        name,
        parentId,
        layout: {
          x: layout.x,
          y: layout.y,
          width: layout.width,
          height: layout.height,
        },
        get brief(): string {
          return `Component(${this.id}, ${this.name})`;
        },
        definition,
        properties: {},
        pro: undefined,
      };
      app.component.add(instance);
      selecting.onComponentInstance(instance);
    },
    [app],
  );

  const move = useCallback(
    (
      instance: ComponentInstance,
      droppableId: string,
      droppableType: DesignerDroppableType,
      droppableCols: number,
      layout: FlakeRect,
    ): void => {
      let nextParentId: string;
      if (droppableType === DesignerDroppableType.Canvas) {
        nextParentId = "";
      } else if (droppableType === DesignerDroppableType.Container) {
        nextParentId = droppableId;
      } else {
        return;
      }
      app.component.updateParent(instance.id, nextParentId);

      const x = Math.max(0, Math.min(layout.x, droppableCols - 2));
      const y = Math.max(0, Math.min(layout.y, Constants.row.max - 2));
      const width = Math.max(
        2,
        layout.width,
        Math.min(layout.width, droppableCols - x),
      );
      const height = Math.max(
        2,
        layout.height,
        Math.min(layout.height, Constants.row.max - y),
      );
      instance.layout = { x, y, width, height };
      app.component.onUpdated(instance.id);
    },
    [app],
  );

  const rename = useCallback(
    (instance: ComponentInstance, name: string): void => {
      instance.name = name;
      app.component.onUpdated(instance.id);
    },
    [app],
  );

  const updateSettings = useCallback(
    (instance: ComponentInstance, properties: Properties): void => {
      if (setProperties(instance.properties, properties, true)) {
        app.component.onUpdated(instance.id);
      }
    },
    [app],
  );

  return useMemo(
    () => ({
      isDropZoneOccupied,
      resizeToDropZone,
      add,
      move,
      rename,
      updateSettings,
    }),
    [isDropZoneOccupied, resizeToDropZone, add, move, rename, updateSettings],
  );
}
