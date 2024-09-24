"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const Header = ({ memberName = "Member", onClick }: { memberName?: string, onClick: () => void }) => {

    const avatarFallback = memberName.charAt(0).toUpperCase();

  return (
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
        <Button variant="ghost" className='text-lg font-semibold px-2 overflow-hidden w-auto' size="sm" onClick={onClick}>
            <Avatar>
                
            </Avatar>
        </Button>
    </div>
  )
}

export default Header;