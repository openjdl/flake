import {
  ComponentInstance,
  DesignerSelecting,
  DesignerSelectingType,
  FlakeApp,
  IDesignerSelecting,
} from "../typings";
import { useCallback, useMemo, useState } from "react";

export function useDesignerSelecting(app: FlakeApp): IDesignerSelecting {
  const [selecting, setSelecting] = useState<DesignerSelecting>({
    type: DesignerSelectingType.None,
  });

  const use = useCallback((): DesignerSelecting => {
    return selecting;
  }, [selecting]);

  const onNone = useCallback((): void => {
    setSelecting((prevState) => {
      if (prevState.type === DesignerSelectingType.None) {
        return prevState;
      } else {
        return { type: DesignerSelectingType.None };
      }
    });
  }, [selecting]);

  const onComponentInstance = useCallback(
    (instance: ComponentInstance): void => {
      setSelecting((prevState) => {
        if (
          prevState.type === DesignerSelectingType.ComponentInstance &&
          prevState.instance.id === instance.id
        ) {
          return prevState;
        } else {
          return { type: DesignerSelectingType.ComponentInstance, instance };
        }
      });
    },
    [selecting],
  );

  const isSelectComponentInstance = useCallback(
    (instance: ComponentInstance, descendants?: boolean): boolean => {
      if (selecting.type !== DesignerSelectingType.ComponentInstance) {
        return false;
      }

      const ids: string[] = [instance.id];

      if (descendants) {
        ids.push(
          ...app.component.findDescendants(instance.id).map((it) => it.id),
        );
      }

      return ids.includes(selecting.instance.id);
    },
    [selecting],
  );

  return useMemo(
    () => ({
      type: selecting.type,
      use,
      onNone,
      onComponentInstance,
      isSelectComponentInstance,
    }),
    [
      selecting.type,
      use,
      onNone,
      onComponentInstance,
      isSelectComponentInstance,
    ],
  );
}
