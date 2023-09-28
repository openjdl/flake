import {
  ComponentDefinition,
  ComponentInstance,
  DesignerDraggableInfo,
  DesignerDraggableType,
  DesignerResizeHandleType,
  DesignerSplitterCategory,
  DesignerUseDraggableResult,
  FlakeTransform,
  IDesignerDraggable,
} from "../typings";
import { useCallback, useMemo } from "react";
import { Transform } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";

export function useDesignerDraggable(): IDesignerDraggable {
  const use = useCallback(
    (
      id: string,
      disabled: boolean,
      info: DesignerDraggableInfo,
    ): DesignerUseDraggableResult => {
      const { setNodeRef, transform, attributes, listeners, isDragging } =
        useDraggable({
          id: `Draggable-${info.type}-${id}`,
          disabled,
          data: info,
        });
      const flakeTransform = useFlakeTransform(transform);

      return [
        setNodeRef,
        { ...attributes, ...listeners },
        { type: info.type, transform: flakeTransform, isDragging },
      ];
    },
    [],
  );

  const useSplitter = useCallback(
    (
      category: DesignerSplitterCategory,
      disabled: boolean,
    ): DesignerUseDraggableResult => {
      return use(category, disabled, {
        type: DesignerDraggableType.Splitter,
        category,
      });
    },
    [use],
  );

  const useComponentDefinition = useCallback(
    (
      definition: ComponentDefinition,
      disabled: boolean,
    ): DesignerUseDraggableResult => {
      return use(definition.type, disabled, {
        type: DesignerDraggableType.ComponentDefinition,
        definition,
      });
    },
    [use],
  );

  const useComponentInstance = useCallback(
    (
      instance: ComponentInstance,
      disabled: boolean,
    ): DesignerUseDraggableResult => {
      return use(instance.id, disabled, {
        type: DesignerDraggableType.ComponentInstance,
        instance,
      });
    },
    [use],
  );

  const useResizeHandle = useCallback(
    (
      handle: DesignerResizeHandleType,
      instance: ComponentInstance,
      disabled: boolean,
    ): DesignerUseDraggableResult => {
      return use(`${handle}-${instance.id}`, disabled, {
        type: DesignerDraggableType.ResizeHandle,
        handle,
        instance,
      });
    },
    [use],
  );

  return useMemo(
    () => ({
      useSplitter,
      useComponentDefinition,
      useComponentInstance,
      useResizeHandle,
    }),
    [
      useSplitter,
      useComponentDefinition,
      useComponentInstance,
      useResizeHandle,
    ],
  );
}

function useFlakeTransform(transform: Transform | null): FlakeTransform | null {
  return useMemo<FlakeTransform | null>(() => {
    return transform
      ? {
          x: transform.x,
          y: transform.y,
          scaleX: transform.scaleX,
          scaleY: transform.scaleY,
        }
      : null;
  }, [transform]);
}
