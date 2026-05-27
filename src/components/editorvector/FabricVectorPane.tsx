"use client";

import dynamic from "next/dynamic";

// Lazy-load fabric only on the client to avoid SSR access to `window`/`document`.
export const FabricVectorPane = dynamic(
  () => import("./FabricVectorPaneImpl").then((m) => m.FabricVectorPaneImpl),
  { ssr: false }
);

export type { FabricVectorPaneImplProps as FabricVectorPaneProps } from "./FabricVectorPaneImpl";
