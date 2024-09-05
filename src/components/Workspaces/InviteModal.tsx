import React, { useState } from 'react'
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
import { Loader, TrashIcon } from 'lucide-react';
import { useInviteModal } from '@/features/workspaces/store/stores';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useConfirm from '@/hooks/use-confirm';


interface PreferencesModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    name: string,
    workspaceId: string,
    joinCode: number
}

const InviteModal = ({ name, open, setOpen, workspaceId, joinCode }: PreferencesModalProps) => {

    const [editModalOpen, setEditModalOpen] = useInviteModal();
    
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();


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

  return (
    <>
        <ConfirmDialog />
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
                <DialogHeader className='p-4 border-b bg-white'>
                    <DialogTitle>
                        Invite people to {name}
                    </DialogTitle>
                    <DialogDescription>
                        {error && <><br /><span className='text-base text-rose-600'>{error}</span></>}

                        Use the code below to invite people to your workspace
                        </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                    <p className='text-4xl font-bold tracking-widest'>{joinCode}</p>
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default InviteModal;