import React from 'react'
import UserButton from '@/features/auth/components/user-button'
import WorkspaceSwitcher from '@/features/auth/components/WorkspaceSwitcher'
import db from '@/lib/db'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Workspaces } from '@prisma/client'
import SidebarButton from './SidebarButton'
import { BellIcon, Home, MessagesSquareIcon, MoreHorizontal } from 'lucide-react'
import SidebarItems from './SidebarItems'

const Sidebar = async ({ currentWorkspace }: { currentWorkspace: Workspaces }) => {

    const user = await auth();

    if (!user) {
        return redirect("/auth");
    }

    
    const members = await db.members.findMany({
        where: {
            userId: user.user.id
        }
    })

    const allWorkspaces:string[] = members.map((member) => member.workspaceId);


    const workspaces = await db.workspaces.findMany({
        where: {
            OR: [
                {
                    userId: user.user.id
                },
                {
                    id: {
                       in: allWorkspaces
                    }
                },
            ]
        }
    })

  return (
    <aside className='w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-[4px]'>

        <WorkspaceSwitcher workspaces={workspaces} currentWorkspace={currentWorkspace} />

        <SidebarItems />
        
        <div className='flex flex-col items-center justify-center gap-y-1 mt-auto'>
            <UserButton />
        </div>

    </aside>
  )
}

export default Sidebar