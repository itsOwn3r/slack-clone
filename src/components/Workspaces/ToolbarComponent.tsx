"use client";
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Info, Search } from 'lucide-react';
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
  } from "lucide-react"
   
  import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command";
import { Channels, Members } from '@prisma/client';
import Link from 'next/link';


const ToolbarComponent = ({ id, name }: { id?: string, name?: string }) => {
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [channels, setChannels] = useState<null | undefined |  Channels[]>(null);
    const [members, setMembers] = useState<null | undefined | (Members & {user: { id: string, email: string, name: string }})[]>(null);


    useEffect(() => {
        async function getDate() {
            setIsLoading(true);
        const getChannels = await fetch("/api/channels/getchannels", {
            method: "POST",
            body: JSON.stringify({ id })
          })
    
          const channel = await getChannels.json();
    
          if (channel.success) {
            setChannels(channel.channels);
          } else {
            setChannels(null);
          }

          const getAllMembers = await fetch("/api/workspace/getallmembers", {
            method: "POST",
            body: JSON.stringify({ id })
          })
    
          const allMembers = await getAllMembers.json();
    
          if (allMembers.success) {
            setMembers(allMembers.members);
          } else {
            setMembers(undefined);
          }
          
          setIsLoading(false);
        }
        getDate()
    }, [id])

  return (
    <nav className='bg-[#481349] flex items-center justify-between h-10 p-1.5'>
        <div className='flex-1' />
        <div className='min-w-[200px] max-w-[642px] grow-[2] shrink'>
            <Button onClick={() => setOpen(!open)} size="sm" className='bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2'>
                <Search className='size-4 text-white mr-2' />
                <span className='text-white text-sm'>Search in {name}</span>
            </Button>

       <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Channels">
            {channels?.map((channel) => (
                <CommandItem key={channel.id}>
                     <Link onClick={() => setOpen(false)} href={`/workspace/${id}/channel/${channel.id}`}>
                        {channel.name}
                    </Link>
                </CommandItem>                
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Members">
            {members?.map((member) => (
                <CommandItem key={member.id} asChild>
                    <Link onClick={() => setOpen(false)} href={`/workspace/${id}/member/${member.id}`}>
                        {member.user.name}
                    </Link>
                </CommandItem>                
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
        </div>

        <div className="flex flex-1 ml-auto items-center justify-end">
            <Button variant="transparent" size="iconSm">
                <Info className='size-5 text-white' />
            </Button>
        </div>
    </nav>
  )
}

export default ToolbarComponent