declare module "@excalidraw/excalidraw" {
  import * as React from "react";
  import type {
    AppState,
    BinaryFiles,
  } from "@excalidraw/excalidraw/types/types";

  export interface ExcalidrawProps {
    onChange?: (
      elements: readonly ExcalidrawElement[],
      appState: AppState,
      files: BinaryFiles,
    ) => void;
    excalidrawAPI?: (api: ExcalidrawImperativeAPI) => void;
    initialData?: {
      elements?: readonly ExcalidrawElement[];
      appState?: Partial<AppState>;
      files?: BinaryFiles;
    };
    [key: string]: unknown;
  }

  export interface ExcalidrawElement {
    isDeleted?: boolean;
    [key: string]: unknown;
  }

  export interface ExcalidrawImperativeAPI {
    getAppState: () => AppState;
    [key: string]: unknown;
  }

  export const Excalidraw: React.FC<ExcalidrawProps>;

  export function exportToSvg(opts: {
    elements: readonly ExcalidrawElement[];
    appState?: Partial<AppState>;
    files?: BinaryFiles;
    [key: string]: unknown;
  }): Promise<SVGSVGElement>;
}

declare module "@excalidraw/excalidraw/types/types" {
  export interface AppState {
    exportBackground?: boolean;
    exportScale?: number;
    exportWithDarkMode?: boolean;
    isBindingEnabled?: boolean;
    isLoading?: boolean;
    name?: string;
    theme?: string;
    viewBackgroundColor?: string;
    viewModeEnabled?: boolean;
    zenModeEnabled?: boolean;
    zoom?: unknown;
    [key: string]: unknown;
  }

  export interface BinaryFiles {
    [key: string]: unknown;
  }

  export interface ExcalidrawImperativeAPI {
    getAppState: () => AppState;
    [key: string]: unknown;
  }

  export interface ExcalidrawInitialDataState {
    elements?: readonly import("@excalidraw/excalidraw").ExcalidrawElement[];
    appState?: Partial<AppState>;
    files?: BinaryFiles;
  }
}

declare module "@excalidraw/excalidraw/types/element/types" {
  export interface ExcalidrawElement {
    isDeleted?: boolean;
    [key: string]: unknown;
  }

  export type NonDeleted<T> = T & { isDeleted?: false };

  export interface NonDeletedExcalidrawElement extends ExcalidrawElement {
    isDeleted?: false;
  }
}
