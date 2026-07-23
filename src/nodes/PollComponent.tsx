import type { NodeKey } from "lexical";
import type { JSX } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { useCallback, useId } from "react";
import * as React from "react";

import type { Option, Options, PollNode } from "./PollNode";
import { $isPollNode, createPollOption } from "./PollNode";
import Button from "../ui/Button";
import "./PollNode.css";

// Deterministic string -> number hash. Stands in for a real per-user client
// ID (there's no backend/collab session here, so votes are local-only).
function hashToClientId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return hash;
}

function getTotalVotes(options: Options): number {
  return options.reduce((total, option) => total + option.votes.length, 0);
}

function PollOptionComponent({
  option,
  index,
  options,
  totalVotes,
  withPollNode,
  clientID,
}: {
  option: Option;
  index: number;
  options: Options;
  totalVotes: number;
  clientID: number;
  withPollNode: (cb: (node: PollNode) => void) => void;
}): JSX.Element {
  const { text, votes } = option;
  const checkedIndex = votes.indexOf(clientID);
  const checked = checkedIndex !== -1;
  const votesCount = votes.length;
  const votesPercentage = totalVotes > 0 ? (votesCount / totalVotes) * 100 : 0;

  return (
    <div className="PollNode__optionContainer">
      <div
        className={
          "PollNode__optionCheckboxWrapper " +
          (checked ? "PollNode__optionCheckboxChecked" : "")
        }
      >
        <input
          className="PollNode__optionCheckbox"
          type="checkbox"
          onChange={() => {
            withPollNode((node) => {
              node.toggleVote(option, clientID);
            });
          }}
          checked={checked}
        />
      </div>
      <div className="PollNode__optionInputWrapper">
        <div
          className="PollNode__optionInputVotes"
          style={{ width: `${votesPercentage}%` }}
        />
        <span className="PollNode__optionInputVotesCount">
          {votesCount > 0 &&
            (votesCount === 1 ? "1 vote" : `${votesCount} votes`)}
        </span>
        <input
          className="PollNode__optionInput"
          type="text"
          value={text}
          onChange={(e) => {
            const target = e.target;
            const value = target.value;
            withPollNode((node) => {
              node.setOptionText(option, value);
            });
          }}
          placeholder={`Option ${index + 1}`}
        />
      </div>
      <button
        disabled={options.length < 3}
        className={
          "PollNode__optionDelete " +
          (options.length < 3 ? "PollNode__optionDeleteDisabled" : "")
        }
        aria-label="Remove option"
        title="Remove"
        onClick={() => {
          withPollNode((node) => {
            node.deleteOption(option);
          });
        }}
      />
    </div>
  );
}

export default function PollComponent({
  question,
  options,
  nodeKey,
}: {
  question: string;
  options: Options;
  nodeKey: NodeKey;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const clientID = hashToClientId(useId());
  const totalVotes = getTotalVotes(options);

  const withPollNode = useCallback(
    (cb: (node: PollNode) => void): void => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isPollNode(node)) {
          cb(node);
        }
      });
    },
    [editor, nodeKey],
  );

  const addOption = () => {
    withPollNode((node) => {
      node.addOption(createPollOption());
    });
  };

  return (
    <div className="PollNode__container">
      <div className="PollNode__inner">
        <h2 className="PollNode__heading">{question}</h2>
        {options.map((option, index) => {
          const key = option.uid;
          return (
            <PollOptionComponent
              key={key}
              option={option}
              index={index}
              options={options}
              totalVotes={totalVotes}
              clientID={clientID}
              withPollNode={withPollNode}
            />
          );
        })}
        <div className="PollNode__footer">
          <Button small onClick={addOption}>
            Add Option
          </Button>
        </div>
      </div>
    </div>
  );
}
