import React, { ReactNode } from 'react'
import db from '@/lib/db';
import ToolbarComponent from '@/components/Workspaces/ToolbarComponent';
import Sidebar from '@/components/Workspaces/Sidebar';
import { notFound } from 'next/navigation';

const WorkspaceIdLayout = async ({ children, params }: { children: ReactNode, params: { id: string } }) => {
  
  const findWorkspace = await db.workspaces.findUnique({
    where: {
        id: params.id
    }
})

    if (!findWorkspace) {
        return notFound();
    }


    return (
    <div className='h-full'>
        <ToolbarComponent id={params.id} name={findWorkspace?.name || "..."} />
        <div className="flex h-[calc(100vh-40px)]">
            <Sidebar currentWorkspace={findWorkspace} />
            {children}
        </div>
    </div>
  )
}

export default WorkspaceIdLayout;