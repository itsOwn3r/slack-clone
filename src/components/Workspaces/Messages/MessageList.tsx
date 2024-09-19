import React from 'react';
import { Messages } from '@prisma/client';
import { format, isToday, isYesterday } from "date-fns";
import Message from './Message';

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "EEEE, MMMM d")
}

const MessageList = ({ memberName, channelName, data, variant = "channel" }: { memberName: string, channelName: string, data: Messages[], variant?: "channel" | "thread" | "conversation" }) => {


    const groupedMessages = data?.reduce((groups, message) => {

        const date = new Date(Number(message.time) * 1000);

        const dateKey = format(date, "yyyy-MM-dd");

        if (!groups[dateKey]) {
            groups[dateKey] = []
        }
        groups[dateKey].unshift(message);

        return groups;
    }, {

    } as Record<string, typeof data>)


  return (
    <div className='flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar'>
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
            <div key={dateKey}>
                <div className='text-center my-2 relative'>
                    <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300' />
                    <span className='relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm'>
                        {formatDateLabel(dateKey)}
                    </span>
                </div>
                {messages.map((message, index) => {
                    return (
                        <div key={message.id}>
                            <Message key={message.id} id={message.id} isEditing={false} isCompact={false} setEditingId={() => {}} memberId={message.memberId} authorName={message.senderName} isAuthor={false} body={message.body} updatedAt={message.updatedAt} createdAt={new Date(Math.ceil(message.time * 1000))}  />
                        </div>
                    )
                })}
            </div>
        ))}
    </div>
  )
}

export default MessageList;