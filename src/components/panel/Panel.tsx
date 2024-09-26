"use client";
import React, { useEffect, useState } from "react";
import { usePanel } from "@/hooks/use-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChevronDown, Loader, MailIcon, ShieldAlert, XIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Members } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from "../ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import useConfirm from "@/hooks/use-confirm";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
  } from "@/components/ui/dropdown-menu"

const Panel = () => {

    const [profile, setProfile] = useState<Members & { user: { name: string, id: string, email: string }} | null>(null);
    const [currentMember, setCurrentMember] = useState<Members | null>(null);

    const [hasLoaded, setHasLoaded] = useState(false);

    const router = useRouter();

    const params = useParams();

    const workspaceId = params.id;

    const [UpdateDialog, confirmUpdate] = useConfirm("Change Role", "Are you sure you want to change this user's role?");
    const [LeaveDialog, confirmLeave] = useConfirm("Leave workspace", "Are you sure you want to leave this workspace?");
    const [RemoveDialog, confirmRemove] = useConfirm("Remove Member", "Are you sure you want to Kick this member Out?");


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


      const requestForCurrentMember = await fetch("/api/workspace/member", {
        method: "POST",
        body: JSON.stringify({ id: workspaceId})
      })

      const responseForCurrentMember = await requestForCurrentMember.json();

      if (responseForCurrentMember.success) {
        setCurrentMember(responseForCurrentMember.member);
      } else {
        setCurrentMember(null);
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

    const onRemove = async () => {

        const ok = await confirmRemove();

        if (!ok) return;

        const removeMember = await fetch("/api/workspace/update/delete", {
            method: "POST",
            body: JSON.stringify({ workspaceId, id: profileMemberId})
          })
    
          const response = await removeMember.json();
    
          if (response.success) {
            toast.success("Member kicked out!");
            onClose();
          } else {
            toast.error("Something went wrong!");
          }
    }

    const onLeave = async () => {

        const ok = await confirmLeave();

        if (!ok) return;
        
        const leaveWorkspace = await fetch("/api/workspace/update/leave", {
            method: "POST",
            body: JSON.stringify({ workspaceId })
          })
    
          const response = await leaveWorkspace.json();
    
          if (response.success) {
            router.push("/");
            toast.success(response.message);
          } else {
            toast.error("Something went wrong!");
          }
    }

    const onRoleChange = async (role: string) => {
        console.log("Whassup?");
        const ok = await confirmUpdate();

        if (!ok) return;
        
        const roleChange = await fetch("/api/workspace/update/role", {
            method: "POST",
            body: JSON.stringify({ workspaceId, id: profileMemberId, role })
          })
    
          const response = await roleChange.json();
    
          if (response.success) {
            onClose();
            toast.success(response.message);
          } else {
            toast.error("Something went wrong!");
          }
    }

    console.log(profile);
    const fallback = profile.user.name.charAt(0).toUpperCase();

  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={20} defaultSize={29}>
        <RemoveDialog />
        <LeaveDialog />
        <UpdateDialog />
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
                {(currentMember?.role === "admin" && currentMember?.id !== Number(profileMemberId)) ? (
                    <div className="flex items-center gap-2 mt-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full capitalize">
                                    {profile.role} <ChevronDown className="size-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                <DropdownMenuRadioGroup defaultValue={profile.role} onValueChange={(role) => onRoleChange(role)}>
                                    <DropdownMenuRadioItem value="admin">
                                        Admin
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="member">
                                        Member
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>

                        </DropdownMenu>

                        <Button variant="outline" className="w-full" onClick={onRemove}>
                            Remove 
                        </Button>
                    </div>
                ) : (currentMember?.role !== "admin" && currentMember?.id === Number(profileMemberId)) ? (
                    <div className="mt-4">
                        <Button variant="outline" className="w-full" onClick={onLeave}>
                            Leave 
                        </Button>                        
                    </div>
                ) : null}
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
