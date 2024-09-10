"use client";
import React, { MutableRefObject, useEffect, useLayoutEffect, useRef } from 'react'
import Quill, { type QuillOptions } from "quill";

import "quill/dist/quill.snow.css"
import { Button } from './ui/button';
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile } from 'lucide-react';
import { MdSend } from "react-icons/md";
import Hint from './hint';
import { Delta, Op } from 'quill/core';

type EditorValue = { 
    image: File | null;
    body: string;
}

interface EditorProps {
    onSubmit: ({ image, body }: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>
    variant ?: "create" | "update";
}

const Editor = ({ variant = "create", onSubmit, defaultValue = [], disabled = false, innerRef, onCancel, placeholder = "Write Something..." }: EditorProps) => {
    
    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const disabledRef = useRef(disabled);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    })

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        const editorContainer = container.appendChild((container.ownerDocument.createElement("div")));

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current
        }

        const quill = new Quill(editorContainer, options);

        return () => {
            if (container) {
                container.innerHTML = "";
            }
        }

    }, [])

  return (
    <div className='flex flex-col'>
        <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
            <div ref={containerRef} className='h-full ql-custom' />
            <div className='flex px-2 pb-2 z-[5]'>
                <Hint label='Hide formatting'>
                    <Button disabled={false} size="iconSm" variant="ghost" onClick={() => {}}>
                    <PiTextAa className='size-4' />
                </Button>
                </Hint>

                <Hint label='Emoji'>
                    <Button disabled={false} size="iconSm" variant="ghost" onClick={() => {}}>
                    <Smile className='size-4' />
                    </Button>
                </Hint>

                {variant === "create" && (<>
                <Hint label='Image'>
                    <Button disabled={false} size="iconSm" variant="ghost" onClick={() => {}}>
                        <ImageIcon className='size-4' />
                    </Button>
                </Hint></>)}

                {variant === "update" && (
                    <div className="flex items-center ml-auto gap-x-2">
                        <Button variant="outline" size="sm" onClick={() => {}} disabled={false} >Cancel</Button>
                        <Button className='bg-[#007a5a] hover:bg-[#007a5a]/80 text-white' size="sm" onClick={() => {}} disabled={false} >Save</Button>
                    </div>
                )}
                {variant === "create" && (
                <>
                    <Button className='ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white' disabled={false} size="iconSm" onClick={() => {}}>
                        <MdSend className='size-4' />
                    </Button>
                </>)}
            </div>
        </div>

        <div className='p-2 text-[10px] text-muted-foreground flex justify-end'>
            <p>
                <strong>Shift + Return</strong> to add a new line
            </p>
        </div>

    </div>
  )
}

export default Editor;