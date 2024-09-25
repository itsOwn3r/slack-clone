import React, { ReactNode } from 'react'
import db from '@/lib/db';
import ToolbarComponent from '@/components/Workspaces/ToolbarComponent';
import Sidebar from '@/components/Workspaces/Sidebar';
import { notFound } from 'next/navigation';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import WorkspaceSidebar from '@/components/Workspaces/WorkspaceSidebar';
import Panel from '@/components/panel/Panel';

  
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
            <ResizablePanelGroup direction='horizontal' autoSaveId="local-workspace">
                <ResizablePanel defaultSize={20} minSize={11} className='bg-[#5E2C5F]'>
                    <WorkspaceSidebar />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel minSize={20} defaultSize={80}>
                    {children}
                </ResizablePanel>
                <Panel />
            </ResizablePanelGroup>
        </div>
    </div>
  )
}

export default WorkspaceIdLayout;