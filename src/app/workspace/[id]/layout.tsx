import React, { ReactNode } from 'react'
import db from '@/lib/db';
import ToolbarComponent from '@/components/ToolbarComponent';

const WorkspaceIdLayout = async ({ children, params }: { children: ReactNode, params: { id: string } }) => {
  console.log(params);

  
  const findWorkspace = await db.workspaces.findUnique({
    where: {
        id: params.id
    }
})


    return (
    <div className='h-full'>
        <ToolbarComponent id={params.id} name={findWorkspace?.name || "..."} />
    {children}
    </div>
  )
}

export default WorkspaceIdLayout;