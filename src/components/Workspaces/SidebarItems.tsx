"use client";
import React from 'react'
import SidebarButton from './SidebarButton'
import { BellIcon, Home, MessagesSquareIcon, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation';

const SidebarItems = () => {

  const pathname = usePathname();
console.log(pathname);
  return (
    <>
        <SidebarButton icon={Home} label='Home' isActive={pathname.includes("/workspace")} />
        <SidebarButton icon={MessagesSquareIcon} label='DMs' isActive={pathname.includes("/messages")} />
        <SidebarButton icon={BellIcon} label='Activity' isActive={pathname.includes("/activity")} />
        <SidebarButton icon={MoreHorizontal} label='More' isActive={pathname.includes("/more")} />
    </>
  )
}

export default SidebarItems;