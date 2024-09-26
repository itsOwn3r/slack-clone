"use client";
import React from 'react'
import Header from './Header'
import DirectChatInput from './ChatInput'
import MessageList from '../Workspaces/Messages/MessageList'
import { Messages } from '@prisma/client';
import { usePanel } from '@/hooks/use-panel';

const Conversation = ({ id, memberId, name, currentMemberName, maxPages, allMessages }: { id: string, memberId?: number, allMessages: Messages[], name?: string | null, currentMemberName?: string | null, maxPages: number}) => {
  console.log("id is:" + id);
  const { onOpenProfile } = usePanel();
    return (
    <div className='flex flex-col h-full'>
        <Header onClick={() => onOpenProfile(memberId || 0)} memberName={name} />
        <MessageList memberName={currentMemberName || "User"} data={allMessages} maxPages={maxPages} variant="conversation" />
        <DirectChatInput conversationId={id} placeholder={`Message ${name}`} />
    </div>
  )
}

export default Conversation;