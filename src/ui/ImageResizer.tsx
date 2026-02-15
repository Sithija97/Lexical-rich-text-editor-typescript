/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from "lexical";

import * as React from "react";
import { MutableRefObject } from "react";

// TODO: Implement ImageResizer
export default function ImageResizer({
  buttonRef,
  showCaption,
  setShowCaption,
  imageRef,
  editor,
  onResizeStart,
  onResizeEnd,
  captionsEnabled,
}: {
  buttonRef: MutableRefObject<HTMLButtonElement | null>;
  showCaption: boolean;
  setShowCaption: () => null;
  imageRef: MutableRefObject<HTMLImageElement | null>;
  editor: LexicalEditor;
  onResizeStart: () => void;
  onResizeEnd: (
    nextWidth: number | "inherit",
    nextHeight: number | "inherit",
  ) => void;
  captionsEnabled: boolean;
}): JSX.Element {
  return <div />;
}
