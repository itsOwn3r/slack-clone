import { auth } from '@/auth'
import ChannelHeader from '@/components/Workspaces/Channels/Header'
import db from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

const ChannelIdPage = async ({ params }: { params: { id: string, channelId: string } }) => {
    const user = await auth();

    if (!user) {
        return redirect("/auth");
    }

    const findChannel = await db.channels.findUnique({
      where: {
        id: params.channelId,
        workspaceId: params.id
      },
      include: {
        workspace: {
          include: {
            Members: {
              where: {
                userId: user.user.id
              }
            }
          }
        }
      }
    });

    if (!findChannel) {
      return notFound();
    }


    const isAdmin = findChannel.workspace.Members[0].role === "admin"
    
  return (
    <div className='flex flex-col h-full'>
      <ChannelHeader isAdmin={isAdmin} channelName={findChannel.name} channelId={findChannel.id} workspaceId={findChannel.workspaceId} />
    </div>
  )
}

export default ChannelIdPage;