import React from 'react'
import UserButton from '@/features/auth/components/user-button'
import WorkspaceSwitcher from '@/features/auth/components/WorkspaceSwitcher'
import db from '@/lib/db'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Workspaces } from '@prisma/client'

const Sidebar = async ({ currentWorkspace }: { currentWorkspace: Workspaces }) => {

    const user = await auth();

    if (!user) {
        return redirect("/auth");
    }

    const workspaces = await db.workspaces.findMany({
        where: {
            userId: user.user.id
        }
    })

  return (
    <aside className='w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-[4px]'>

        <WorkspaceSwitcher workspaces={workspaces} currentWorkspace={currentWorkspace} />

        <div className='flex flex-col items-center justify-center gap-y-1 mt-auto'>
            <UserButton />
        </div>

    </aside>
  )
}

export default Sidebar