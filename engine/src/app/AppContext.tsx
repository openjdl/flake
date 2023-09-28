import { Context, createContext, useContext } from "react";
import { FlakeApp } from "../typings";

export const AppContext: Context<FlakeApp | null> =
  createContext<FlakeApp | null>(null);

export function useApp(): FlakeApp {
  return useContext(AppContext) as FlakeApp;
}
