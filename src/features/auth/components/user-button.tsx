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
import { signOut } from "next-auth/react";


const UserButton = () => {

  const handleLogout = () => {
    signOut();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='outline-none relative'>
      <Avatar className='size-10 hover:opacity-75 transition'>
        <AvatarImage src="/images/124599.jpg" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center' side='right' className='w-60'>
      <DropdownMenuItem onClick={() => handleLogout()} className='h-10 cursor-pointer'>
        <LogOut className='size-4 mr-2' />
        Log out
      </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

export default UserButton;