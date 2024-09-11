"use client";
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import Quill from 'quill';

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

interface ChatInputProps {
  placeholder: string
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  
  const editorRef = useRef<Quill | null>(null);

  return (
    <div className='px-5 w-full'>
        <Editor innerRef={editorRef} disabled={false} onSubmit={() => {}} variant='create' placeholder={placeholder} />
    </div>
  )
}

export default ChatInput;