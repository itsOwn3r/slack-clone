"use client";
import React from 'react'
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
  
const CreateWorkspaceModal = () => {

    const [open, setOpen] = useCreateWorkspaceModal();

    const handleClose = () => {
        setOpen(!open);
    }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Add a workspace</DialogTitle>
            </DialogHeader>
            <form className='space-y-4'>
                <Input disabled={false} value="" required autoFocus minLength={3} placeholder="Workspace name e.g. 'Work', 'Personal', 'Home' " />
                <div className="flex justify-end">
                    <Button disabled={false}>
                        Create
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspaceModal