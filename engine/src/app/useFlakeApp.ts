import { MutableRefObject, useCallback, useMemo, useState } from "react";
import {
  AppStatus,
  ComponentInstance,
  FlakeApp,
  LayoutMode,
  Maybe,
  Properties,
} from "../typings";
import { Constants } from "./Constants.ts";
import * as sentry from "@sentry/react";

export function useFlakeApp(appRef: MutableRefObject<FlakeApp | undefined>) {
  const [status, setStatus] = useState<AppStatus>(AppStatus.Loading);
  const [name, setName] = useState<string>("");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(LayoutMode.Fluid);
  const [columns, setColumns] = useState<number>(Constants.column.initial);
  const [rows, setRows] = useState<number>(Constants.row.initial);

  //
  const load = useCallback(async (): Promise<void> => {
    const app = appRef.current;
    const appId = app?.appId;

    if (!app || !appId) {
      return;
    }

    // TODO: 改成通过 api
    try {
      const json = localStorage.getItem(`app.${appId}`);
      const remote = parseRemoteApp(appId, json);

      setStatus(AppStatus.Ready);
      setName(remote.name);
      setLayoutMode(remote.layoutMode);
      setColumns(remote.columns);
      setRows(remote.rows);

      app.component.instances = remote.components.map((it) => {
        return {
          id: it.id,
          version: 1,
          name: it.name,
          parentId: it.parentId,
          layout: { x: it.x, y: it.y, width: it.width, height: it.height },
          get brief(): string {
            return `Component(${this.id}, ${this.name})`;
          },
          definition: app.component.definitionOf(it.type),
          properties: it.properties ?? {},
          pro: undefined,
        } as ComponentInstance;
      });
    } catch (e) {
      // TODO: use logger
      console.error(e);
      sentry.captureException(e);
      setStatus(AppStatus.LoadFailed);
    }
  }, [appRef]);

  //
  const save = useCallback(async (): Promise<boolean> => {
    const app = appRef.current;
    const appId = app?.appId;

    if (!app || !appId) {
      return false;
    }

    // TODO: 改成通过 api
    try {
      const next: RemoteApp = {
        version: 1,
        name,
        layoutMode,
        columns,
        rows,
        components: app.component.instances.map((it) => ({
          id: it.id,
          type: it.definition.type,
          name: it.name,
          parentId: it.parentId,
          x: it.layout.x,
          y: it.layout.y,
          width: it.layout.width,
          height: it.layout.height,
          properties: it.properties,
        })),
      };

      const json = JSON.stringify(next);

      localStorage.setItem(`app.${appId}`, json);

      return true;
    } catch (e) {
      // TODO: use logger
      console.error(e);
      return false;
    }
  }, [appRef]);

  return useMemo(
    () => ({
      status,
      name,
      layoutMode,
      columns,
      rows,
      load,
      save,
      setName,
      setLayoutMode,
      setColumns,
      setRows,
    }),
    [status, name, layoutMode, columns, rows, load, save],
  );
}

type RemoteComponent = {
  id: string;
  type: string;
  name: string;
  parentId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Properties;
};

type RemoteApp = {
  version: number;
  name: string;
  layoutMode: LayoutMode;
  columns: number;
  rows: number;
  components: RemoteComponent[];
};

function parseRemoteApp(appId: string, json: Maybe<string>): RemoteApp {
  if (json) {
    const parsed: RemoteApp = JSON.parse(json.trim());

    if (parsed.version === 1) {
      return {
        version: 1,
        name: parsed.name ?? `App(${appId})`,
        layoutMode: parsed.layoutMode ?? LayoutMode.Fluid,
        columns: parsed.columns ?? Constants.column.initial,
        rows: parsed.rows ?? Constants.row.initial,
        components: parsed.components ?? [],
      };
    }
  }

  return {
    version: 1,
    name: `App(${appId})`,
    layoutMode: LayoutMode.Fluid,
    columns: Constants.column.initial,
    rows: Constants.row.initial,
    components: [],
  };
}
