"use client";
import React, { FormEvent, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useEditWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
  
const UpdateWorkspace = ({ workspaceId, currentName }: { workspaceId: string, currentName: string }) => {
    const [open, setOpen] = useEditWorkspaceModal();
    const [name, setName] = useState(currentName ? currentName : "");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleClose = () => {
        setOpen(!open);
    }

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
        const editWorkspace = await fetch("/api/workspace/update", {
            method: "POST",
            body: JSON.stringify({ name, id: workspaceId })
        })

        const response = await editWorkspace.json();

        if (response.success) {
            // router.replace(`/workspace/${response.id}`);
            router.refresh();
            handleClose();
            toast.success("Workspace Edited!", {
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

    if (!open) {
        return null;
    }


  return (
    <Dialog open={open} onOpenChange={handleClose}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
            <DialogDescription>{error && <span className='text-base text-rose-600'>{error}</span>}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className='space-y-4'>
                <Input disabled={isLoading} onChange={(e) => setName(e.target.value)} value={name} required autoFocus={false} minLength={3} placeholder="Workspace name e.g. 'Work', 'Personal', 'Home' " />
                <div className="flex justify-end">
                    <Button disabled={isLoading} type='submit'>
                        Edit
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default UpdateWorkspace;