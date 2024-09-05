"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from 'lucide-react';
import { Channels, Members, Workspaces } from '@prisma/client';
import WorkspaceHeader from './WorkspaceHeader';
import SidebarItem from './SidebarItem';
import WorkspaceSection from './WorkspaceSection';
import UserItem from './UserItem';
import { useCreateChannelModal } from '@/features/workspaces/store/stores';
import CreateChannelModal from './Channels/CreateChannelModal';

const WorkspaceSidebar = () => {
  const [open, setOpen] = useCreateChannelModal();


  const [currentMember, setCurrentMember] = useState<null | undefined |  Members>(null);
  const [members, setMembers] = useState<null | undefined | (Members & {user: { id: string, email: string, name: string }})[]>(null);
  const [workspace, setWorkspace] = useState<null | undefined |  Workspaces>(null);
  const [channels, setChannels] = useState<null | undefined |  Channels[]>(null);
  const params = useParams();

  const workspaceId: string = params.id as string;

  useEffect(() => {
    async function findMember() {

      const response = await fetch("/api/workspace/member", {
        method: "POST",
        body: JSON.stringify({ id: params.id})
      })

      const data = await response.json();

      if (data.success) {
        setCurrentMember(data.member);
      } else {
        setCurrentMember(undefined);
      }

      const getAllMembers = await fetch("/api/workspace/getallmembers", {
        method: "POST",
        body: JSON.stringify({ id: params.id})
      })

      const allMembers = await getAllMembers.json();

      if (allMembers.success) {
        setMembers(allMembers.members);
      } else {
        setMembers(undefined);
      }

      const getChannels = await fetch("/api/channels/getchannels", {
        method: "POST",
        body: JSON.stringify({ id: params.id})
      })

      const channel = await getChannels.json();

      if (channel.success) {
        setChannels(channel.channels);
      } else {
        setChannels(undefined);
      }

      const getWorkspace = await fetch("/api/workspace/getworkspace", {
        method: "POST",
        body: JSON.stringify({ id: params.id})
      })

      const ws = await getWorkspace.json();

      if (ws.success) {
        setWorkspace(ws.workspace);
      } else {
        setWorkspace(undefined);
      }

    }
    findMember();

  }, [params.id])

  if (currentMember === null || workspace === null) {
    return (
    <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
      <Loader className='size-5 animate-spin text-white' />
    </div>
  )
  }

  if (currentMember === undefined || workspace === undefined) {
    return (
    <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
      <AlertTriangle className='size-5 text-white' />
      <p className='text-white text-sm'>Workspace not found!</p>
    </div>
  )
  }


  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <CreateChannelModal workspaceId={workspaceId} />
      <WorkspaceHeader workspace={workspace} isAdmin={currentMember.role === "admin"} />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />

      </div>
      <WorkspaceSection label="Channels" hint="New channel" onNew={currentMember.role === "admin" ? () => setOpen(true) : undefined}>
        {channels?.map((item) => (
          <SidebarItem key={item.id} icon={HashIcon} label={item.name} id={item.id} />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label="Direct Messages" hint="New Direct Message" onNew={() => console.log("Haha")}>
        {members?.map((item) => (
          <UserItem key={item.id} id={item.id} label={item.user.name} />
        ))}
      </WorkspaceSection>
    </div>
  )
}

export default WorkspaceSidebar;