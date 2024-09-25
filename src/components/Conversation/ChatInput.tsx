"use client";
import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

interface ChatInputProps {
  placeholder: string,
  conversationId: string
}

const DirectChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  
  const editorRef = useRef<Quill | null>(null);
  
    const [editorKey, setEditorKey] = useState(0);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const params = useParams();

    const { id } = params;

    console.log(id);
    
    const handleSubmit = async ({
      body,
      image
    }: {
      body: string,
      image: File | null
    }) => {

    console.log({ body, image});


        setIsLoading(true);
        setError("");

        try {
          
        const createWorkspace = await fetch("/api/messages/direct", {
            method: "POST",
            body: JSON.stringify({ body, workspaceId: id, conversationId })
            // body: JSON.stringify({ body, image, workspaceId: id, channelId, parentMessageId })
        })

        const response = await createWorkspace.json();

        if (response.success) {
            router.refresh();
            toast.success(response.message, {
                className: "text-lg",
                duration: 4000
            });
            setEditorKey((prevkey) => prevkey + 1);
        } else {
            setError(response.message)
        }
    } catch (error) {
        setError((error as Error).message)
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className='px-5 w-full'>
        <Editor key={editorKey} innerRef={editorRef} disabled={isLoading} onSubmit={handleSubmit} variant='create' placeholder={placeholder} />
    </div>
  )
}

export default DirectChatInput;