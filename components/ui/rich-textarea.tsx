"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  id?: string;
}

export function RichTextarea({
  value,
  onChange,
  placeholder,
  className,
  rows = 3,
  id,
}: RichTextareaProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const savedSelectionRef = useRef<Range | null>(null);
  const isUserTypingRef = useRef(false);
  const lastValueRef = useRef(value);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUserTypingRef.current = true;
      const html = editorRef.current.innerHTML;
      lastValueRef.current = html;
      onChange(html);
      // Reset the flag after a minimal delay to allow for external updates
      setTimeout(() => {
        isUserTypingRef.current = false;
      }, 50);
    }
  }, [onChange]);

  // Initialize editor content on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === '' && value) {
      editorRef.current.innerHTML = value;
      lastValueRef.current = value;
    }
  }, []); // Run only on mount

  // Sync value prop with editor content only when it's an external change
  useEffect(() => {
    if (editorRef.current && value !== lastValueRef.current) {
      // Skip update if user is currently typing
      if (isUserTypingRef.current) {
        return;
      }
      
      // Update content only if it's truly different
      if (editorRef.current.innerHTML !== value) {
        const wasEditorFocused = document.activeElement === editorRef.current;
        
        editorRef.current.innerHTML = value;
        lastValueRef.current = value;
        
        // Only restore focus and cursor if the editor was previously focused
        if (wasEditorFocused) {
          editorRef.current.focus();
          // Place cursor at end
          const selection = window.getSelection();
          if (selection) {
            const range = document.createRange();
            const lastChild = editorRef.current.lastChild;
            if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
              range.setStart(lastChild, lastChild.textContent?.length || 0);
            } else if (lastChild) {
              range.setStartAfter(lastChild);
            } else {
              range.setStart(editorRef.current, 0);
            }
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    }
  }, [value]);

  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (savedSelectionRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelectionRef.current);
      }
    }
  }, []);

  const executeCommand = useCallback(
    (command: string) => {
      if (!editorRef.current) return;

      // Focus the editor first
      editorRef.current.focus();

      // Restore selection if we have one saved
      if (savedSelectionRef.current) {
        restoreSelection();
      }

      const selection = window.getSelection();
      if (!selection) return;

      let range: Range;
      if (selection.rangeCount === 0) {
        // Create a range at the end of the content
        range = document.createRange();
        const lastChild = editorRef.current.lastChild;
        if (lastChild) {
          if (lastChild.nodeType === Node.TEXT_NODE) {
            range.setStart(lastChild, lastChild.textContent?.length || 0);
          } else {
            range.setStartAfter(lastChild);
          }
        } else {
          range.setStart(editorRef.current, 0);
        }
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        range = selection.getRangeAt(0);
      }

      if (!editorRef.current.contains(range.commonAncestorContainer)) return;

      let tagName: string;
      switch (command) {
        case "bold":
          tagName = "strong";
          break;
        case "italic":
          tagName = "em";
          break;
        case "underline":
          tagName = "u";
          break;
        default:
          return;
      }

      try {
        if (range.collapsed) {
          // No selection - insert formatting element and position cursor inside
          const element = document.createElement(tagName);
          element.textContent = "\u200B"; // Zero-width space as placeholder
          range.insertNode(element);

          // Position cursor inside the new element
          const newRange = document.createRange();
          newRange.setStart(element.firstChild!, 1);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          // Text is selected - check if already formatted
          const selectedText = range.toString();
          const startContainer = range.startContainer;
          const endContainer = range.endContainer;

          // Check if selection is within a formatting tag
          let formatElement: Element | null = null;
          let node =
            startContainer.nodeType === Node.TEXT_NODE
              ? startContainer.parentElement
              : (startContainer as Element);

          while (node && editorRef.current.contains(node)) {
            if (node.tagName?.toLowerCase() === tagName) {
              formatElement = node;
              break;
            }
            node = node.parentElement;
          }

          if (formatElement) {
            // Remove formatting - unwrap the element
            const parent = formatElement.parentNode!;
            while (formatElement.firstChild) {
              parent.insertBefore(formatElement.firstChild, formatElement);
            }
            parent.removeChild(formatElement);

            // Restore selection on the unwrapped text
            const newRange = document.createRange();
            const walker = document.createTreeWalker(
              editorRef.current,
              NodeFilter.SHOW_TEXT,
              null
            );

            let currentNode;
            let textLength = 0;
            let startFound = false;

            while ((currentNode = walker.nextNode())) {
              const nodeText = currentNode.textContent || "";
              if (
                !startFound &&
                textLength + nodeText.length >= range.startOffset
              ) {
                newRange.setStart(currentNode, range.startOffset - textLength);
                startFound = true;
              }
              if (
                startFound &&
                textLength + nodeText.length >= range.endOffset
              ) {
                newRange.setEnd(currentNode, range.endOffset - textLength);
                break;
              }
              textLength += nodeText.length;
            }

            selection.removeAllRanges();
            selection.addRange(newRange);
          } else {
            // Apply formatting - wrap selection
            const element = document.createElement(tagName);
            try {
              element.appendChild(range.extractContents());
              range.insertNode(element);

              // Select the formatted text
              const newRange = document.createRange();
              newRange.selectNodeContents(element);
              selection.removeAllRanges();
              selection.addRange(newRange);
            } catch (e) {
              // Fallback: just insert the element with the selected text
              element.textContent = selectedText;
              range.deleteContents();
              range.insertNode(element);

              const newRange = document.createRange();
              newRange.selectNodeContents(element);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          }
        }

        // Clear the saved selection since we've made changes
        savedSelectionRef.current = null;

        // Trigger change event
        handleInput();
      } catch (error) {
        console.error("Error executing command:", error);
      }
    },
    [handleInput, restoreSelection]
  );

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    saveSelection();
    setIsFocused(false);
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          executeCommand("bold");
          break;
        case "i":
          e.preventDefault();
          executeCommand("italic");
          break;
        case "u":
          e.preventDefault();
          executeCommand("underline");
          break;
      }
    }
  };

  return (
    <div className="border rounded-md">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("bold");
          }}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("italic");
          }}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("underline");
          }}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "min-h-[80px] w-full px-3 py-2 text-sm bg-background",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          minHeight: `${rows * 1.5}rem`,
        }}
        data-placeholder={placeholder}
        id={id}
      />
    </div>
  );
}

// Helper function to convert HTML to plain text
export function htmlToPlainText(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// Helper function to convert plain text to HTML
export function plainTextToHtml(text: string): string {
  return text.replace(/\n/g, "<br>");
}
