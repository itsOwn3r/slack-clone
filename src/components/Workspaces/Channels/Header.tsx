"use client";
import React, { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaChevronDown } from 'react-icons/fa';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter
  } from "@/components/ui/dialog";
import { TrashIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useConfirm from '@/hooks/use-confirm';


const ChannelHeader = ({ channelName, channelId, workspaceId, isAdmin }: { channelName: string, channelId: string, workspaceId: string, isAdmin: boolean }) => {

    const [value, setValue] = useState(channelName);
    const [editOpen, setEditOpen] = useState(false);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [ConfirmDialog, confirm] = useConfirm("Delete this channel?", "You are about to delete this channel. This action is irreversible!");

    const router = useRouter();


    const editHandler = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
        const editWorkspace = await fetch("/api/channel/edit", {
            method: "POST",
            body: JSON.stringify({ name: value, channelId, workspaceId })
        })

        const response = await editWorkspace.json();

        if (response.success) {
            // window.location.href = response.path;
            router.refresh();
            setEditOpen(false);
            toast.success("Channel Edited!", {
                className: "text-lg",
                duration: 4000
            });
        } else {
            setError(response.message)
        }
    } catch (error) {
        setError((error as Error).message)
    } finally {
        setIsLoading(false);
    }
    }

    const deleteHandler = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const ok = await confirm();

        if (!ok) return;


        try {
        const createWorkspace = await fetch("/api/channel/delete", {
            method: "POST",
            body: JSON.stringify({ channelId, workspaceId })
        })

        const response = await createWorkspace.json();

        if (response.success) {
            router.push(`/workspace/${response.workspaceId}`);
            router.refresh();
            setEditOpen(false);
            toast.success(response.message, {
                className: "text-lg",
                duration: 4000
            });
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
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
        <ConfirmDialog />
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-lg font-semibold px-2 overflow-hidden w-auto' size="sm">
                    <span className='truncate'> # {channelName} </span>
                    <FaChevronDown className='size-2.5 ml-2' />
                </Button>
            </DialogTrigger>
            <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
                <DialogHeader className='p-4 border-b bg-white'>
                    <DialogTitle># {channelName}</DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4 flex flex-col gap-y-2">
                <Dialog open={(editOpen && isAdmin)} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                        <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <p className='text-sm font-semibold'>Channel name</p>
                                <p className='text-sm text-[#1264a3] hover:underline underline-offset-4 font-semibold'>Edit</p>
                            </div>
                            <p className='text-sm'>#{channelName}</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rename this channel</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={editHandler} className='space-y-4'>
                            {error && <div>{error}</div>}
                            <Input value={value} disabled={isLoading} onChange={(e) => setValue(e.target.value)} required autoFocus minLength={3} maxLength={80} placeholder='e.g. plan-budget' />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" disabled={isLoading}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button disabled={isLoading}>Save</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                    {isAdmin && (<button onClick={deleteHandler} className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600'>
                        <TrashIcon className='size-4' />
                        <p className='text-sm font-semibold'>Delete channel</p>
                    </button>)}
                </div>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default ChannelHeader;