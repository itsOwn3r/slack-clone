"use client";
import React, { useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Workspaces } from '@prisma/client'
import { useCreateWorkspaceModal } from '@/features/workspaces/store/stores';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

  
const WorkspaceSwitcher = ({ workspaces, currentWorkspace }: { workspaces: Workspaces[], currentWorkspace: Workspaces }) => {
      const [_open, setOpen] = useCreateWorkspaceModal();

      const router = useRouter();

      useEffect(() => {
        // setOpen(true);
      },[setOpen])

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button asChild className='size-9 relative overflow-hidden bg-[#AbABAB] hover:bg-[#AbABAB]/80 text-slate-800 font-semibold text-xl'>
            <div>
                {currentWorkspace?.name.charAt(0).toUpperCase()}
            </div>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' className='w-64'>

            {/* <DropdownMenuItem onClick={() => router.push(`/workspace/${currentWorkspace.id}`)} className='cursor-pointer flex-col justify-start items-start capitalize'>
                {currentWorkspace?.name}
                <span className='text-xs text-muted-foreground'>Active Workspace</span>
            </DropdownMenuItem> */}

            <DropdownMenuLabel className='text-center'>Workspaces</DropdownMenuLabel>

            <DropdownMenuSeparator />

            {workspaces.map((workspace) => (
            <DropdownMenuItem key={workspace.id} onClick={() => router.push(`/workspace/${workspace.id}`)} className='cursor-pointer flex-col justify-start items-start capitalize'>
                <div className='flex items-center w-full gap-x-[6%]'>
                    <div className='shrink-0 size-9 bg-[#616061] flex overflow-hidden justify-center items-center text-center font-semibold text-lg rounded-md text-white hover:text-slate-500 cursor-pointer'>
                        {workspace.name.charAt(0).toUpperCase()}
                    </div>
                    <p className='truncate'>{workspace?.name}</p>
                </div>
                {currentWorkspace.id === workspace.id && <span className='text-sm text-muted-foreground text-center w-full mb-2'>Active Workspace</span>}
            </DropdownMenuItem>
            ))}
            <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer' onClick={() => setOpen(true)}>
                    <div className='size-9 bg-[#F2F2F2] flex overflow-hidden justify-center items-center text-center font-semibold text-lg rounded-md text-slate-800 hover:text-slate-500 cursor-pointer'>
                        <Plus />
                    </div>
                   Create a New Workspace
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WorkspaceSwitcher