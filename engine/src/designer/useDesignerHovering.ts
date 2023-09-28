import {
  ComponentInstance,
  DesignerHovering,
  DesignerHoveringType,
  IDesignerHovering,
} from "../typings";
import { useCallback, useMemo, useState } from "react";

export function useDesignerHovering(): IDesignerHovering {
  const [hovering, setHovering] = useState<DesignerHovering>({
    type: DesignerHoveringType.None,
  });

  const use = useCallback(() => hovering, [hovering]);

  const onNone = useCallback(() => {
    setHovering((prevState) => {
      if (prevState.type === DesignerHoveringType.None) {
        return prevState;
      } else {
        return { type: DesignerHoveringType.None };
      }
    });
  }, [hovering]);

  const onComponentInstance = useCallback(
    (instance: ComponentInstance): void => {
      setHovering((prevState) => {
        if (
          prevState.type === DesignerHoveringType.ComponentInstance &&
          prevState.instance.id === instance.id
        ) {
          return prevState;
        } else {
          return { type: DesignerHoveringType.ComponentInstance, instance };
        }
      });
    },
    [hovering],
  );

  return useMemo(
    () => ({
      type: hovering.type,
      use,
      onNone,
      onComponentInstance,
    }),
    [hovering.type, use, onNone, onComponentInstance],
  );
}
