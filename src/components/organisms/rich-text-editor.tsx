import { EditorProvider, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { Markdown } from 'tiptap-markdown';

const extensions = [
  StarterKit,
  Markdown,
]

export function RichTextEditor({editable, content}:{editable: boolean, content?: string}) {
  return <EditorProvider editable={editable} extensions={extensions} content={content}>
    <FloatingMenu>This is the floating menu</FloatingMenu>
    <BubbleMenu>This is the bubble menu</BubbleMenu>
  </EditorProvider>
}