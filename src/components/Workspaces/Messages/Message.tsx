import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { format, isToday, isYesterday } from 'date-fns';
import Hint from '@/components/hint';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Toolbar from '../Channels/Toolbar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useConfirm from '@/hooks/use-confirm';
import { usePanel } from '@/hooks/use-panel';

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

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
    createdAt: number,
}

const formatFullTime = (date: number) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
}

const Message = ({ id, body, createdAt, isAuthor, isEditing, memberId, setEditingId, updatedAt, authorName = "Member", isCompact}: MessageProps) => {

    const [ConfirmDialog, confirm] = useConfirm("Delete Message", "Are you sure you want to delete this message? This cannot be undone.");

    const router = useRouter();

    const [isUpdatingMessage, setIsUpdatingMessage] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const { onOpenProfile } = usePanel();

    const handleUpdate = async ({ body }: { body: string }) => {
        try {
            setIsUpdatingMessage(true);

            const request = await fetch("/api/messages/edit", {
                method: "POST",
                body: JSON.stringify({ id, body })
            })

            const response = await request.json();

            if (response.success) {
                toast.success("Message Edited")
                setEditingId(null);
                router.refresh();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
                toast.error((error as Error).message)
            } finally {
                setIsUpdatingMessage(false);
            }
        }

    const handleDelete = async () => {
        try {
            
            const ok = await confirm();
            if(!ok) return;

            setIsRemoving(true);

            const request = await fetch("/api/messages/delete", {
                method: "POST",
                body: JSON.stringify({ id })
            })

            const response = await request.json();

            if (response.success) {
                toast.success(response.message);
                router.refresh();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
                toast.error((error as Error).message)
            } finally {
                setIsRemoving(false);
            }
        }


    if (isCompact) {
        return (
            <div className={cn('flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative', isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]", isRemoving && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-300")}>
            <ConfirmDialog />
            <div className="flex items-center gap-2">
                <Hint label={formatFullTime(createdAt * 1000)}>
                    <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline'>
                        {format(createdAt * 1000, "hh:mm")}
                    </button>
                </Hint>
                {isEditing ? (
                    <div className='w-full h-full'>
                        <Editor 
                        onSubmit={handleUpdate}
                        disabled={isUpdatingMessage}
                        defaultValue={JSON.parse(body)}
                        onCancel={() => setEditingId(null)}
                        variant='update'
                        />
                    </div>
                ) : (
                <div className='flex flex-col w-full'>
                    <Rendered value={body} />
                    {createdAt !== Math.ceil((updatedAt.getTime() / 1000)) ? (
                    <span className='text-xs text-muted-foreground'>(edited)</span>
                ) : null}
                </div>
            )}

            </div>
            {!isEditing && (
            <Toolbar
                isAuthor={isAuthor}
                isPending={isUpdatingMessage}
                handleEdit={() => setEditingId(id)}
                handleDelete={handleDelete}
            />
        )}
        </div>
    )
    }

        const avatarFallback = authorName.charAt(0).toUpperCase();

        return (
        <div className={cn('flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative', isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]", isRemoving && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-300")}>
            <ConfirmDialog />
            <div className="flex items-center gap-2">
                <button onClick={() => onOpenProfile(memberId)}>
                    <Avatar className='rounded-md'>
                        <AvatarImage src="/images/124599.jpg" />
                        <AvatarFallback>
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                </button>
                {isEditing ? (
                    <div className='w-full h-full'>
                        <Editor 
                        onSubmit={handleUpdate}
                        disabled={isUpdatingMessage}
                        defaultValue={JSON.parse(body)}
                        onCancel={() => setEditingId(null)}
                        variant='update'
                            />
                    </div>
                ) : (
                <div className='flex flex-col w-full overflow-hidden'>
                    <div className='text-sm'>
                        <button onClick={() => onOpenProfile(memberId)} className='font-bold text-primary hover:underline'>
                            {authorName}
                        </button>
                        <span> &nbsp;&nbsp; </span>
                        <Hint label={formatFullTime(createdAt * 1000)}>
                            <button className='text-xs text-muted-foreground hover:underline'>
                            {format(createdAt * 1000, "h:mm a")}
                            </button>
                        </Hint>
                    </div>
                    <Rendered value={body} />
    
                    {createdAt !== Math.ceil((updatedAt.getTime() / 1000)) ? (
                        <span className='text-xs text-muted-foreground'>(edited)</span>
                    ) : null}
    
                </div>)}
            </div>



        {!isEditing && (
            <Toolbar
                isAuthor={isAuthor}
                isPending={isUpdatingMessage}
                handleEdit={() => setEditingId(id)}
                handleDelete={handleDelete}
            />
        )}
        </div>
    )
    }

export default Message