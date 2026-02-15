/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Options } from "./PollNode";
import type { NodeKey } from "lexical";

import * as React from "react";

// TODO: Implement PollComponent
export default function PollComponent({
  question,
  options,
  nodeKey,
}: {
  question: string;
  options: Options;
  nodeKey: NodeKey;
}): JSX.Element {
  return <div />;
}
