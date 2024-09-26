// "use client";
import { auth } from '@/auth';
import Conversation from '@/components/Conversation/Conversation';
import db from '@/lib/db';
import { Members } from '@prisma/client';
import { AlertTriangle, Loader } from 'lucide-react';
import { redirect, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ConversationPage = async ({ params, searchParams }: { params: { id: string, memberId: string }, searchParams: any  }) => {

    // const [isLoading, setIsLoading] = useState<boolean>(true);

    
    // const params = useParams();

    const workspaceId = params.id;
    const memberId = params.memberId;

    console.log(workspaceId);
    console.log(memberId);

    let conversationId;
        

    const user = await auth();

    if (!user) {
        return redirect("/login");
    }


    const currentMember = await db.members.findFirst({
      where: {
          userId: user.user.id,
          workspaceId: workspaceId,
      },
      include: {
        user: true
      }
  });

  const otherMember = Number(memberId);

  const findOtherMember = await db.members.findUnique({
    where: {
      id: otherMember,
      workspaceId: workspaceId,
    },
    include: {
      user: true
    }
  })

  const findConversation = await db.conversation.findFirst({
      where: {
          OR: [
              {
                  memberOneId: currentMember?.id,
                  memberTwoId: otherMember,
                  workspaceId: workspaceId
              },
              {
                  memberTwoId: currentMember?.id,
                  memberOneId: otherMember,
                  workspaceId: workspaceId
              }
          ]
      }
  })

  if (findConversation) {
    conversationId = findConversation.id
  } else {
      const createConversation = await db.conversation.create({
          data: {
            memberOneId: currentMember?.id ? currentMember.id : 0,
            memberTwoId: otherMember,
            workspaceId: workspaceId,
          }
      })

      conversationId = createConversation.id
  }



      if (!conversationId) {
        return (
            <div className="flex h-full flex-col gap-y-2 items-center justify-center">
                <AlertTriangle className='size-6 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>Conversation not found!</span>
            </div>
        )
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
    /*


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


    const isAdmin = findChannel.workspace.Members[0].role === "admin";

    */

    const allMessages = await db.messages.findMany({
      where: {
        conversationId
      },
      orderBy: {
        time: "desc"
      },
      take: getTake()
    })
     const countAllMessages = await db.messages.count({
       where: {
         conversationId
       }
     })
 
     const maxPages = Math.ceil(countAllMessages / 20);

  return (
    <Conversation id={conversationId} memberId={findOtherMember?.id} allMessages={allMessages} name={findOtherMember?.user.name} currentMemberName={currentMember?.user.name} maxPages={maxPages} />
  )
}

export default ConversationPage;