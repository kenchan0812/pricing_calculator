import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  faBold,
  faStrikethrough,
  faItalic,
  faUnderline,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faRotateLeft,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LowPriority = 1;

function Divider() {
  return <div className="w-[1px] bg-[#eee] mx-1" />;
}

/**
 * ToolbarPlugin Component
 *
 * This component provides a toolbar for the Lexical rich text editor.
 * - Includes undo/redo functionality.
 * - Supports text formatting options: bold, italic, underline, and strikethrough.
 * - Provides text alignment options: left, center, right, and justify.
 * - Uses FontAwesome icons for a visually intuitive interface.
 * - Updates button states based on the current text selection.
 */

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <div
      className="flex mb-1 bg-muted/100 p-1 rounded-tl-xl rounded-tr-xl sticky top-0 z-10"
      ref={toolbarRef}
    >
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="flex border-0 bg-none rounded-xl p-2 cursor-pointer align-middle space-x-0.5 disabled:opacity-20"
        aria-label="Undo"
      >
        <FontAwesomeIcon icon={faRotateLeft} className=" w-3.5 h-3.5" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="flex border-0 bg-none rounded-xl p-2 cursor-pointer align-middle space-x-0.5 disabled:opacity-20"
        aria-label="Redo"
      >
        <FontAwesomeIcon icon={faRotateRight} className=" w-3.5 h-3.5" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={
          "flex border-0 bg-none rounded-xl p-2 cursor-pointer align-middle space-x-0.5 " +
          (isBold ? "bg-blue-100/30 opacity-100" : "opacity-60")
        }
        aria-label="Format Bold"
      >
        <FontAwesomeIcon icon={faBold} className=" w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={
          "flex border-0 bg-none rounded-xl p-2 cursor-pointer align-middle space-x-0.5 " +
          (isItalic ? "bg-blue-100/30 opacity-100" : "opacity-60")
        }
        aria-label="Format Italics"
      >
        <FontAwesomeIcon icon={faItalic} className=" w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={
          "flex border-0 bg-none rounded-xl p-2 cursor-pointer align-middle space-x-0.5 " +
          (isUnderline ? "bg-blue-100/30 opacity-100" : "opacity-60")
        }
        aria-label="Format Underline"
      >
        <FontAwesomeIcon icon={faUnderline} className=" w-3.5 h-3.5" />{" "}
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={
          "flex border-0 bg-none rounded-xl p-2 cursor-pointer align-middle space-x-0.5 " +
          (isStrikethrough ? "bg-blue-100/30 opacity-100" : "opacity-60")
        }
        aria-label="Format Strikethrough"
      >
        <FontAwesomeIcon icon={faStrikethrough} className=" w-3.5 h-3.5" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="flex border-0 bg-none rounded-xl p-2 cursor-pointer align-middle space-x-0.5 opacity-60"
        aria-label="Left Align"
      >
        <FontAwesomeIcon icon={faAlignLeft} className=" w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="flex border-0 bg-none rounded-xl p-2 cursor-pointer align-middle space-x-0.5 opacity-60"
        aria-label="Center Align"
      >
        <FontAwesomeIcon icon={faAlignCenter} className=" w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="flex border-0 bg-none rounded-xl p-2 cursor-pointer align-middle space-x-0.5 opacity-60"
        aria-label="Right Align"
      >
        <FontAwesomeIcon icon={faAlignRight} className=" w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="flex border-0 bg-none rounded-xl p-2 cursor-pointer align-middle opacity-60"
        aria-label="Justify Align"
      >
        <FontAwesomeIcon icon={faAlignJustify} className=" w-3.5 h-3.5" />
      </button>
    </div>
  );
}
