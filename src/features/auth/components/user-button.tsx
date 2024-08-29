"use client";
import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from 'lucide-react';


const UserButton = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='outline-none relative'>
      <Avatar className='size-10 hover:opacity-75 transition'>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center' side='right' className='w-60'>
      <DropdownMenuItem onClick={() => {}} className='h-10'>
        <LogOut className='size-4 mr-2' />
        Log out
      </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

export default UserButton;