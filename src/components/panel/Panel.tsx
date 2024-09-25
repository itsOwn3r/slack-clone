"use client";
import React, { useEffect, useState } from "react";
import { usePanel } from "@/hooks/use-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Loader, MailIcon, ShieldAlert, XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Members } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from "../ui/separator";
import Link from "next/link";


const Panel = () => {

    const [profile, setProfile] = useState<Members & { user: { name: string, id: string, email: string }} | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    const params = useParams();

    const workspaceId = params.id;


  const { onClose, onOpenProfile, profileMemberId } = usePanel();

  const showPanel = !!profileMemberId;


  useEffect(() => {
    async function findMember() { 

      const response = await fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify({ workspaceId, userId: profileMemberId})
      })

      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
      } else {
        setProfile(null);
      }
      setHasLoaded(true);
    }

    if (showPanel) {
        findMember();
    }

    }, [profileMemberId, showPanel, workspaceId])

    console.log(profile);

    if (!showPanel) return null;

    if (!hasLoaded) {
        return (
            <>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={20} defaultSize={29}>
                <div className="size-full flex justify-center items-center">
                    <Loader className="size-8 animate-spin" />
                </div>
            </ResizablePanel>
            </>
        );
    }

    if (!profile) {
        return (
            <>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={20} defaultSize={29}>
                <div className="size-full flex justify-center items-center flex-col">
                    <ShieldAlert className="size-8" />
                    <span className="text-lg text-center px-5 mt-3">Profile was not found! Or User is no longer a part of this Workspace!</span>
                </div>
            </ResizablePanel>
            </>
        );
    }

    const fallback = profile.user.name.charAt(0).toUpperCase();

  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={20} defaultSize={29}>
        <div className="flex flex-col h-full">
            <div className="flex h-[49px] justify-between items-center px-4 border-b">
                <p className="text-lg font-bold">
                    Profile
                </p>
                <Button variant="ghost" size="iconSm" onClick={onClose}>
                    <XIcon className="size-5 stroke-[1.5]" />
                </Button>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
                <Avatar className="max-w-[256px] max-h-[256px] size-full">
                    <AvatarImage src="/images/124599.jpg" />
                    <AvatarFallback className="h-full text-xl">
                        {fallback}
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="flex flex-col p-4">
                <p className="text-xl font-bold">{profile.user.name}</p>
            </div>

            <Separator />

            <div className="flex flex-col p-4">
                <p className="text-sm font-bold mb-4">Contact information</p>
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                        <MailIcon className="size-4" />
                    </div>

                    <div className="flex flex-col">
                        <p className="text-[13px] font-semibold text-muted-foreground">Email Address</p>
                        <Link href={`mailto:${profile.user.email}`} className="text-sm hover:underline text-[#1264a3]">{profile.user.email}</Link>
                    </div>

                </div>
            </div>

        </div>
      </ResizablePanel>
    </>
  );
};

export default Panel;
