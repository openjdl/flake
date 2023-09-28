import React, {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ComponentDefinition,
  ComponentInstance,
  ComponentPro,
  FlakeApp,
  IComponent,
} from "../typings";
import { verifyName } from "../utils/verifyName.ts";
import { Constants } from "./Constants.ts";
import { Alert, AlertIcon } from "@chakra-ui/react";

export function useFlakeAppComponent(
  appRef: MutableRefObject<FlakeApp | undefined>,
): IComponent {
  const [version, setVersion] = useState<number>(1);

  const definitions = useRef<ComponentDefinition[]>([]);

  const getDefinitions = useCallback(() => definitions.current, [version]);

  const register = useCallback((definition: ComponentDefinition) => {
    if (!verifyName(definition.type)) {
      return;
    }

    if (definitions.current.some((it) => it.type === definition.type)) {
      console.error(`组件 ${definition.type} 重复注册`);
      return;
    }

    if (definition.minSize.width < 1) {
      console.warn(
        `组件 ${definition.type}.minSize.width ${definition.minSize.width} < 1, 修正为 1`,
      );
      definition.minSize.width = 1;
    } else if (definition.minSize.width > 12) {
      console.warn(
        `组件 ${definition.type}.minSize.width ${definition.minSize.width} > 12, 修正为 12`,
      );
      definition.minSize.width = 12;
    }

    if (definition.minSize.height < 3) {
      console.warn(
        `组件 ${definition.type}.minSize.height ${definition.minSize.height} < 3, 修正为 3`,
      );
      definition.minSize.height = 3;
    } else if (definition.minSize.width > Constants.row.max) {
      console.warn(
        `组件 ${definition.type}.minSize.height ${definition.minSize.height} > ${Constants.row.max}, 修正为 ${Constants.row.max}`,
      );
      definition.minSize.height = Constants.row.max;
    }

    definitions.current.push(definition);
    setVersion((prevState) => prevState + 1);
  }, []);

  const definitionOf = useCallback((type: string): ComponentDefinition => {
    const definition = definitions.current.find((it) => it.type === type);

    if (definition) {
      return definition;
    }

    return {
      type: "ErrorOfComponentNotFound",
      name: "ErrorOfComponentNotFound",
      minSize: { width: 3, height: 3 },
      runtime(): React.ReactNode {
        return (
          <Alert status="error">
            <AlertIcon />
            {`组件 ${type} 丢失`}
          </Alert>
        );
      },
    };
  }, []);

  const instances = useRef<ComponentInstance[]>([]);

  const getInstances = useCallback(() => instances.current, [version]);

  const setInstances = useCallback(
    (value: (prev: ComponentInstance[]) => ComponentInstance[]): void => {
      const prev = instances.current;
      const next = value(prev);
      appRef.current?.debug("SetComponentInstances", next);
      instances.current = next;
      setVersion((prevState) => prevState + 1);
    },
    [appRef],
  );

  const onUpdated = useCallback(
    (id: string): void => {
      let instance = instances.current.find((it) => it.id === id);
      if (!instance) {
        return;
      }
      instance.version++;
      appRef.current?.debug(instance.brief, "Updated");
      setVersion((prevState) => prevState + 1);
    },
    [appRef],
  );

  const findById = useCallback((id: string): ComponentInstance | null => {
    return instances.current.find((it) => it.id === id) ?? null;
  }, []);

  const findByName = useCallback((name: string): ComponentInstance | null => {
    return instances.current.find((it) => it.name === name) ?? null;
  }, []);

  const findDescendants = useCallback((id: string): ComponentInstance[] => {
    const found: ComponentInstance[] = [];
    const finder = (parent: string) => {
      const arr = instances.current.filter((it) => it.parentId === parent);
      found.push(...arr);
      for (let item of arr) {
        finder(item.id);
      }
    };
    finder(id);
    return found;
  }, []);

  const add = useCallback(
    (instance: ComponentInstance) => {
      if (instance.definition.offCanvas) {
        instance.parentId = "";
      }
      instances.current.push(instance);
      setVersion((prevState) => prevState + 1);
      appRef.current?.debug(instance.brief, "Added");
    },
    [appRef, version],
  );

  const updateParent = useCallback(
    (id: string, parentId: string): void => {
      const instance = instances.current.find((it) => it.id === id);
      if (!instance || instance.parentId === parentId) {
        return;
      }

      const prevParentId = instance.parentId;
      const nextParentId = parentId;

      instance.parentId = parentId;

      onUpdated(id);
      onUpdated(prevParentId);
      onUpdated(nextParentId);
    },
    [onUpdated],
  );

  const remove = useCallback(
    (id: string) => {
      const i = instances.current.findIndex((it) => it.id === id);
      if (i === -1) {
        return;
      }

      const deleted = instances.current[i];
      const next = [...instances.current];
      next.splice(i, 1);
      instances.current = next;
      setVersion((prevState) => prevState + 1);

      appRef.current?.debug(deleted.brief, "Removed");
    },
    [appRef],
  );

  const onColumnsUpdated = useCallback(
    (parentId: string, prevCols: number, currentCols: number) => {
      const ratio = currentCols / prevCols;
      const willUpdate =
        parentId === "" ? instances.current : findDescendants(parentId);
      for (let instance of willUpdate) {
        instance.layout.width *= ratio;
        onUpdated(instance.id);
      }
    },
    [appRef],
  );

  const use = (parentId?: string): ComponentInstance[] => {
    return useMemo(() => {
      return [
        ...(parentId !== undefined
          ? instances.current.filter((it) => it.parentId === parentId)
          : instances.current),
      ];
    }, [version, parentId]);
  };

  const useById = (id: string): ComponentInstance | null => {
    return useMemo(() => {
      return instances.current.find((it) => it.id === id) ?? null;
    }, [version, id]);
  };

  const createPro = <T = {},>(
    instance: ComponentInstance,
    extensions?: T,
  ): ComponentPro => {
    return Object.assign(
      {
        onUpdated() {
          onUpdated(instance.id);
        },
      },
      extensions ?? {},
    );
  };

  return useMemo(
    () => ({
      get definitions(): ComponentDefinition[] {
        return getDefinitions();
      },
      register,
      definitionOf,
      get version(): number {
        return version;
      },
      get instances(): ComponentInstance[] {
        return getInstances();
      },
      set instances(value: ComponentInstance[]) {
        setInstances(() => value);
      },
      add,
      updateParent,
      remove,
      onUpdated,
      onColumnsUpdated,
      findById,
      findByName,
      findDescendants,
      use,
      useById,
      createPro,
    }),
    [
      definitions,
      register,
      definitionOf,
      version,
      getInstances,
      setInstances,
      add,
      updateParent,
      remove,
      onUpdated,
      onColumnsUpdated,
      findById,
      findByName,
      findDescendants,
      use,
      useById,
      createPro,
    ],
  );
}
