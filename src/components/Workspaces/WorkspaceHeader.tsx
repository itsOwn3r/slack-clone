import React, { useState } from 'react'
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
import { ChevronDown, ListFilter, SquarePen } from 'lucide-react'
import Hint from '../hint'
import PreferencesModal from './PreferencesModal'
import UpdateWorkspace from './UpdateWorkspace'
  
const WorkspaceHeader = ({ workspace, isAdmin }: { workspace: Workspaces, isAdmin: boolean }) => {

  const [preferencesOpen, setPreferencesOpen] = useState(false);

  return (
    <>
      <PreferencesModal workspaceId={workspace.id} open={preferencesOpen} setOpen={setPreferencesOpen} initialValue={workspace.name} />
      <UpdateWorkspace currentName={workspace.name} workspaceId={workspace.id} />
      <div className='flex items-center justify-between px-4 h-[49px] gap-0.5'>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="transparent" className='font-semibold text-lg w-auto p-1.5 overflow-hidden' size="sm">
                <span className='truncate'>{workspace.name}</span>
                <ChevronDown className='size-4 ml-1 shrink-0' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='bottom' align='start' className='w-64'>
                <DropdownMenuItem className='cursor-pointer capitalize'>
                  <div className='size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2'>
                    {workspace.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start">
                    <p className='font-bold'>{workspace.name}</p>
                    <p className='text-xs text-muted-foreground'>Active Workspace</p>
                  </div>
                </DropdownMenuItem>
                {isAdmin && <><DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer py-2' onClick={() => {}}>
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer py-2' onClick={() => setPreferencesOpen(true)}>
                  Preferencess
                </DropdownMenuItem></>}
            </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-0.5">

          <Hint label='Filter Conversations' side='bottom'>          
            <Button variant="transparent" size="iconSm">
              <ListFilter className='size-4' />
            </Button>
          </Hint>

          <Hint label='New Message' side='bottom'>
            <Button variant="transparent" size="iconSm">
              <SquarePen className='size-4' />
            </Button>
          </Hint>

        </div>

    </div>
   </>
  )
}

export default WorkspaceHeader