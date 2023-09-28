import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppContext } from "./AppContext.tsx";
import { AppStatus, FlakeApp, FlakeSize, LayoutMode } from "../typings";
import { useFlakeAppComponent } from "./useFlakeAppComponent.tsx";
import { useFlakeApp } from "./useFlakeApp.ts";
import * as sentry from "@sentry/react";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdef", 8);

export type Props = PropsWithChildren<{
  appId: string;
}>;

const AppComponent: React.FC<Props> = ({ appId, children }) => {
  const debugging = useMemo<boolean>(
    () => window.localStorage.getItem("__debug") !== null,
    [],
  );
  const debug: (...args: any[]) => void = useCallback(
    (...args: any[]) => {
      if (debugging) {
        console.log(`Flake(${appId})`, ...args);
      }
    },
    [appId, debugging],
  );
  const appRef = useRef<FlakeApp>();
  const app = useFlakeApp(appRef);
  const component = useFlakeAppComponent(appRef);
  const [viewportSize, setViewportSize] = useState<FlakeSize>({
    width: 0,
    height: 0,
  });
  const viewport = useRef<HTMLElement | null>(null);
  const canvas = useRef<HTMLElement | null>(null);

  //
  const version = useMemo(() => {
    return [`component@${component.version}`].join(", ");
  }, [component.version]);

  //
  const debugPrint: () => void = useCallback(() => {
    console.log("[Flake: DebugPrint]");
    console.log("[Base]");
    console.log("  AppId", appId);
    console.log("  Status", app.status);
    console.log("  Name", app.name);
    console.log("[UI]");
    console.log("  ViewportSize", viewportSize);
    console.log("[Instances]");
    console.log("  Components", component.instances);
  }, [appId, app, viewportSize, component]);

  //
  const nextID: () => string = useCallback(() => {
    const exists = new Set<string>();

    for (let componentInstance of component.instances) {
      exists.add(componentInstance.id);
    }

    let next;
    do {
      next = nanoid();
    } while (exists.has(next));

    return next;
  }, [version]);

  //
  const isNameOccupied: (name: string) => boolean = useCallback(
    (name: string) => {
      return component.instances.some((it) => it.name === name);
    },
    [version],
  );

  // 视口
  useEffect(() => {
    const onWindowResize = () => {
      const viewportRef = viewport.current;
      if (
        viewportRef &&
        viewportRef instanceof HTMLElement &&
        viewportRef.offsetWidth &&
        viewportRef.offsetHeight
      ) {
        debug(
          `OnWindowResize(${viewportRef.offsetWidth}, ${viewportRef.offsetHeight})`,
        );
        setViewportSize((prevViewportSize) => {
          if (
            prevViewportSize.width == viewportRef.offsetWidth &&
            prevViewportSize.height == viewportRef.offsetHeight
          ) {
            return prevViewportSize;
          } else {
            return {
              width: viewportRef.offsetWidth,
              height: viewportRef.offsetHeight,
            };
          }
        });
      }
    };
    window.addEventListener("resize", onWindowResize);
    onWindowResize();
    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  // 加载数据
  useEffect(() => {
    // TODO: 监听 app 会造成重复调用，需要消除重复调用
    app.load().catch((e) => {
      // TODO: use logger
      console.error(e);
      sentry.captureException(e);
    });
  }, [app]);

  // 设置引用
  appRef.current = useMemo<FlakeApp>(
    () => ({
      get appId(): string {
        return appId;
      },
      get status(): AppStatus {
        return app.status;
      },
      get debugging(): boolean {
        return debugging;
      },
      get name(): string {
        return app.name;
      },
      set name(value: string) {
        debug("SetName", value);
        app.setName(value);
      },
      get layoutMode(): LayoutMode {
        return app.layoutMode;
      },
      set layoutMode(value: LayoutMode) {
        debug("SetLayoutMode", value);
        app.setLayoutMode(value);
      },
      get columns(): number {
        return app.columns;
      },
      set columns(value: number) {
        debug("setColumns", value);
        app.setColumns(value);
      },
      get rows(): number {
        return app.rows;
      },
      set rows(value: number) {
        debug("setRows", value);
        app.setRows(value);
      },
      get version(): string {
        return version;
      },
      component,

      debug,
      debugPrint,
      nextID,
      isNameOccupied,
      save: app.save,
      useViewport(): [
        HTMLElement | null,
        (element: HTMLElement | null) => void,
        FlakeSize,
      ] {
        return [
          viewport.current,
          (element) => (viewport.current = element),
          viewportSize,
        ];
      },
      useCanvas(): [HTMLElement | null, (element: HTMLElement | null) => void] {
        return [canvas.current, (element) => (canvas.current = element)];
      },
    }),
    [
      appId,
      app,
      debugging,
      component,
      debug,
      debugPrint,
      nextID,
      isNameOccupied,
      viewportSize,
      viewport,
      canvas,
    ],
  );

  // 渲染
  return (
    <AppContext.Provider value={appRef.current}>{children}</AppContext.Provider>
  );
};

export default AppComponent;
