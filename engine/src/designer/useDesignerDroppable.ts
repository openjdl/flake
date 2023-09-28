import {
  DesignerDroppableInfo,
  DesignerUseDroppableResult,
  FlakeRect,
  IDesignerDroppable,
} from "../typings";
import { MutableRefObject, useCallback, useMemo } from "react";
import { ClientRect, useDroppable } from "@dnd-kit/core";

export function useDesignerDroppable(): IDesignerDroppable {
  const use = useCallback(
    (
      info: DesignerDroppableInfo,
      disabled: boolean,
    ): DesignerUseDroppableResult => {
      const { setNodeRef, rect, isOver } = useDroppable({
        id: `Droppable-${info.type}-${info.instanceId}`,
        disabled,
        data: info,
      });
      const flakeRect = useFlakeRect(rect);

      return [
        setNodeRef,
        { type: info.type, rect: flakeRect, isDragOver: isOver },
      ];
    },
    [],
  );

  return useMemo<IDesignerDroppable>(
    () => ({
      use,
    }),
    [use],
  );
}

function useFlakeRect(
  rect: MutableRefObject<ClientRect | null>,
): FlakeRect | null {
  return useMemo<FlakeRect | null>(() => {
    const current = rect.current;
    return current
      ? {
          x: current.left,
          y: current.top,
          width: current.width,
          height: current.height,
        }
      : null;
  }, [rect]);
}
