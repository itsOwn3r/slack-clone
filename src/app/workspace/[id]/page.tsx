import React from 'react';
import { auth } from '@/auth';
import db from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import CreateChannelModal from '@/components/Workspaces/Channels/CreateChannelModal';
import { TriangleAlert } from 'lucide-react';

const WorkspacePage = async ({ params }: { params: { id: string } }) => {
  
    const user = await auth();

    if (!user) {
        return redirect("/auth");
    }


    const workspace = await db.workspaces.findUnique({
        where: {
            id: params.id,
            OR: [
                  {
                    userId: user.user.id
                  },
                  {
                    Members: {
                      some: { userId: user.user.id }
                  }
              }
            ]
        },
        include: {
          Channels: true
        }
    })

    const findMember = await db.members.findFirst({
      where: {
        workspaceId: params.id,
        userId: user.user.id
      }
    });

    const isAdmin = findMember?.role === "admin" ? true : false;

    if (!workspace) {
        return notFound();
    } else if(workspace.Channels.length === 0) {
      if (isAdmin) {
        return <CreateChannelModal workspaceId={workspace.id} defaultOpen={true} />;
      } else {
        return (
          <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
            <TriangleAlert className='size-6 animate-spin text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>
              No Channel Found!
            </span>
          </div>
        )
      }
      
    } else {
      return redirect(`/workspace/${workspace.id}/channel/${workspace.Channels[0].id}`);
    }
}

export default WorkspacePage;