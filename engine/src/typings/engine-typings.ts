import {IComponent} from "./component-typings.ts";
import {FlakeSize} from "./common-typings.ts";

export enum EngineStatus {
  Loading = "Loading",
  LoadFailed = "LoadFailed",
  Ready = "Ready",
}

export enum LayoutMode {
  Fluid = "Fluid",
  Desktop = "Desktop",
  Phone = "Phone",
  Tablet = "Tablet",
}

export type Engine = {
  readonly appId: string;
  readonly status: EngineStatus;
  readonly debugging: boolean;
  name: string;
  layoutMode: LayoutMode;
  columns: number;
  rows: number;
  readonly version: number;
  readonly component: IComponent;

  debug(...args: any[]): void;
  debugPrint(): void;
  nextID(): string;
  save(): Promise<boolean>;
  isNameOccupied(name: string): boolean;

  useViewport(): [setViewportRef: (element: HTMLElement | null) => void, viewportSize: FlakeSize];
  useCanvas(): [setCanvasRef: (element: HTMLElement | null) => void, canvasRef: HTMLElement | null];
}
