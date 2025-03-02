import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/toolBarPlugin.tsx";
import theme from "./editorTheme.tsx";

import CustomOnChangePlugin from "./plugins/customOnChangePlugin.tsx";
import { DataProps } from "@/schemas/types.tsx";
function onError(error: Error): void {
  console.error(error);
}
/**
 * EditorPane Component
 *
 * This component provides a rich text editor using Lexical.
 * - `value`: The initial content of the editor.
 * - `onChange`: Callback function to handle content changes.
 * - Uses plugins for history tracking, autofocus, and toolbar functionality.
 * - Includes a custom theme and error handling.
 */

const EditorPane = ({ value, onChange }: DataProps) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="h-auto outline-none py-3 px-6" />
        }
        placeholder={
          <div className="absolute top-14 left-6 select-none pointer-events-none text-gray-400">
            Write notes here
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <CustomOnChangePlugin value={value} onChange={onChange} />

      <HistoryPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
};

export default EditorPane;
