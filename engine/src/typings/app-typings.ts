import { IComponent } from "./component-typings.ts";
import { FlakeSize } from "./common-typings.ts";

export enum AppStatus {
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

export type FlakeApp = {
  readonly appId: string;
  readonly status: AppStatus;
  readonly debugging: boolean;
  name: string;
  layoutMode: LayoutMode;
  columns: number;
  rows: number;
  readonly version: string;
  readonly component: IComponent;

  debug(...args: any[]): void;
  debugPrint(): void;
  nextID(): string;
  isNameOccupied(name: string): boolean;
  save(): Promise<boolean>;

  useViewport(): [
    viewporRef: HTMLElement | null,
    setViewportRef: (element: HTMLElement | null) => void,
    viewportSize: FlakeSize,
  ];
  useCanvas(): [
    canvasRef: HTMLElement | null,
    setCanvasRef: (element: HTMLElement | null) => void,
  ];
};
