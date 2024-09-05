"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from 'lucide-react';
import { Channels, Members, Workspaces } from '@prisma/client';
import WorkspaceHeader from './WorkspaceHeader';
import SidebarItem from './SidebarItem';
import WorkspaceSection from './WorkspaceSection';

const WorkspaceSidebar = () => {
  const [member, setMember] = useState<null | undefined |  Members>(null);
  const [workspace, setWorkspace] = useState<null | undefined |  Workspaces>(null);
  const [channels, setChannels] = useState<null | undefined |  Channels[]>(null);
  const params = useParams();

  useEffect(() => {
    async function findMember() {

      const response = await fetch("/api/workspace/member", {
        method: "POST",
        body: JSON.stringify({ id: params.id})
      })

      const data = await response.json();

      if (data.success) {
        setMember(data.member);
      } else {
        setMember(undefined);
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


  if (member === null || workspace === null) {
    return (
    <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
      <Loader className='size-5 animate-spin text-white' />
    </div>
  )
  }

  if (member === undefined || workspace === undefined) {
    return (
    <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
      <AlertTriangle className='size-5 text-white' />
      <p className='text-white text-sm'>Workspace not found!</p>
    </div>
  )
  }


  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />

      </div>
      <WorkspaceSection label="Channels" hint="New channel" onNew={() => console.log("Haha")}>
        {channels?.map((item) => (
          <SidebarItem key={item.id} icon={HashIcon} label={item.name} id={item.id} />
        ))}
      </WorkspaceSection>
    </div>
  )
}

export default WorkspaceSidebar;