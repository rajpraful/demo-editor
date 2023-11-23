import React, { useState, useRef } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import { toast } from "react-toastify";
import "draft-js/dist/Draft.css";

const CustomEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });
  const editorRef = useRef(null);

  const handleSave = () => {
    if (editorState) {
      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      localStorage.setItem("editorContent", JSON.stringify(rawContentState));
      toast.success("Saved successfully");
    }
  };

  const handleBeforeInput = (char) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const text = currentBlock.getText();

    // for header
    if (char === " " && text.trim() === "#") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 1,
          focusOffset: selection.getFocusOffset(),
        }),
        ""
      );

      setEditorState(
        RichUtils.toggleBlockType(
          EditorState.push(editorState, newContentState, "remove-range"),
          "header-one"
        )
      );
      return "handled";
    } else if (char === " " && text.trim()[text.length - 1] === "#") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 1,
          focusOffset: selection.getStartOffset(),
        }),
        ""
      );

      const updatedEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      const contentStateWithSplitBlock = Modifier.splitBlock(
        newContentState,
        selection
      );

      const finalEditorState = EditorState.push(
        updatedEditorState,
        contentStateWithSplitBlock,
        "split-block"
      );

      setEditorState(RichUtils.toggleBlockType(finalEditorState, "unstyled"));
      return "handled";
    }
    // for underline
    if (char === " " && text.trim() === "***") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 3,
          focusOffset: selection.getFocusOffset(),
        }),
        ""
      );

      setEditorState(
        RichUtils.handleKeyCommand(
          EditorState.push(editorState, newContentState, "remove-range"),
          "underline"
        )
      );
      return "handled";
    } else if (char === " " && text.trim().endsWith("***")) {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 3,
          focusOffset: selection.getStartOffset(),
        }),
        ""
      );
      setEditorState(
        RichUtils.handleKeyCommand(
          EditorState.push(editorState, newContentState, "remove-range"),
          "underline"
        )
      );
      return "handled";
    }

    // for redline
    if (char === " " && text.trim() === "**") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 2,
          focusOffset: selection.getFocusOffset(),
        }),
        ""
      );

      setEditorState(
        RichUtils.toggleInlineStyle(
          EditorState.push(editorState, newContentState, "remove-range"),
          "redline"
        )
      );
      return "handled";
    } else if (char === " " && text.trim().endsWith("**")) {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 2,
          focusOffset: selection.getStartOffset(),
        }),
        ""
      );

      setEditorState(
        RichUtils.toggleInlineStyle(
          EditorState.push(editorState, newContentState, "remove-range"),
          "redline"
        )
      );
      return "handled";
    }

    //for bold
    if (char === " " && text.trim() === "*") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 1,
          focusOffset: selection.getFocusOffset(),
        }),
        ""
      );

      setEditorState(
        RichUtils.handleKeyCommand(
          EditorState.push(editorState, newContentState, "remove-range"),
          "bold"
        )
      );
      return "handled";
    } else if (char === " " && text.trim()[text.length - 1] === "*") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 1,
          focusOffset: selection.getStartOffset(),
        }),
        ""
      );
      setEditorState(
        RichUtils.handleKeyCommand(
          EditorState.push(editorState, newContentState, "remove-range"),
          "bold"
        )
      );
      return "handled";
    }

    // for code block
    if (char === " " && text.trim() === "```") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 3,
          focusOffset: selection.getFocusOffset(),
        }),
        ""
      );

      setEditorState(
        RichUtils.toggleInlineStyle(
          EditorState.push(editorState, newContentState, "remove-range"),
          "code"
        )
      );
      return "handled";
    } else if (char === " " && text.trim().endsWith("```")) {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 3,
          focusOffset: selection.getStartOffset(),
        }),
        ""
      );
      setEditorState(
        RichUtils.toggleInlineStyle(
          EditorState.push(editorState, newContentState, "remove-range"),
          "code"
        )
      );
      return "handled";
    }

    // Continue with default handling for other cases
    return "not-handled";
  };

  const styleMap = {
    redline: {
      color: "red",
    },
    code: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
  };

  return (
    <div>
      <div className="header">
        <div className="content">
          <h1>Demo editor by Praful Raj</h1>
          <p>Start editing to see some magic happen!</p>
        </div>
        <button onClick={() => handleSave()}>Save</button>
      </div>
      <div className="customEditor">
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
};

export default CustomEditor;
