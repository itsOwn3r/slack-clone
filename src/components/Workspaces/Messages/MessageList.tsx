"use client"
import React, { useEffect, useState } from 'react';
import { Members, Messages } from '@prisma/client';
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Message from './Message';
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TIME_THRESHOLD = 5;

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "EEEE, MMMM d")
}

const MessageList = ({ memberName, channelName, data, variant = "channel", maxPages }: { memberName: string, channelName?: string, data: Messages[], variant?: "channel" | "thread" | "conversation", maxPages: number }) => {

    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    const [currentMember, setCurrentMember] = useState<null | undefined |  Members>(null);

    const router = useRouter();

    const { replace } = useRouter();

    const pathname = usePathname();

    const params = useParams();

    const searchParams = useSearchParams();

    const page = searchParams.get("page");

    const loadMore = async () => {
      setIsLoadingMore(true);
      try {

        if (Number.isNaN(page)) {
          return;
        }

        const params = new URLSearchParams(searchParams);

        const nextPage = (page === undefined || page === null) ? 2 : (Number(page) + 1);

        params.set('page', nextPage.toString());
        replace(`${pathname}?${params.toString()}`);
      } catch (error) {
        toast.error("Something went wrong!");
      } finally {
        setIsLoadingMore(false);
      }
    }

    
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
    setIsLoading(false);
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
                            <Message key={message.id} id={message.id} isEditing={editingId === message.id} isCompact={isCompact} setEditingId={setEditingId} memberId={message.memberId || 0} authorName={message.senderName} isAuthor={(currentMember?.userId || "") === message.userId} body={message.body} updatedAt={message.updatedAt} createdAt={message.time}  />
                        </div>
                    )
                })}

            </div>
        ))}


      {isLoadingMore && (
                    <div className='text-center my-2 relative'>
                      <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300' />
                      <span className='relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm'>
                        <Loader className='size-4 animate-spin' />
                      </span>
                    </div>
                )}


      {(!isLoading && !isLoadingMore) && <div className='w-full flex justify-center items-center mt-4'><Button disabled={isLoadingMore} className={cn('w-3/5', isLoadingMore && "bg-muted-foreground/30")} variant="outline" onClick={() => loadMore()}> Load more </Button></div>}
      
    </div>
  )
}

export default MessageList;