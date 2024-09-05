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
import { useCreateWorkspaceModal } from "@/features/workspaces/store/stores";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
  
const CreateWorkspaceModal = () => {

    const [open, setOpen] = useCreateWorkspaceModal();
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleClose = () => {
        setOpen(!open);
        setName("");
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
        const createWorkspace = await fetch("/api/workspace/create", {
            method: "POST",
            body: JSON.stringify({ name })
        })

        const response = await createWorkspace.json();

        if (response.success) {
            router.replace(`/workspace/${response.id}`);
            handleClose();
            toast.success("Workspace Created!", {
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
            <DialogTitle>Add a workspace</DialogTitle>
            <DialogDescription>{error && <span className='text-base text-rose-600'>{error}</span>}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <Input disabled={isLoading} onChange={(e) => setName(e.target.value)} value={name} required autoFocus minLength={3} placeholder="Workspace name e.g. 'Work', 'Personal', 'Home' " />
                <div className="flex justify-end">
                    <Button disabled={isLoading} type='submit'>
                        Create
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspaceModal