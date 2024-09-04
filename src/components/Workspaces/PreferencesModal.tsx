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
import { useEditWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useConfirm from '@/hooks/use-confirm';


interface PreferencesModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    initialValue: string,
    workspaceId: string
}

const PreferencesModal = ({ initialValue, open, setOpen, workspaceId }: PreferencesModalProps) => {

    const [value, setValue] = useState(initialValue);
    const [editModalOpen, setEditModalOpen] = useEditWorkspaceModal();
    
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();


    const [ConfirmDialog, confirm] = useConfirm(`Deleting ${value}`, "You sure you want to delete this Workspace?");

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
                        {value}
                    </DialogTitle>
                    <DialogDescription>{error && <span className='text-base text-rose-600'>{error}</span>}</DialogDescription>
                </DialogHeader>

                <div className="px-4 pb-4 flex flex-col gap-y-2">
                    <div onClick={() => setEditModalOpen(true)} className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <p className='text-sm font-semibold'>
                                Workspace Name
                            </p>

                            <p className='text-sm text-[#1264a3] hover:underline font-semibold'>
                                Edit
                            </p>

                        </div>
                        <p className='text-sm'>
                            {value}
                        </p>
                    </div>

                    <button disabled={isLoading} onClick={deleteHandler} className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600'>
                        <TrashIcon className='size-4' />
                        <p className='text-sm font-semibold flex items-center gap-x-2'>Delete workspace {isLoading && <Loader className='animate-spin size-6 text-blue-600' />}</p>
                    </button>

                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default PreferencesModal;