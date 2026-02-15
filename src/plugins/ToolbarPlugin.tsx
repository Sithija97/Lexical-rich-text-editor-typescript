import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  NodeKey,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
  $setBlocksType,
} from "@lexical/selection";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import DropDown, { DropDownItem } from "../ui/DropDown";
import { getSelectedNode } from "../utils/getSelectedNode";
import { sanitizeUrl } from "../utils/url";

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

const CODE_LANGUAGE_OPTIONS: [string, string][] = Object.entries(
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
);

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ["Arial", "Arial"],
  ["Courier New", "Courier New"],
  ["Georgia", "Georgia"],
  ["Times New Roman", "Times New Roman"],
  ["Trebuchet MS", "Trebuchet MS"],
  ["Verdana", "Verdana"],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ["10px", "10px"],
  ["11px", "11px"],
  ["12px", "12px"],
  ["13px", "13px"],
  ["14px", "14px"],
  ["15px", "15px"],
  ["16px", "16px"],
  ["17px", "17px"],
  ["18px", "18px"],
  ["19px", "19px"],
  ["20px", "20px"],
];

function dropDownActiveClass(active: boolean) {
  return active ? "active dropdown-item-active" : "";
}

function BlockFormatDropDown({
  editor,
  blockType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        let selection = $getSelection();

        if ($isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item block-controls"
      buttonIconClassName={"icon block-type " + blockType}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style"
    >
      <DropDownItem
        className={"item " + dropDownActiveClass(blockType === "paragraph")}
        onClick={formatParagraph}
      >
        <i className="icon paragraph" />
        <span className="text">Normal</span>
      </DropDownItem>
      <DropDownItem
        className={"item " + dropDownActiveClass(blockType === "h1")}
        onClick={() => formatHeading("h1")}
      >
        <i className="icon h1" />
        <span className="text">Heading 1</span>
      </DropDownItem>
      <DropDownItem
        className={"item " + dropDownActiveClass(blockType === "h2")}
        onClick={() => formatHeading("h2")}
      >
        <i className="icon h2" />
        <span className="text">Heading 2</span>
      </DropDownItem>
      <DropDownItem
        className={"item " + dropDownActiveClass(blockType === "h3")}
        onClick={() => formatHeading("h3")}
      >
        <i className="icon h3" />
        <span className="text">Heading 3</span>
      </DropDownItem>
      <DropDownItem
        className={"item " + dropDownActiveClass(blockType === "bullet")}
        onClick={formatBulletList}
      >
        <i className="icon bullet-list" />
        <span className="text">Bullet List</span>
      </DropDownItem>
      <DropDownItem
        className={"item " + dropDownActiveClass(blockType === "number")}
        onClick={formatNumberedList}
      >
        <i className="icon numbered-list" />
        <span className="text">Numbered List</span>
      </DropDownItem>
      <DropDownItem
        className={"item " + dropDownActiveClass(blockType === "check")}
        onClick={formatCheckList}
      >
        <i className="icon check-list" />
        <span className="text">Check List</span>
      </DropDownItem>
      <DropDownItem
        className={"item " + dropDownActiveClass(blockType === "quote")}
        onClick={formatQuote}
      >
        <i className="icon quote" />
        <span className="text">Quote</span>
      </DropDownItem>
      <DropDownItem
        className={"item " + dropDownActiveClass(blockType === "code")}
        onClick={formatCode}
      >
        <i className="icon code" />
        <span className="text">Code Block</span>
      </DropDownItem>
    </DropDown>
  );
}

function Divider(): JSX.Element {
  return <div className="divider" />;
}

function FontDropDown({
  editor,
  value,
  style,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}): JSX.Element {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style],
  );

  const buttonAriaLabel =
    style === "font-family"
      ? "Formatting options for font family"
      : "Formatting options for font size";

  return (
    <DropDown
      disabled={disabled}
      buttonClassName={"toolbar-item " + style}
      buttonLabel={value}
      buttonIconClassName={
        style === "font-family" ? "icon block-type font-family" : ""
      }
      buttonAriaLabel={buttonAriaLabel}
    >
      {(style === "font-family" ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
        ([option, text]) => (
          <DropDownItem
            className={`item ${dropDownActiveClass(value === option)} ${
              style === "font-size" ? "fontsize-item" : ""
            }`}
            onClick={() => handleClick(option)}
            key={option}
          >
            <span className="text">{text}</span>
          </DropDownItem>
        ),
      )}
    </DropDown>
  );
}

const IS_APPLE =
  typeof navigator !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const ALIGNMENT_OPTIONS: {
  value: "left" | "center" | "right" | "justify";
  icon: string;
  label: string;
}[] = [
  { value: "left", icon: "left-align", label: "Left Align" },
  { value: "center", icon: "center-align", label: "Center Align" },
  { value: "right", icon: "right-align", label: "Right Align" },
  { value: "justify", icon: "justify-align", label: "Justify Align" },
];

function ToolbarButton({
  disabled,
  onClick,
  isActive,
  title,
  ariaLabel,
  iconClass,
}: {
  disabled: boolean;
  onClick: () => void;
  isActive: boolean;
  title: string;
  ariaLabel: string;
  iconClass: string;
}): JSX.Element {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={"toolbar-item spaced " + (isActive ? "active" : "")}
      title={title}
      type="button"
      aria-label={ariaLabel}
    >
      <i className={"format " + iconClass} />
    </button>
  );
}

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );
  const [fontSize, setFontSize] = useState<string>("15px");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("");
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsCode(selection.hasFormat("code"));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : "",
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, "font-size", "15px"),
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, "font-family", "Arial"),
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [activeEditor, editor, updateToolbar]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className="toolbar">
      <button
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? "Undo (⌘Z)" : "Undo (Ctrl+Z)"}
        type="button"
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? "Redo (⌘Y)" : "Redo (Ctrl+Y)"}
        type="button"
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <>
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={blockType}
            editor={editor}
          />
          <Divider />
        </>
      )}
      {blockType === "code" ? (
        <>
          <DropDown
            disabled={!isEditable}
            buttonClassName="toolbar-item code-language"
            buttonLabel={getLanguageFriendlyName(codeLanguage)}
            buttonAriaLabel="Select language"
          >
            {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
              return (
                <DropDownItem
                  className={`item ${dropDownActiveClass(
                    value === codeLanguage,
                  )}`}
                  onClick={() => onCodeLanguageSelect(value)}
                  key={value}
                >
                  <span className="text">{name}</span>
                </DropDownItem>
              );
            })}
          </DropDown>
        </>
      ) : (
        <>
          <FontDropDown
            disabled={!isEditable}
            style={"font-family"}
            value={fontFamily}
            editor={editor}
          />
          <FontDropDown
            disabled={!isEditable}
            style={"font-size"}
            value={fontSize}
            editor={editor}
          />
          <ToolbarButton
            disabled={!isEditable}
            onClick={() =>
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
            }
            isActive={isBold}
            title={IS_APPLE ? "Bold (⌘B)" : "Bold (Ctrl+B)"}
            ariaLabel={`Format text as bold. Shortcut: ${IS_APPLE ? "⌘B" : "Ctrl+B"}`}
            iconClass="bold"
          />
          <ToolbarButton
            disabled={!isEditable}
            onClick={() =>
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            }
            isActive={isItalic}
            title={IS_APPLE ? "Italic (⌘I)" : "Italic (Ctrl+I)"}
            ariaLabel={`Format text as italics. Shortcut: ${IS_APPLE ? "⌘I" : "Ctrl+I"}`}
            iconClass="italic"
          />
          <ToolbarButton
            disabled={!isEditable}
            onClick={() =>
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            }
            isActive={isUnderline}
            title={IS_APPLE ? "Underline (⌘U)" : "Underline (Ctrl+U)"}
            ariaLabel={`Format text to underlined. Shortcut: ${IS_APPLE ? "⌘U" : "Ctrl+U"}`}
            iconClass="underline"
          />
          <ToolbarButton
            disabled={!isEditable}
            onClick={() =>
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")
            }
            isActive={isCode}
            title="Insert code block"
            ariaLabel="Insert code block"
            iconClass="code"
          />
          <ToolbarButton
            disabled={!isEditable}
            onClick={insertLink}
            isActive={isLink}
            title="Insert link"
            ariaLabel="Insert link"
            iconClass="link"
          />
          <Divider />
          <DropDown
            disabled={!isEditable}
            buttonLabel="Align"
            buttonIconClassName="icon left-align"
            buttonClassName="toolbar-item spaced alignment"
            buttonAriaLabel="Formatting options for text alignment"
          >
            {ALIGNMENT_OPTIONS.map(({ value, icon, label }) => (
              <DropDownItem
                key={value}
                onClick={() =>
                  activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value)
                }
                className="item"
              >
                <i className={"icon " + icon} />
                <span className="text">{label}</span>
              </DropDownItem>
            ))}
            <Divider />
          </DropDown>
        </>
      )}
    </div>
  );
}
