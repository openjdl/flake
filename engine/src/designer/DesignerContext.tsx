import { Context, createContext, useContext } from "react";
import { FlakeDesigner } from "../typings";

export const DesignerContext: Context<FlakeDesigner | null> =
  createContext<FlakeDesigner | null>(null);

export function useDesigner(): FlakeDesigner {
  return useContext(DesignerContext) as FlakeDesigner;
}

export function useDesignerNullable(): FlakeDesigner | null {
  return useContext(DesignerContext) ?? null;
}
