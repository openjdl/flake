import {
  ComponentDefinition,
  ComponentInstance,
  DesignerDragging,
  DesignerDraggingType,
  IDesignerDragging,
} from "../typings";
import { useCallback, useMemo, useState } from "react";

export function useDesignerDragging(): IDesignerDragging {
  const [dragging, setDragging] = useState<DesignerDragging>({
    type: DesignerDraggingType.None,
  });

  const use = useCallback((): DesignerDragging => {
    return dragging;
  }, [dragging]);

  const onNone = useCallback((): void => {
    setDragging((prevState) => {
      if (prevState.type === DesignerDraggingType.None) {
        return prevState;
      } else {
        return { type: DesignerDraggingType.None };
      }
    });
  }, [dragging]);

  const onComponentDefinition = useCallback(
    (definition: ComponentDefinition): void => {
      setDragging((prevState) => {
        if (
          prevState.type === DesignerDraggingType.ComponentDefinition &&
          prevState.definition.type === definition.type
        ) {
          return prevState;
        } else {
          return { type: DesignerDraggingType.ComponentDefinition, definition };
        }
      });
    },
    [dragging],
  );

  const onComponentInstance = useCallback(
    (instance: ComponentInstance): void => {
      setDragging((prevState) => {
        if (
          prevState.type === DesignerDraggingType.ComponentInstance &&
          prevState.instance.id === instance.id
        ) {
          return prevState;
        } else {
          return { type: DesignerDraggingType.ComponentInstance, instance };
        }
      });
    },
    [dragging],
  );

  return useMemo(
    () => ({
      type: dragging.type,
      use,
      onNone,
      onComponentDefinition,
      onComponentInstance,
    }),
    [dragging.type, use, onNone, onComponentDefinition, onComponentInstance],
  );
}
