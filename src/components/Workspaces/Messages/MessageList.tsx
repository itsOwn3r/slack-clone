"use client"
import React, { useEffect, useState } from 'react';
import { Members, Messages } from '@prisma/client';
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Message from './Message';
import { useParams } from 'next/navigation';

const TIME_THRESHOLD = 5;

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "EEEE, MMMM d")
}

const MessageList = ({ memberName, channelName, data, variant = "channel" }: { memberName: string, channelName: string, data: Messages[], variant?: "channel" | "thread" | "conversation" }) => {

    const [editingId, setEditingId] = useState<string | null>(null);

    const [currentMember, setCurrentMember] = useState<null | undefined |  Members>(null);


    const params = useParams();
    
  useEffect(() => {
    async function findMember() {

      const response = await fetch("/api/workspace/member", {
        method: "POST",
        body: JSON.stringify({ id: params.id})
      })

      const data = await response.json();

      if (data.success) {
        setCurrentMember(data.member);
      } else {
        setCurrentMember(undefined);
      }


    }
    findMember();

  }, [params.id])

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

                    const prevMessage = index === 0 ? null : messages[index - 1];
                    // @ts-expect-error needs to add type of the user to messages object
                    const isCompact = (prevMessage && (prevMessage.user.id === message.user.id && (differenceInMinutes(new Date(message.time * 1000), new Date(prevMessage.time * 1000)) < TIME_THRESHOLD))) ? true : false;

                    return (
                        <div key={message.id}>
                            <Message key={message.id} id={message.id} isEditing={editingId === message.id} isCompact={isCompact} setEditingId={setEditingId} memberId={message.memberId} authorName={message.senderName} isAuthor={(currentMember?.userId || "") === message.userId} body={message.body} updatedAt={message.updatedAt} createdAt={message.time}  />
                        </div>
                    )
                })}
            </div>
        ))}
    </div>
  )
}

export default MessageList;