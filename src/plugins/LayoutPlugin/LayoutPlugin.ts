/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createCommand, LexicalCommand } from "lexical";

export const INSERT_LAYOUT_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_LAYOUT_COMMAND",
);
