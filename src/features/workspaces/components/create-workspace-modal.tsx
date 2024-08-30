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
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
  
const CreateWorkspaceModal = () => {

    const [open, setOpen] = useCreateWorkspaceModal();
    const [name, setName] = useState("")

    const router = useRouter();

    const handleClose = () => {
        setOpen(!open);
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
        const createWorkspace = await fetch("/api/workspace/create", {
            method: "POST",
            body: JSON.stringify({ name })
        })

        const response = await createWorkspace.json();

        if (response.success) {
            router.push(`/space/${response.id}`)
        } else {
            
        }
    } catch (error) {
            
        }
    }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Add a workspace</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <Input disabled={false} onChange={(e) => setName(e.target.value)} value={name} required autoFocus minLength={3} placeholder="Workspace name e.g. 'Work', 'Personal', 'Home' " />
                <div className="flex justify-end">
                    <Button disabled={false} type='submit'>
                        Create
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspaceModal