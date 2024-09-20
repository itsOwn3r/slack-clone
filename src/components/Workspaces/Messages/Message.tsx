import React from 'react';
import dynamic from 'next/dynamic';
import { format, isToday, isYesterday } from 'date-fns';
import Hint from '@/components/hint';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Toolbar from '../Channels/Toolbar';

const Rendered = dynamic(() => import("@/components/Workspaces/Messages/Rendered"), { ssr: false })

interface MessageProps {
    id: string,
    setEditingId: (id: string | null) => void,
    authorName?: string,
    isCompact: boolean,
    isEditing: boolean,
    isAuthor: boolean,
    body: string,
    memberId: number,
    updatedAt: Date,
    createdAt: Date,
}

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
}

const Message = ({ id, body, createdAt, isAuthor, isEditing, memberId, setEditingId, updatedAt, authorName = "Member", isCompact}: MessageProps) => {

    if (isCompact) {
        return (
        <div className='flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative'>
            <div className="flex items-center gap-2">
                <Hint label={formatFullTime(createdAt)}>
                    <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline'>
                        {format(createdAt, "hh:mm")}
                    </button>
                </Hint>
                <div className='flex flex-col w-full'>
                    <Rendered value={body} />
                    {updatedAt ? (
                    <span className='text-xs text-muted-foreground'>(edited)</span>
                ) : null}
                </div>
            </div>
        </div>
    )
    }

        const avatarFallback = authorName.charAt(0).toUpperCase();

        return (
        <div className='flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative'>
            <div className="flex items-center gap-2">
                <button>
                    <Avatar className='rounded-md'>
                        <AvatarImage src="/images/124599.jpg" />
                        <AvatarFallback>
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </div>

            <div className='flex flex-col w-full overflow-hidden'>
                <div className='text-sm'>
                    <button className='font-bold text-primary hover:underline'>
                        {authorName}
                    </button>
                    <span> &nbsp;&nbsp; </span>
                    <Hint label={formatFullTime(createdAt)}>
                        <button className='text-xs text-muted-foreground hover:underline'>
                        {format(createdAt, "h:mm a")}
                        </button>
                    </Hint>
                </div>
                <Rendered value={body} />

                {updatedAt ? (
                    <span className='text-xs text-muted-foreground'>(edited)</span>
                ) : null}

            </div>

        {!isEditing && (
            <Toolbar
                isAuthor={isAuthor}
                isPending={false}
                handleEdit={() => setEditingId(id)}
                handleDelete={() => {}}

            />
        )}
        </div>
    )
    }

export default Message