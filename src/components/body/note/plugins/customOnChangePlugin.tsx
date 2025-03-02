import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useEffect, useState } from "react";
import { $getRoot, $insertNodes } from "lexical";
import { useSelectionStore } from "@/store/store";

interface CustomOnChangePluginProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * CustomOnChangePlugin Component
 *
 * CustomOnChangePlugin synchronizes the editor's content with an external state.
 * It initializes the editor with an HTML string and updates the state whenever the content changes.
 * - Uses Lexical's OnChangePlugin to track editor changes.
 * - Converts HTML to Lexical nodes and vice versa for state management.
 * - Ensures that the editor initializes correctly with the given value on first render.
 */

const CustomOnChangePlugin = ({
  value,
  onChange,
}: CustomOnChangePluginProps) => {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const setSelectedCalculatorNote = useSelectionStore(
    (state) => state.setSelectedCalculatorNote
  );

  useEffect(() => {
    if (!isFirstRender) return;

    setIsFirstRender(false);

    if (value === "") {
      editor.update(() => {
        $getRoot().clear();
      });
      setSelectedCalculatorNote("");
    } else if (value) {
      editor.update(() => {
        const currentHTML = $generateHtmlFromNodes(editor);
        if (currentHTML !== value) {
          $getRoot().clear();
          const parser = new DOMParser();
          const dom = parser.parseFromString(value, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);
          $insertNodes(nodes);
        }
      });
      setSelectedCalculatorNote(value);
    }
  }, [editor, value, isFirstRender, setSelectedCalculatorNote]);

  useEffect(() => {
    setIsFirstRender(true);
  }, [value]);

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const htmlValue = $generateHtmlFromNodes(editor);
          onChange(htmlValue);
          setSelectedCalculatorNote(htmlValue);
        });
      }}
    />
  );
};

export default CustomOnChangePlugin;
