import React from "react";
import { FlakeRect, FlakeSize, Properties } from "./common-typings.ts";
import { FlakeApp } from "./app-typings.ts";

export type ComponentDefinition = {
  type: string;
  name: string;
  icon?(props: Record<string, any>): React.ReactNode;
  minSize: FlakeSize;
  runtime(): React.ReactNode;
  offCanvas?: boolean;
};

export type ComponentPro = {
  onUpdated(): void;
};

export type ComponentInstance = {
  id: string;
  version: number;
  name: string;
  parentId: string;
  layout: FlakeRect;
  brief: string;
  definition: ComponentDefinition;
  properties: Properties;
  pro?: ComponentPro;
};

export type IComponent = {
  readonly version: number;

  // definitions

  readonly definitions: ComponentDefinition[];
  register(definition: ComponentDefinition): void;
  definitionOf(type: string): ComponentDefinition;

  // instances

  instances: ComponentInstance[];

  findById(id: string): ComponentInstance | null;
  findByName(name: string): ComponentInstance | null;
  findDescendants(id: string): ComponentInstance[];
  add(instance: ComponentInstance): void;
  updateParent(id: string, parentId: string): void;
  remove(id: string): void;

  onUpdated(id: string): void;
  onColumnsUpdated(parentId: string, prev: number, next: number): void;

  use(parentId?: string): ComponentInstance[];
  useById(id: string): ComponentInstance | null;

  createPro<T = {}>(instance: ComponentInstance, extensions?: T): ComponentPro;
};

export type ComponentRenderProps = {
  engine: FlakeApp;
  instance: ComponentInstance;
  size: FlakeSize;
};
