import React, { useEffect, useState } from 'react'
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
import { CopyIcon, RefreshCcw } from 'lucide-react';
import { useInviteModal } from '@/features/workspaces/store/stores';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import useConfirm from '@/hooks/use-confirm';
import { Button } from '@/components/ui/button';


interface PreferencesModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    name: string,
    workspaceId: string,
    joinCode: number
}

const InviteModal = ({ name, open, setOpen, workspaceId, joinCode }: PreferencesModalProps) => {

    const [safeInviteCode, setSafeInviteCode] = useState(joinCode);
    const [editModalOpen, setEditModalOpen] = useInviteModal();
    
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();
    const params = useParams();

    // useEffect(() => {

    // },[isLoading])


    const [ConfirmDialog, confirm] = useConfirm(`Deleting ${name}`, "You sure you want to delete this Workspace?");

    const handleClose = () => {
        setOpen(!open);
    }

    const deleteHandler = async () => {


        const ok = await confirm();

        if (!ok) return;

        setIsLoading(true);
        setError("");

        try {
        const deleteWorkspace = await fetch("/api/workspace/delete", {
            method: "POST",
            body: JSON.stringify({ id: workspaceId })
        })

        const response = await deleteWorkspace.json();

        if (response.success) {
            router.replace(`/`);
            handleClose();
            toast.success("Workspace Deleted!", {
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


    const revokeJoinCode = async () => {

        setIsLoading(true);
        setError("");

        try {
            const newJoinCode = await fetch("/api/workspace/joincode", {
                method: "POST",
                body: JSON.stringify({
                    id: workspaceId
                })
            })
    
            const response = await newJoinCode.json();    

            if (response.success) {
                setSafeInviteCode(response.joinCode);
                toast.success("New invite code generated!", {
                    className: "text-lg",
                    duration: 4000
                });
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
        }

    
    const copyHandle = () => {
        const inviteLink = `${window.location.origin}/join/${params.id}`;
        navigator.clipboard.writeText(inviteLink);
        toast.success("Invite link copied to clipboard!", {
            className: "text-lg",
            duration: 4000
        })
    }
  return (
    <>
        {/* <ConfirmDialog /> */}
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
                <DialogHeader className='p-4 border-b bg-white'>
                    <DialogTitle>
                        Invite people to {name}
                    </DialogTitle>
                    <DialogDescription>
                        Use the code below to invite people to your workspace
                        
                        {error && <><br /><span className='text-base text-rose-600'>{error}</span></>}
                        </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                    <p className='text-4xl font-bold tracking-widest'>{safeInviteCode}</p>
                    <Button onClick={copyHandle} variant="ghost" size="sm" className='outline-none'>Copy Link <CopyIcon className='size-4 ml-2' /></Button>
                </div>
                <div className="flex items-center justify-between w-full pb-2 px-4">
                    <Button onClick={revokeJoinCode} variant="outline" size="sm" className='outline-none'>New Invite Code <RefreshCcw className='size-4 ml-2' /></Button>
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default InviteModal;