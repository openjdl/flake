import React from "react";
import {FlakeRect, FlakeSize, Properties} from "./common-typings.ts";
import {Engine} from "./engine-typings.ts";

export type ComponentDefinition = {
  type: string;
  name: string;
  icon?(props: Record<string, any>): React.ReactNode;
  minSize: FlakeSize;
  runtime(): React.ReactNode;
  offCanvas?: boolean;
}

export type ComponentPro = {
  update(): void;
}

export type ComponentInstance = {
  readonly id: string;
  readonly version: number;
  readonly name: number;
  readonly parentId: string;
  readonly layout: FlakeRect;
  readonly brief: string;
  readonly definition: ComponentDefinition;
  readonly properties: Properties;
  readonly pro?: ComponentPro;
}

export type IComponent = {
  readonly version: number;
  instances: [];

  findById(id: string): ComponentInstance | null;
  findByName(name: string): ComponentInstance | null;
  findDescendants(id: string): ComponentInstance[];
  add(instance: ComponentInstance): void;
  update(id: string): void;
  updateParent(id: string, parentId: string): void;
  remove(id: string): void;

  onColumnsUpdated(parentId: string, prev: number, next: number): void;

  use(parentId?: string): ComponentInstance[];
  useById(id: string): ComponentInstance | null;

  createPro<T = {}>(instance: ComponentInstance, extensions?: T): ComponentPro;
}

export type ComponentRenderProps = {
  engine: Engine;
  instance: ComponentInstance;
  size: FlakeSize;
}
