import { auth } from '@/auth'
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
      }
    });

    if (!findChannel) {
      return notFound();
    }

    
  return (
    <div>id: {findChannel.name}</div>
  )
}

export default ChannelIdPage;