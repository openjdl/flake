import {
  ComponentInstance,
  DesignerResizing,
  DesignerResizingType,
  IDesignerResizing,
} from "../typings";
import { useCallback, useMemo, useState } from "react";

export function useDesignerResizing(): IDesignerResizing {
  const [resizing, setResizing] = useState<DesignerResizing>({
    type: DesignerResizingType.None,
  });

  const use = useCallback((): DesignerResizing => {
    return resizing;
  }, [resizing]);

  const onNone = useCallback((): void => {
    setResizing((prevState) => {
      if (prevState.type === DesignerResizingType.None) {
        return prevState;
      } else {
        return { type: DesignerResizingType.None };
      }
    });
  }, [resizing]);

  const onComponentInstance = useCallback(
    (instance: ComponentInstance): void => {
      setResizing((prevState) => {
        if (
          prevState.type === DesignerResizingType.ComponentInstance &&
          prevState.instance.id === instance.id
        ) {
          return prevState;
        } else {
          return { type: DesignerResizingType.ComponentInstance, instance };
        }
      });
    },
    [resizing],
  );

  return useMemo(
    () => ({
      type: resizing.type,
      use,
      onNone,
      onComponentInstance,
    }),
    [resizing.type, use, onNone, onComponentInstance],
  );
}
