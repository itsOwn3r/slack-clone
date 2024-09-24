"use client";
import Conversation from '@/components/Conversation/Conversation';
import { Members } from '@prisma/client';
import { AlertTriangle, Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ConversationPage = () => {

    const [currentMember, setCurrentMember] = useState<null | undefined |  Members>(null);
    const [otherMember, setOtherMember] = useState<null |  Members>(null);
    const [conversationId, setConversationId] = useState<null | string>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    
    const params = useParams();

    const workspaceId = params.id;
    const memberId = params.memberId;

    console.log(workspaceId);
    console.log(memberId);

    useEffect(() => {
        async function findMember() {
    
          const response = await fetch("/api/conversation/getorcreate", {
            method: "POST",
            body: JSON.stringify({ workspaceId, memberId})
          })
    
          const data = await response.json();
    
          if (data.success) {
            setConversationId(data.conversationId);
          } else {
            setConversationId(null);
          }

          
    
        // //   const getOtherMember = await fetch("/api/workspace/getothermember", {
        //   const getOtherMember = await fetch("/api/workspace/member", {
        //     method: "POST",
        //     body: JSON.stringify({ id: memberId})
        //   })
    
        //   const allMembers = await getOtherMember.json();
    
        //   if (allMembers.success) {
        //     setOtherMember(allMembers.members);
        //   } else {
        //     setOtherMember(null);
        //   }
    
        //   const getChannels = await fetch("/api/channels/getchannels", {
        //     method: "POST",
        //     body: JSON.stringify({ id: params.id})
        //   })
    
        //   const channel = await getChannels.json();
    
        //   if (channel.success) {
        //     setChannels(channel.channels);
        //   } else {
        //     setChannels(undefined);
        //   }
    
        //   const getWorkspace = await fetch("/api/workspace/getworkspace", {
        //     method: "POST",
        //     body: JSON.stringify({ id: params.id})
        //   })
    
        //   const ws = await getWorkspace.json();
    
        //   if (ws.success) {
        //     setWorkspace(ws.workspace);
        //   } else {
        //     setWorkspace(undefined);
        //   }
    
        }
        findMember();

        setIsLoading(false);
    
      }, [memberId, workspaceId])


      if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader className='size-6 animate-spin text-muted-foreground' />
            </div>
        )
      }

      if (!conversationId) {
        return (
            <div className="flex h-full flex-col gap-y-2 items-center justify-center">
                <AlertTriangle className='size-6 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>Conversation not found!</span>
            </div>
        )
      }

  return (
    <Conversation id={conversationId} />
  )
}

export default ConversationPage;