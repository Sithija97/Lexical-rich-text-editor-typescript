/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor, NodeKey } from "lexical";

import * as React from "react";
import type { JSX } from "react";

// TODO: Implement ImageComponent
export default function ImageComponent({
  src,
  altText,
  width,
  height,
  maxWidth,
  nodeKey: _nodeKey,
  showCaption: _showCaption,
  caption: _caption,
  captionsEnabled: _captionsEnabled,
  resizable: _resizable,
}: {
  src: string;
  altText: string;
  width: number | "inherit";
  height: number | "inherit";
  maxWidth: number;
  nodeKey: NodeKey;
  showCaption: boolean;
  caption: LexicalEditor;
  captionsEnabled: boolean;
  resizable: boolean;
}): JSX.Element {
  return (
    <img
      src={src}
      alt={altText}
      style={{
        width: width === "inherit" ? undefined : width,
        height: height === "inherit" ? undefined : height,
        maxWidth,
      }}
    />
  );
}
