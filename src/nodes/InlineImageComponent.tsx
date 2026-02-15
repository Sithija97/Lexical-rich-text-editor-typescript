/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor, NodeKey } from "lexical";
import type { Position } from "./InlineImageNode";

import * as React from "react";

// TODO: Implement InlineImageComponent
export default function InlineImageComponent({
  src,
  altText,
  width,
  height,
  nodeKey,
  showCaption,
  caption,
  position,
}: {
  src: string;
  altText: string;
  width: number | "inherit";
  height: number | "inherit";
  nodeKey: NodeKey;
  showCaption: boolean;
  caption: LexicalEditor;
  position: Position;
}): JSX.Element {
  return (
    <img
      src={src}
      alt={altText}
      style={{
        width: width === "inherit" ? undefined : width,
        height: height === "inherit" ? undefined : height,
      }}
    />
  );
}
