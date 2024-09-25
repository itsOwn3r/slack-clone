"use client";
import React from 'react'
import Header from './Header'
import DirectChatInput from './ChatInput'
import MessageList from '../Workspaces/Messages/MessageList'
import { Messages } from '@prisma/client';

const Conversation = ({ id, name, currentMemberName, maxPages, allMessages }: { id: string, allMessages: Messages[], name?: string | null, currentMemberName?: string | null, maxPages: number}) => {

    return (
    <div className='flex flex-col h-full'>
        <Header onClick={() => {}} memberName={name} />
        <MessageList memberName={currentMemberName || "User"} data={allMessages} maxPages={maxPages} variant="conversation" />
        <DirectChatInput conversationId={id} placeholder={`Message ${name}`} />
    </div>
  )
}

export default Conversation;