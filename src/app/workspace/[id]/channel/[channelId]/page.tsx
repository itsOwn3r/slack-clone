import { auth } from '@/auth'
import ChatInput from '@/components/Workspaces/Channels/ChatInput'
import ChannelHeader from '@/components/Workspaces/Channels/Header'
import MessageList from '@/components/Workspaces/Messages/MessageList'
import db from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

const ChannelIdPage = async ({ params, searchParams }: { params: { id: string, channelId: string }, searchParams: any }) => {
    const user = await auth();

    if (!user) {
        return redirect("/auth");
    }


    const getTake = () => {
      if (Number.isNaN(searchParams.page) || searchParams.page === undefined) {
        return 20;
      } else if(Number(searchParams.page) < 2){
        return 20;
      }
      else {
        return (Number(searchParams.page)) * 20;
      }
    }

    console.log(getTake());


    const findChannel = await db.channels.findUnique({
      where: {
        id: params.channelId,
        workspaceId: params.id
      },
      include: {
        Messages: {
          orderBy: {
            time: "desc"
          },
          include: {
            user: true
          },
          take: getTake()
          // skip: searchParams.page ? (Number(searchParams.page) < 2 ? 0 : Number(searchParams.page) - 1) * 20 : 0
        },
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

    const isMember = findChannel.workspace.Members.length === 0 ? false : true;

    if (!isMember) {
      return notFound();
    }


    const isAdmin = findChannel.workspace.Members[0].role === "admin";

    const countAllMessages = await db.messages.count({
      where: {
        channelId: params.channelId
      }
    })

    const maxPages = Math.ceil(countAllMessages / 20);
    
  return (
    <div className='flex flex-col h-full'>
      <ChannelHeader isAdmin={isAdmin} channelName={findChannel.name} channelId={findChannel.id} workspaceId={findChannel.workspaceId} />
      <MessageList memberName={user.user.name || "User"} channelName={findChannel.name} data={findChannel.Messages} maxPages={maxPages} />
      <ChatInput placeholder={`Message #${findChannel.name}`} />
    </div>
  )
}

export default ChannelIdPage;